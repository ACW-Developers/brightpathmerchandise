import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Eye, MapPin, Package, Truck, CheckCircle2, Clock, PackageCheck } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { TRACKING_STATUSES } from "@/types/product";
import type { Order, TrackingStatus } from "@/types/product";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  confirmed: "bg-blue-500/20 text-blue-400",
  packaging: "bg-orange-500/20 text-orange-400",
  shipping: "bg-purple-500/20 text-purple-400",
  delivered: "bg-green-500/20 text-green-400",
  picked_up: "bg-emerald-500/20 text-emerald-400",
};

const OrdersPage = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) navigate("/login");
  }, [user, isAdmin, authLoading, navigate]);

  const fetchOrders = async () => {
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    setOrders((data as unknown as Order[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) fetchOrders();
  }, [isAdmin]);

  const handleUpdateStatus = async (orderId: string, newStatus: TrackingStatus) => {
    setUpdating(true);
    const { error } = await supabase
      .from("orders")
      .update({ tracking_status: newStatus, status: newStatus === "delivered" || newStatus === "picked_up" ? "completed" : "pending" } as any)
      .eq("id", orderId);

    if (error) {
      toast({ title: "Update failed", variant: "destructive" });
    } else {
      toast({ title: "Status updated", description: `Order status set to ${TRACKING_STATUSES.find(s => s.value === newStatus)?.label}` });
      await fetchOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, tracking_status: newStatus } : null);
      }
    }
    setUpdating(false);
  };

  if (authLoading || loading) {
    return <AdminLayout title="Orders"><div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></AdminLayout>;
  }

  return (
    <AdminLayout title="Orders">
      <p className="text-muted-foreground text-sm mb-6">{orders.length} orders</p>
      <div className="glass-card overflow-hidden overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Tracking</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow><TableCell colSpan={9} className="text-center py-8 text-muted-foreground">No orders yet.</TableCell></TableRow>
            ) : orders.map(o => (
              <TableRow key={o.id}>
                <TableCell className="font-mono text-xs">{o.tracking_number || o.id.slice(0, 8).toUpperCase()}</TableCell>
                <TableCell className="text-sm">{new Date(o.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="font-medium">{o.customer_name}</TableCell>
                <TableCell className="hidden md:table-cell text-sm">{o.customer_email}</TableCell>
                <TableCell className="text-sm">{Array.isArray(o.items) ? (o.items as any[]).length : 0}</TableCell>
                <TableCell className="font-semibold">${o.total_amount.toFixed(2)}</TableCell>
                <TableCell>
                  <span className="text-xs capitalize">{(o.payment_method || "pending").replace(/_/g, " ")}</span>
                </TableCell>
                <TableCell>
                  <Select
                    value={o.tracking_status || "pending"}
                    onValueChange={(v) => handleUpdateStatus(o.id, v as TrackingStatus)}
                    disabled={updating}
                  >
                    <SelectTrigger className="h-7 text-xs w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TRACKING_STATUSES.map(s => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSelectedOrder(o)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => {
                      navigator.clipboard.writeText(o.tracking_number || o.id);
                      toast({ title: "Tracking # copied" });
                    }}>
                      <Package className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-space">Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-4">
                  <h4 className="text-xs text-muted-foreground mb-2 font-semibold uppercase">Customer</h4>
                  <p className="font-medium">{selectedOrder.customer_name}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.customer_email}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.customer_phone || "—"}</p>
                  {selectedOrder.alt_contact_name && (
                    <div className="mt-2 pt-2 border-t border-border">
                      <p className="text-xs text-muted-foreground">Alt Contact</p>
                      <p className="text-sm font-medium">{selectedOrder.alt_contact_name}</p>
                      <p className="text-sm text-muted-foreground">{selectedOrder.alt_contact_phone}</p>
                    </div>
                  )}
                </div>
                <div className="glass-card p-4">
                  <h4 className="text-xs text-muted-foreground mb-2 font-semibold uppercase">Delivery</h4>
                  <p className="text-sm font-medium">{selectedOrder.delivery_address || "—"}</p>
                  <p className="text-sm text-muted-foreground">
                    {[selectedOrder.delivery_city, selectedOrder.delivery_state, selectedOrder.delivery_zip].filter(Boolean).join(", ")}
                  </p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.delivery_country}</p>
                  {selectedOrder.delivery_instructions && (
                    <p className="text-xs text-muted-foreground mt-2 italic">📝 {selectedOrder.delivery_instructions}</p>
                  )}
                </div>
              </div>

              {/* Order info */}
              <div className="glass-card p-4">
                <h4 className="text-xs text-muted-foreground mb-2 font-semibold uppercase">Order Info</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Tracking #</p>
                    <p className="font-mono font-bold text-primary text-xs">{selectedOrder.tracking_number || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Payment</p>
                    <p className="font-medium capitalize">{(selectedOrder.payment_method || "pending").replace(/_/g, " ")}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="font-bold text-primary">${selectedOrder.total_amount.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Status control */}
              <div className="glass-card p-4">
                <h4 className="text-xs text-muted-foreground mb-3 font-semibold uppercase">Update Status</h4>
                <div className="flex flex-wrap gap-2">
                  {TRACKING_STATUSES.map(s => (
                    <Button
                      key={s.value}
                      variant={selectedOrder.tracking_status === s.value ? "default" : "outline"}
                      size="sm"
                      className="text-xs"
                      disabled={updating}
                      onClick={() => handleUpdateStatus(selectedOrder.id, s.value)}
                    >
                      {s.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Items */}
              <div className="glass-card p-4">
                <h4 className="text-xs text-muted-foreground mb-2 font-semibold uppercase">Items</h4>
                <div className="space-y-2">
                  {Array.isArray(selectedOrder.items) && (selectedOrder.items as any[]).map((item: any, i: number) => (
                    <div key={i} className="flex justify-between text-sm">
                      <div>
                        <span>{item.name} × {item.quantity}</span>
                        {item.color && <span className="inline-flex items-center gap-1 ml-2 text-xs text-muted-foreground"><span className="w-3 h-3 rounded-full border border-white/20 inline-block" style={{ backgroundColor: item.color }} /></span>}
                        {item.size && <span className="text-xs text-muted-foreground ml-1 bg-muted px-1.5 py-0.5 rounded">{item.size}</span>}
                      </div>
                      <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map */}
              {selectedOrder.latitude && selectedOrder.longitude && (
                <div className="glass-card p-4">
                  <h4 className="text-xs text-muted-foreground mb-2 font-semibold uppercase flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Delivery Location
                  </h4>
                  <div className="rounded-xl overflow-hidden border border-border">
                    <iframe
                      title="Delivery Location"
                      width="100%"
                      height="300"
                      style={{ border: 0 }}
                      loading="lazy"
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedOrder.longitude - 0.01},${selectedOrder.latitude - 0.01},${selectedOrder.longitude + 0.01},${selectedOrder.latitude + 0.01}&layer=mapnik&marker=${selectedOrder.latitude},${selectedOrder.longitude}`}
                    />
                  </div>
                  <a
                    href={`https://www.google.com/maps?q=${selectedOrder.latitude},${selectedOrder.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline mt-2 inline-block"
                  >
                    Open in Google Maps ↗
                  </a>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default OrdersPage;
