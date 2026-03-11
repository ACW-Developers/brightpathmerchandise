import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Plus, Loader2, Eye, Trash2, Printer } from "lucide-react";
import logo from "@/assets/logo/logo.png";

interface InvoiceItem { description: string; quantity: number; price: number; }
interface Invoice {
  id: string; invoice_number: string; customer_name: string; customer_email: string;
  customer_phone: string | null; items: InvoiceItem[]; subtotal: number; tax: number;
  total_amount: number; status: string; due_date: string | null; notes: string | null; created_at: string;
}

const InvoicesPage = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewInvoice, setViewInvoice] = useState<Invoice | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    customer_name: "", customer_email: "", customer_phone: "",
    items: [{ description: "", quantity: 1, price: 0 }] as InvoiceItem[],
    tax_rate: 0, notes: "", due_date: "", status: "draft",
  });
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) navigate("/login");
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => { if (isAdmin) fetchInvoices(); }, [isAdmin]);

  const fetchInvoices = async () => {
    const { data } = await supabase.from("invoices").select("*").order("created_at", { ascending: false });
    setInvoices((data as unknown as Invoice[]) || []);
    setLoading(false);
  };

  const subtotal = form.items.reduce((s, i) => s + i.quantity * i.price, 0);
  const tax = subtotal * (form.tax_rate / 100);
  const total = subtotal + tax;

  const addItem = () => setForm(f => ({ ...f, items: [...f.items, { description: "", quantity: 1, price: 0 }] }));
  const removeItem = (idx: number) => setForm(f => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));
  const updateItem = (idx: number, field: string, value: any) => {
    setForm(f => ({ ...f, items: f.items.map((item, i) => i === idx ? { ...item, [field]: value } : item) }));
  };

  const handleSave = async () => {
    if (!form.customer_name || !form.customer_email || form.items.length === 0) {
      toast({ title: "Missing info", variant: "destructive" }); return;
    }
    setSaving(true);
    const num = `INV-${Date.now().toString(36).toUpperCase()}`;
    const { error } = await supabase.from("invoices").insert({
      invoice_number: num, customer_name: form.customer_name, customer_email: form.customer_email,
      customer_phone: form.customer_phone || null, items: form.items as any, subtotal, tax,
      total_amount: total, status: form.status, due_date: form.due_date || null, notes: form.notes || null,
    });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Invoice created" }); setDialogOpen(false); fetchInvoices(); }
    setSaving(false);
  };

  const deleteInvoice = async (id: string) => {
    if (!confirm("Delete this invoice?")) return;
    await supabase.from("invoices").delete().eq("id", id);
    toast({ title: "Deleted" }); fetchInvoices();
  };

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<html><head><title>Invoice</title><style>body{font-family:Arial,sans-serif;padding:40px;color:#333}table{width:100%;border-collapse:collapse;margin:20px 0}th,td{border:1px solid #ddd;padding:10px;text-align:left}th{background:#f5f5f5}.header{display:flex;justify-content:space-between;align-items:start;margin-bottom:30px}.logo{height:50px}.total{text-align:right;font-size:20px;font-weight:bold;margin-top:20px}.footer{margin-top:40px;padding-top:20px;border-top:1px solid #ddd;text-align:center;color:#888;font-size:12px}</style></head><body>${content.innerHTML}</body></html>`);
    w.document.close();
    w.print();
  };

  if (authLoading || loading) {
    return <AdminLayout title="Invoices"><div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></AdminLayout>;
  }

  return (
    <AdminLayout title="Invoices">
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground text-sm">{invoices.length} invoices</p>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-1"><Plus className="w-4 h-4" /> Create Invoice</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle className="font-space">New Invoice</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Customer Name *</Label><Input value={form.customer_name} onChange={e => setForm(f => ({ ...f, customer_name: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Email *</Label><Input value={form.customer_email} onChange={e => setForm(f => ({ ...f, customer_email: e.target.value }))} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Phone</Label><Input value={form.customer_phone} onChange={e => setForm(f => ({ ...f, customer_phone: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Due Date</Label><Input type="date" value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))} /></div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Items</Label>
                  <Button variant="outline" size="sm" onClick={addItem}>+ Add Item</Button>
                </div>
                {form.items.map((item, i) => (
                  <div key={i} className="grid grid-cols-[1fr_60px_80px_30px] gap-2 mb-2 items-end">
                    <Input placeholder="Description" value={item.description} onChange={e => updateItem(i, "description", e.target.value)} />
                    <Input type="number" placeholder="Qty" value={item.quantity} onChange={e => updateItem(i, "quantity", parseInt(e.target.value) || 0)} />
                    <Input type="number" step="0.01" placeholder="Price" value={item.price} onChange={e => updateItem(i, "price", parseFloat(e.target.value) || 0)} />
                    <Button variant="ghost" size="icon" onClick={() => removeItem(i)} className="h-9"><Trash2 className="w-3 h-3 text-destructive" /></Button>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Tax Rate (%)</Label><Input type="number" step="0.1" value={form.tax_rate} onChange={e => setForm(f => ({ ...f, tax_rate: parseFloat(e.target.value) || 0 }))} /></div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2"><Label>Notes</Label><Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Thank you for your business!" /></div>

              <div className="border-t border-border pt-4 text-right space-y-1">
                <p className="text-sm text-muted-foreground">Subtotal: ${subtotal.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Tax: ${tax.toFixed(2)}</p>
                <p className="text-lg font-bold text-primary">Total: ${total.toFixed(2)}</p>
              </div>

              <Button onClick={handleSave} disabled={saving} className="w-full">
                {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />} Create Invoice
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Invoice preview modal */}
      {viewInvoice && (
        <Dialog open={!!viewInvoice} onOpenChange={() => setViewInvoice(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Invoice {viewInvoice.invoice_number}</span>
                <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1"><Printer className="w-4 h-4" /> Print</Button>
              </DialogTitle>
            </DialogHeader>
            <div ref={printRef}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 24 }}>
                <div>
                  <img src={logo} alt="Logo" style={{ height: 40, marginBottom: 8 }} />
                  <h2 style={{ fontSize: 20, fontWeight: "bold", margin: 0 }}>BrightPath Merchandise</h2>
                  <p style={{ color: "#888", fontSize: 12 }}>Phoenix, Arizona</p>
                  <p style={{ color: "#888", fontSize: 12 }}>+1 (520) 736-1677</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <h3 style={{ fontSize: 24, fontWeight: "bold", color: "#38bdf8" }}>INVOICE</h3>
                  <p style={{ fontSize: 12, color: "#888" }}>{viewInvoice.invoice_number}</p>
                  <p style={{ fontSize: 12, color: "#888" }}>Date: {new Date(viewInvoice.created_at).toLocaleDateString()}</p>
                  {viewInvoice.due_date && <p style={{ fontSize: 12, color: "#888" }}>Due: {new Date(viewInvoice.due_date).toLocaleDateString()}</p>}
                </div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontWeight: "bold" }}>Bill To:</p>
                <p>{viewInvoice.customer_name}</p>
                <p style={{ color: "#888", fontSize: 12 }}>{viewInvoice.customer_email}</p>
                {viewInvoice.customer_phone && <p style={{ color: "#888", fontSize: 12 }}>{viewInvoice.customer_phone}</p>}
              </div>
              <table>
                <thead><tr><th>Description</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
                <tbody>
                  {(viewInvoice.items as unknown as InvoiceItem[]).map((item, i) => (
                    <tr key={i}>
                      <td>{item.description}</td>
                      <td>{item.quantity}</td>
                      <td>${Number(item.price).toFixed(2)}</td>
                      <td>${(item.quantity * Number(item.price)).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ textAlign: "right", marginTop: 20 }}>
                <p>Subtotal: ${Number(viewInvoice.subtotal).toFixed(2)}</p>
                <p>Tax: ${Number(viewInvoice.tax).toFixed(2)}</p>
                <p style={{ fontSize: 20, fontWeight: "bold" }}>Total: ${Number(viewInvoice.total_amount).toFixed(2)}</p>
              </div>
              {viewInvoice.notes && <div style={{ marginTop: 30, padding: 16, background: "#f9f9f9", borderRadius: 8 }}><p style={{ fontStyle: "italic", color: "#666" }}>{viewInvoice.notes}</p></div>}
              <div className="footer" style={{ marginTop: 40, paddingTop: 20, borderTop: "1px solid #ddd", textAlign: "center", color: "#888", fontSize: 12 }}>
                <p>Thank you for choosing BrightPath Merchandise!</p>
                <p>For questions, contact us at davidirihose94@gmail.com</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <div className="glass-card overflow-hidden overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No invoices yet.</TableCell></TableRow>
            ) : invoices.map(inv => (
              <TableRow key={inv.id}>
                <TableCell className="font-mono text-sm">{inv.invoice_number}</TableCell>
                <TableCell className="font-medium">{inv.customer_name}</TableCell>
                <TableCell className="hidden md:table-cell text-sm">{new Date(inv.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="font-semibold">${Number(inv.total_amount).toFixed(2)}</TableCell>
                <TableCell>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${inv.status === "paid" ? "bg-green-500/20 text-green-400" : inv.status === "sent" ? "bg-blue-500/20 text-blue-400" : "bg-muted text-muted-foreground"}`}>
                    {inv.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => setViewInvoice(inv)}><Eye className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteInvoice(inv.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
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

export default InvoicesPage;
