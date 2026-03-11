import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import StoreNavigation from "@/components/store/StoreNavigation";
import StoreFooter from "@/components/store/StoreFooter";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Package, Search, Loader2, CheckCircle2, Clock, Truck, PackageCheck, MapPin } from "lucide-react";
import { TRACKING_STATUSES } from "@/types/product";
import type { Order, TrackingStatus } from "@/types/product";

const statusIcons: Record<TrackingStatus, React.ReactNode> = {
  pending: <Clock className="w-5 h-5" />,
  confirmed: <CheckCircle2 className="w-5 h-5" />,
  packaging: <Package className="w-5 h-5" />,
  shipping: <Truck className="w-5 h-5" />,
  delivered: <MapPin className="w-5 h-5" />,
  picked_up: <PackageCheck className="w-5 h-5" />,
};

const TrackOrderPage = () => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async () => {
    if (!trackingNumber.trim()) return;
    setLoading(true);
    setNotFound(false);
    setOrder(null);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("tracking_number", trackingNumber.trim())
      .single();

    if (error || !data) {
      setNotFound(true);
    } else {
      setOrder(data as unknown as Order);
    }
    setLoading(false);
  };

  const currentStatusIndex = order
    ? TRACKING_STATUSES.findIndex(s => s.value === order.tracking_status)
    : -1;

  return (
    <div className="min-h-screen bg-background">
      <StoreNavigation />
      <main className="pt-20 pb-16 px-4 md:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <Package className="w-12 h-12 text-primary mx-auto mb-4" />
            <h1 className="text-3xl font-bold font-space mb-2">Track Your Order</h1>
            <p className="text-muted-foreground">Enter your tracking number to see the current status of your order.</p>
          </div>

          <div className="flex gap-2 mb-8">
            <div className="flex-1">
              <Label className="sr-only">Tracking Number</Label>
              <Input
                value={trackingNumber}
                onChange={e => setTrackingNumber(e.target.value)}
                placeholder="Enter tracking number (e.g. TRK-...)"
                className="h-12 text-base font-mono"
                onKeyDown={e => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} disabled={loading} size="lg" className="h-12 gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Track
            </Button>
          </div>

          {notFound && (
            <div className="glass-card p-8 text-center">
              <p className="text-lg font-semibold mb-2">Order not found</p>
              <p className="text-sm text-muted-foreground">Please check your tracking number and try again.</p>
            </div>
          )}

          {order && (
            <div className="space-y-6">
              {/* Order summary */}
              <div className="glass-card p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Tracking Number</p>
                    <p className="font-mono font-bold text-primary">{order.tracking_number}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Order Date</p>
                    <p className="text-sm font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Customer</p>
                    <p className="font-medium">{order.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="font-bold text-primary">${order.total_amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Payment</p>
                    <p className="font-medium capitalize">{(order.payment_method || "pending").replace(/_/g, " ")}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Delivery</p>
                    <p className="font-medium text-xs">{order.delivery_city || "—"}{order.delivery_state ? `, ${order.delivery_state}` : ""}</p>
                  </div>
                </div>
              </div>

              {/* Tracking timeline */}
              <div className="glass-card p-6">
                <h3 className="font-semibold font-space mb-6">Order Status</h3>
                <div className="space-y-0">
                  {TRACKING_STATUSES.map((status, i) => {
                    const isCompleted = i <= currentStatusIndex;
                    const isCurrent = i === currentStatusIndex;
                    const isLast = i === TRACKING_STATUSES.length - 1;

                    return (
                      <div key={status.value} className="flex gap-4">
                        {/* Timeline line + dot */}
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                            isCurrent ? "bg-primary text-primary-foreground ring-4 ring-primary/20" :
                            isCompleted ? "bg-primary/20 text-primary" :
                            "bg-muted text-muted-foreground"
                          }`}>
                            {statusIcons[status.value]}
                          </div>
                          {!isLast && (
                            <div className={`w-0.5 h-12 ${isCompleted && i < currentStatusIndex ? "bg-primary/40" : "bg-border"}`} />
                          )}
                        </div>

                        {/* Content */}
                        <div className="pb-8">
                          <p className={`font-semibold text-sm ${isCurrent ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"}`}>
                            {status.label}
                          </p>
                          <p className={`text-xs ${isCurrent ? "text-muted-foreground" : "text-muted-foreground/60"}`}>
                            {status.description}
                          </p>
                          {isCurrent && (
                            <span className="inline-block mt-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                              Current Status
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Items */}
              <div className="glass-card p-6">
                <h3 className="font-semibold font-space mb-4">Items</h3>
                <div className="space-y-2">
                  {Array.isArray(order.items) && (order.items as any[]).map((item: any, i: number) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span>{item.name} × {item.quantity}</span>
                      <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <StoreFooter />
      <WhatsAppWidget />
    </div>
  );
};

export default TrackOrderPage;
