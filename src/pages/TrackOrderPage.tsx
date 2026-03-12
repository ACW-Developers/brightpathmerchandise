import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import StoreNavigation from "@/components/store/StoreNavigation";
import StoreFooter from "@/components/store/StoreFooter";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Package, Search, Loader2, CheckCircle2, Clock, Truck, PackageCheck, MapPin, Mail } from "lucide-react";
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

// Shop location: Amsterdam Rd, Maricopa, Arizona
const SHOP_LAT = 33.0581;
const SHOP_LNG = -112.0476;

const TrackOrderPage = () => {
  const [searchType, setSearchType] = useState<"tracking" | "email">("email");
  const [searchValue, setSearchValue] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchValue.trim()) return;
    setLoading(true);
    setSearched(true);
    setSelectedOrder(null);

    let query = supabase.from("orders").select("*").order("created_at", { ascending: false });

    if (searchType === "tracking") {
      query = query.eq("tracking_number", searchValue.trim());
    } else {
      query = query.eq("customer_email", searchValue.trim().toLowerCase());
    }

    const { data } = await query;
    const results = (data as unknown as Order[]) || [];
    setOrders(results);
    if (results.length === 1) setSelectedOrder(results[0]);
    setLoading(false);
  };

  const currentStatusIndex = selectedOrder
    ? TRACKING_STATUSES.findIndex(s => s.value === selectedOrder.tracking_status)
    : -1;

  const mapUrl = selectedOrder?.latitude && selectedOrder?.longitude
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${Math.min(SHOP_LNG, selectedOrder.longitude) - 0.05},${Math.min(SHOP_LAT, selectedOrder.latitude) - 0.05},${Math.max(SHOP_LNG, selectedOrder.longitude) + 0.05},${Math.max(SHOP_LAT, selectedOrder.latitude) + 0.05}&layer=mapnik&marker=${selectedOrder.latitude},${selectedOrder.longitude}`
    : null;

  return (
    <div className="min-h-screen bg-background">
      <StoreNavigation />
      <main className="pt-20 pb-16 px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <Package className="w-12 h-12 text-primary mx-auto mb-4" />
            <h1 className="text-3xl font-bold font-space mb-2">Track Your Orders</h1>
            <p className="text-muted-foreground">Search by email to see all your orders, or use a tracking number.</p>
          </div>

          {/* Search type toggle */}
          <div className="flex gap-2 mb-4 justify-center">
            <Button
              variant={searchType === "email" ? "default" : "outline"}
              size="sm"
              onClick={() => { setSearchType("email"); setSearchValue(""); setSearched(false); }}
              className="gap-1"
            >
              <Mail className="w-4 h-4" /> By Email
            </Button>
            <Button
              variant={searchType === "tracking" ? "default" : "outline"}
              size="sm"
              onClick={() => { setSearchType("tracking"); setSearchValue(""); setSearched(false); }}
              className="gap-1"
            >
              <Package className="w-4 h-4" /> By Tracking #
            </Button>
          </div>

          <div className="flex gap-2 mb-8">
            <div className="flex-1">
              <Label className="sr-only">{searchType === "email" ? "Email" : "Tracking Number"}</Label>
              <Input
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                placeholder={searchType === "email" ? "Enter your email address" : "Enter tracking number (e.g. TRK-...)"}
                className="h-12 text-base"
                onKeyDown={e => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} disabled={loading} size="lg" className="h-12 gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Track
            </Button>
          </div>

          {searched && orders.length === 0 && !loading && (
            <div className="glass-card p-8 text-center">
              <p className="text-lg font-semibold mb-2">No orders found</p>
              <p className="text-sm text-muted-foreground">Please check your {searchType === "email" ? "email" : "tracking number"} and try again.</p>
            </div>
          )}

          {/* Order list */}
          {orders.length > 1 && !selectedOrder && (
            <div className="space-y-3 mb-6">
              <h3 className="font-semibold font-space text-sm text-muted-foreground">
                Found {orders.length} orders
              </h3>
              {orders.map(o => (
                <button
                  key={o.id}
                  onClick={() => setSelectedOrder(o)}
                  className="w-full glass-card p-4 text-left hover:border-primary/40 transition-all"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-mono text-primary text-sm font-bold">{o.tracking_number || "No tracking"}</p>
                      <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">${o.total_amount.toFixed(2)}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        o.tracking_status === "delivered" || o.tracking_status === "picked_up"
                          ? "bg-green-500/20 text-green-400"
                          : o.tracking_status === "shipping"
                          ? "bg-purple-500/20 text-purple-400"
                          : "bg-amber-500/20 text-amber-400"
                      }`}>
                        {TRACKING_STATUSES.find(s => s.value === o.tracking_status)?.label || o.tracking_status}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {Array.isArray(o.items) && (o.items as any[]).slice(0, 3).map((item: any, i: number) => (
                      <span key={i} className="text-xs bg-muted px-2 py-0.5 rounded-full">{item.name}</span>
                    ))}
                    {Array.isArray(o.items) && (o.items as any[]).length > 3 && (
                      <span className="text-xs text-muted-foreground">+{(o.items as any[]).length - 3} more</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Selected order detail */}
          {selectedOrder && (
            <div className="space-y-6">
              {orders.length > 1 && (
                <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(null)} className="gap-1 text-muted-foreground">
                  ← Back to all orders
                </Button>
              )}

              {/* Order summary */}
              <div className="glass-card p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Tracking Number</p>
                    <p className="font-mono font-bold text-primary">{selectedOrder.tracking_number}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Order Date</p>
                    <p className="text-sm font-medium">{new Date(selectedOrder.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Customer</p>
                    <p className="font-medium">{selectedOrder.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="font-bold text-primary">${selectedOrder.total_amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Payment</p>
                    <p className="font-medium capitalize">{(selectedOrder.payment_method || "pending").replace(/_/g, " ")}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Delivery</p>
                    <p className="font-medium text-xs">{selectedOrder.delivery_city || "—"}{selectedOrder.delivery_state ? `, ${selectedOrder.delivery_state}` : ""}</p>
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

              {/* Map with route */}
              {mapUrl && (
                <div className="glass-card p-6">
                  <h3 className="font-semibold font-space mb-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" /> Delivery Route
                  </h3>
                  <div className="rounded-xl overflow-hidden border border-border mb-3">
                    <iframe
                      title="Delivery Route"
                      width="100%"
                      height="350"
                      style={{ border: 0 }}
                      loading="lazy"
                      src={mapUrl}
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-primary" />
                      <span className="text-muted-foreground">Shop: Amsterdam Rd, Maricopa, AZ</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-destructive" />
                      <span className="text-muted-foreground">
                        Delivery: {[selectedOrder.delivery_address, selectedOrder.delivery_city, selectedOrder.delivery_state].filter(Boolean).join(", ")}
                      </span>
                    </div>
                  </div>
                  <a
                    href={`https://www.google.com/maps/dir/${SHOP_LAT},${SHOP_LNG}/${selectedOrder.latitude},${selectedOrder.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline mt-3 inline-block"
                  >
                    View full route on Google Maps ↗
                  </a>
                </div>
              )}

              {/* Items */}
              <div className="glass-card p-6">
                <h3 className="font-semibold font-space mb-4">Items</h3>
                <div className="space-y-2">
                  {Array.isArray(selectedOrder.items) && (selectedOrder.items as any[]).map((item: any, i: number) => (
                    <div key={i} className="flex justify-between text-sm">
                      <div>
                        <span>{item.name} × {item.quantity}</span>
                        {item.color && <span className="text-xs text-muted-foreground ml-2">Color: {item.color}</span>}
                        {item.size && <span className="text-xs text-muted-foreground ml-2">Size: {item.size}</span>}
                      </div>
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
