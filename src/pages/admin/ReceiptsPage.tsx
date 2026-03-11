import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Eye, Printer } from "lucide-react";
import logo from "@/assets/logo/logo.png";

interface ReceiptData {
  id: string; receipt_number: string; customer_name: string; customer_email: string;
  items: any[]; subtotal: number; tax: number; total_amount: number;
  payment_method: string; payment_status: string; created_at: string;
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

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<html><head><title>Receipt</title><style>body{font-family:Arial,sans-serif;padding:40px;color:#333;max-width:400px;margin:0 auto}table{width:100%;border-collapse:collapse;margin:10px 0}td{padding:4px 0;font-size:13px}.center{text-align:center}.right{text-align:right}.line{border-top:1px dashed #ccc;margin:10px 0}.bold{font-weight:bold}.logo{height:40px}</style></head><body>${content.innerHTML}</body></html>`);
    w.document.close();
    w.print();
  };

  if (authLoading || loading) {
    return <AdminLayout title="Receipts"><div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></AdminLayout>;
  }

  return (
    <AdminLayout title="Receipts">
      <p className="text-muted-foreground text-sm mb-6">{receipts.length} receipts</p>

      {viewReceipt && (
        <Dialog open={!!viewReceipt} onOpenChange={() => setViewReceipt(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Receipt</span>
                <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1"><Printer className="w-4 h-4" /> Print</Button>
              </DialogTitle>
            </DialogHeader>
            <div ref={printRef}>
              <div className="center" style={{ textAlign: "center", marginBottom: 16 }}>
                <img src={logo} alt="Logo" style={{ height: 40, marginBottom: 8 }} />
                <h3 style={{ margin: 0, fontWeight: "bold" }}>BrightPath Merchandise</h3>
                <p style={{ fontSize: 12, color: "#888" }}>Phoenix, Arizona • +1 (520) 736-1677</p>
                <div className="line" style={{ borderTop: "1px dashed #ccc", margin: "10px 0" }} />
                <p style={{ fontWeight: "bold" }}>{viewReceipt.receipt_number}</p>
                <p style={{ fontSize: 12, color: "#888" }}>{new Date(viewReceipt.created_at).toLocaleString()}</p>
              </div>
              <div className="line" style={{ borderTop: "1px dashed #ccc", margin: "10px 0" }} />
              <table>
                <tbody>
                  {(viewReceipt.items as any[]).map((item: any, i: number) => (
                    <tr key={i}>
                      <td>{item.name || item.description} x{item.quantity}</td>
                      <td style={{ textAlign: "right" }}>${(Number(item.price) * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="line" style={{ borderTop: "1px dashed #ccc", margin: "10px 0" }} />
              <table>
                <tbody>
                  <tr><td>Subtotal</td><td style={{ textAlign: "right" }}>${Number(viewReceipt.subtotal).toFixed(2)}</td></tr>
                  <tr><td>Tax</td><td style={{ textAlign: "right" }}>${Number(viewReceipt.tax).toFixed(2)}</td></tr>
                  <tr><td style={{ fontWeight: "bold", fontSize: 16 }}>Total</td><td style={{ textAlign: "right", fontWeight: "bold", fontSize: 16 }}>${Number(viewReceipt.total_amount).toFixed(2)}</td></tr>
                </tbody>
              </table>
              <div className="line" style={{ borderTop: "1px dashed #ccc", margin: "10px 0" }} />
              <p style={{ textAlign: "center", fontSize: 12, color: "#888" }}>Payment: {viewReceipt.payment_method} — {viewReceipt.payment_status}</p>
              <p style={{ textAlign: "center", fontSize: 12, color: "#888" }}>Customer: {viewReceipt.customer_name}</p>
              <div className="line" style={{ borderTop: "1px dashed #ccc", margin: "10px 0" }} />
              <p style={{ textAlign: "center", fontStyle: "italic", fontSize: 12, color: "#666" }}>Thank you for shopping with BrightPath Merchandise!</p>
              <p style={{ textAlign: "center", fontSize: 11, color: "#aaa" }}>We appreciate your business ❤️</p>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <div className="glass-card overflow-hidden overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Receipt #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {receipts.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No receipts yet.</TableCell></TableRow>
            ) : receipts.map(r => (
              <TableRow key={r.id}>
                <TableCell className="font-mono text-sm">{r.receipt_number}</TableCell>
                <TableCell className="font-medium">{r.customer_name}</TableCell>
                <TableCell className="hidden md:table-cell text-sm">{new Date(r.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="font-semibold">${Number(r.total_amount).toFixed(2)}</TableCell>
                <TableCell>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${r.payment_status === "completed" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                    {r.payment_status}
                  </span>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => setViewReceipt(r)}><Eye className="w-4 h-4" /></Button>
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
