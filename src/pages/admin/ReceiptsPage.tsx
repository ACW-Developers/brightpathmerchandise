import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Eye, Printer, Download, CheckCircle2, Clock, Package } from "lucide-react";
import logo from "@/assets/logo/logo.png";

interface ReceiptData {
  id: string; receipt_number: string; customer_name: string; customer_email: string;
  customer_phone?: string; items: any[]; subtotal: number; tax: number; total_amount: number;
  payment_method: string; payment_status: string; created_at: string; order_id?: string; notes?: string;
}

const ReceiptsPage = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [receipts, setReceipts] = useState<ReceiptData[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewReceipt, setViewReceipt] = useState<ReceiptData | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) navigate("/login");
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      supabase.from("receipts").select("*").order("created_at", { ascending: false }).then(({ data }) => {
        setReceipts((data as unknown as ReceiptData[]) || []);
        setLoading(false);
      });
    }
  }, [isAdmin]);

  const handlePrint = (receipt: ReceiptData) => {
    const w = window.open("", "_blank");
    if (!w) return;
    const items = (receipt.items as any[]);
    w.document.write(`<!DOCTYPE html><html><head><title>Receipt ${receipt.receipt_number}</title>
    <style>
      *{margin:0;padding:0;box-sizing:border-box}
      body{font-family:'Segoe UI',system-ui,sans-serif;padding:30px;max-width:420px;margin:0 auto;color:#1a1a2e}
      .header{text-align:center;padding-bottom:20px;border-bottom:2px solid #e8e8f0}
      .logo{height:48px;margin-bottom:8px}
      .biz-name{font-size:20px;font-weight:700;color:#1a1a2e}
      .biz-info{font-size:11px;color:#666;margin-top:4px}
      .receipt-meta{display:flex;justify-content:space-between;padding:16px 0;border-bottom:1px solid #e8e8f0}
      .meta-label{font-size:11px;color:#888;text-transform:uppercase;letter-spacing:0.5px}
      .meta-value{font-size:13px;font-weight:600;margin-top:2px}
      .items{padding:16px 0}
      .item{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px dotted #e8e8f0}
      .item-name{font-size:13px;font-weight:500}
      .item-qty{font-size:11px;color:#888}
      .item-price{font-size:13px;font-weight:600}
      .totals{padding:16px 0;border-top:2px solid #1a1a2e}
      .total-row{display:flex;justify-content:space-between;padding:4px 0;font-size:13px}
      .total-row.grand{font-size:18px;font-weight:700;padding-top:8px;color:#1a1a2e}
      .footer{text-align:center;padding-top:20px;border-top:1px solid #e8e8f0}
      .footer p{font-size:11px;color:#888;margin:4px 0}
      .thank-you{font-size:14px;font-weight:600;color:#1a1a2e;margin-bottom:4px}
      .customer-info{padding:12px 0;border-bottom:1px solid #e8e8f0}
      .customer-info p{font-size:12px;color:#555;margin:2px 0}
      .status-badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;background:#dcfce7;color:#16a34a}
      @media print{body{padding:15px}@page{margin:10mm}}
    </style></head><body>
      <div class="header">
        <div class="biz-name">BrightPath Merchandise</div>
        <div class="biz-info">Phoenix, Arizona • +1 (520) 736-1677</div>
        <div class="biz-info">brightpathmerchandise.com</div>
      </div>
      <div class="receipt-meta">
        <div><div class="meta-label">Receipt No</div><div class="meta-value">${receipt.receipt_number}</div></div>
        <div style="text-align:right"><div class="meta-label">Date</div><div class="meta-value">${new Date(receipt.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</div></div>
      </div>
      <div class="customer-info">
        <p><strong>Customer:</strong> ${receipt.customer_name}</p>
        <p><strong>Email:</strong> ${receipt.customer_email}</p>
        ${receipt.customer_phone ? `<p><strong>Phone:</strong> ${receipt.customer_phone}</p>` : ""}
      </div>
      <div class="items">
        ${items.map(item => `<div class="item"><div><div class="item-name">${item.name || item.description}</div><div class="item-qty">Qty: ${item.quantity}${item.size ? ` • Size: ${item.size}` : ""}${item.color ? ` • Color: ${item.color}` : ""}</div></div><div class="item-price">$${(Number(item.price) * item.quantity).toFixed(2)}</div></div>`).join("")}
      </div>
      <div class="totals">
        <div class="total-row"><span>Subtotal</span><span>$${Number(receipt.subtotal).toFixed(2)}</span></div>
        <div class="total-row"><span>Tax</span><span>$${Number(receipt.tax).toFixed(2)}</span></div>
        <div class="total-row grand"><span>Total</span><span>$${Number(receipt.total_amount).toFixed(2)}</span></div>
      </div>
      <div style="text-align:center;padding:12px 0"><span class="status-badge">${receipt.payment_status.toUpperCase()}</span></div>
      <div class="footer">
        <p class="thank-you">Thank you for your purchase! 🎉</p>
        <p>We appreciate your business and hope to serve you again.</p>
        <p style="margin-top:8px">For support: davidirihose94@gmail.com</p>
      </div>
    </body></html>`);
    w.document.close();
    setTimeout(() => w.print(), 300);
  };

  if (authLoading || loading) {
    return <AdminLayout title="Receipts"><div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></AdminLayout>;
  }

  return (
    <AdminLayout title="Receipts">
      <p className="text-muted-foreground text-sm mb-6">{receipts.length} receipts</p>

      {/* Digital Receipt Viewer */}
      {viewReceipt && (
        <Dialog open={!!viewReceipt} onOpenChange={() => setViewReceipt(null)}>
          <DialogContent className="max-w-md p-0 overflow-hidden">
            <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-6">
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span className="font-space">Digital Receipt</span>
                  <Button variant="outline" size="sm" onClick={() => handlePrint(viewReceipt)} className="gap-1.5">
                    <Printer className="w-3.5 h-3.5" /> Print
                  </Button>
                </DialogTitle>
              </DialogHeader>
            </div>

            <div className="p-6 space-y-5">
              {/* Business header */}
              <div className="text-center pb-4 border-b border-border/40">
                <img src={logo} alt="Logo" className="h-10 mx-auto mb-2" />
                <h3 className="font-bold font-space text-lg">BrightPath Merchandise</h3>
                <p className="text-xs text-muted-foreground">Phoenix, Arizona • +1 (520) 736-1677</p>
              </div>

              {/* Receipt meta */}
              <div className="flex justify-between text-sm">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Receipt No</p>
                  <p className="font-semibold font-mono">{viewReceipt.receipt_number}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Date</p>
                  <p className="font-medium">{new Date(viewReceipt.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</p>
                </div>
              </div>

              {/* Customer */}
              <div className="bg-muted/20 rounded-xl p-3 text-sm">
                <p className="font-semibold">{viewReceipt.customer_name}</p>
                <p className="text-muted-foreground text-xs">{viewReceipt.customer_email}</p>
                {viewReceipt.customer_phone && <p className="text-muted-foreground text-xs">{viewReceipt.customer_phone}</p>}
              </div>

              {/* Items */}
              <div className="space-y-2">
                {(viewReceipt.items as any[]).map((item: any, i: number) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-border/20 last:border-0">
                    <div>
                      <p className="text-sm font-medium">{item.name || item.description}</p>
                      <p className="text-xs text-muted-foreground">
                        Qty: {item.quantity}
                        {item.size && ` • ${item.size}`}
                        {item.color && (
                          <span className="inline-flex items-center gap-1 ml-1">
                            • <span className="w-2.5 h-2.5 rounded-full inline-block border" style={{ background: item.color }} />
                          </span>
                        )}
                      </p>
                    </div>
                    <p className="font-semibold text-sm">${(Number(item.price) * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="bg-muted/20 rounded-xl p-4 space-y-1.5">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span>${Number(viewReceipt.subtotal).toFixed(2)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Tax</span><span>${Number(viewReceipt.tax).toFixed(2)}</span></div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-border/30"><span>Total</span><span>${Number(viewReceipt.total_amount).toFixed(2)}</span></div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                  viewReceipt.payment_status === "completed" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                }`}>
                  {viewReceipt.payment_status === "completed" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                  {viewReceipt.payment_status.charAt(0).toUpperCase() + viewReceipt.payment_status.slice(1)}
                </span>
                <span className="text-xs text-muted-foreground">via {viewReceipt.payment_method}</span>
              </div>

              {/* Footer */}
              <div className="text-center pt-3 border-t border-border/30">
                <p className="text-sm font-semibold">Thank you for your purchase! 🎉</p>
                <p className="text-xs text-muted-foreground mt-1">We appreciate your business</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <div className="glass-card overflow-hidden overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Receipt #</TableHead>
              <TableHead>Order #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {receipts.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No receipts yet.</TableCell></TableRow>
            ) : receipts.map(r => (
              <TableRow key={r.id} className="hover:bg-muted/5">
                <TableCell className="font-mono text-sm">{r.receipt_number}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{(r as any).order_id ? (r as any).order_id.slice(0, 8).toUpperCase() : "—"}</TableCell>
                <TableCell>
                  <p className="font-medium text-sm">{r.customer_name}</p>
                  <p className="text-xs text-muted-foreground">{r.customer_email}</p>
                </TableCell>
                <TableCell className="hidden md:table-cell text-sm">{new Date(r.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="font-semibold">${Number(r.total_amount).toFixed(2)}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${
                    r.payment_status === "completed" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                  }`}>
                    {r.payment_status === "completed" ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    {r.payment_status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => setViewReceipt(r)} title="View"><Eye className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handlePrint(r)} title="Print"><Printer className="w-4 h-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
};

export default ReceiptsPage;
