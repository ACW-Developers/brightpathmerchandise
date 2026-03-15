import { useState, useRef, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ShoppingCart, Minus, Plus, Trash2, CreditCard, Loader2, Check, Printer, ArrowLeft, MapPin, Phone, User, Copy, Banknote, Truck } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import logo from "@/assets/logo/logo.png";

type Step = "cart" | "details" | "delivery" | "payment" | "confirmation";

interface ShippingSettings {
  shipping_fee: number;
  free_shipping_enabled: boolean;
  free_shipping_threshold: number;
}

const DEFAULT_SHIPPING: ShippingSettings = {
  shipping_fee: 0,
  free_shipping_enabled: false,
  free_shipping_threshold: 50,
};

const BANK_DETAILS = {
  bankName: "Chase Bank",
  accountName: "BrightPath Merchandise LLC",
  accountNumber: "****4521",
  routingNumber: "021000021",
};

const CartDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<Step>("cart");
  const [isOrdering, setIsOrdering] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    address: "", city: "", state: "", zip: "", country: "US",
    deliveryInstructions: "",
    altContactName: "", altContactPhone: "",
  });
  const [receiptData, setReceiptData] = useState<any>(null);
  const { items, updateQuantity, removeItem, clearCart, totalItems, totalPrice } = useCartStore();
  const printRef = useRef<HTMLDivElement>(null);
  const [shippingSettings, setShippingSettings] = useState<ShippingSettings>(DEFAULT_SHIPPING);

  useEffect(() => {
    supabase.from("store_settings").select("shipping_fee, free_shipping_enabled, free_shipping_threshold").limit(1).single().then(({ data }) => {
      if (data) {
        setShippingSettings({
          shipping_fee: (data as any).shipping_fee ?? DEFAULT_SHIPPING.shipping_fee,
          free_shipping_enabled: (data as any).free_shipping_enabled ?? DEFAULT_SHIPPING.free_shipping_enabled,
          free_shipping_threshold: (data as any).free_shipping_threshold ?? DEFAULT_SHIPPING.free_shipping_threshold,
        });
      }
    });
  }, []);

  const shippingFee: number = (() => {
    const fee = shippingSettings.shipping_fee;
    if (fee === 0) return 0;
    if (shippingSettings.free_shipping_enabled && totalPrice() >= shippingSettings.free_shipping_threshold) return 0;
    return Math.min(Math.max(fee, 0), 50);
  })();

  const grandTotal = totalPrice() + shippingFee;

  const geocodeAddress = async () => {
    try {
      const fullAddress = `${form.address}, ${form.city}, ${form.state} ${form.zip}, ${form.country}`;
      const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=1`);
      const geoData = await geoRes.json();
      if (geoData.length > 0) {
        return { lat: parseFloat(geoData[0].lat), lng: parseFloat(geoData[0].lon) };
      }
    } catch {}
    return { lat: null, lng: null };
  };

  const handleStripeCheckout = async () => {
    if (!form.name || !form.email) {
      toast({ title: "Missing info", description: "Please fill in your name and email.", variant: "destructive" });
      return;
    }
    if (!form.address || !form.city) {
      toast({ title: "Missing delivery info", description: "Please fill in your delivery address.", variant: "destructive" });
      return;
    }
    setIsOrdering(true);
    try {
      const orderItems = items.map(i => ({
        product_id: i.product.id,
        name: i.product.name,
        price: i.product.is_on_sale && i.product.sale_price ? i.product.sale_price : i.product.price,
        quantity: i.quantity,
        color: i.selectedColor || null,
        size: i.selectedSize || null,
      }));

      const { lat, lng } = await geocodeAddress();

      // Store order metadata in sessionStorage for the success page
      const orderMetadata = {
        phone: form.phone,
        address: form.address,
        city: form.city,
        state: form.state,
        zip: form.zip,
        country: form.country,
        deliveryInstructions: form.deliveryInstructions,
        altContactName: form.altContactName,
        altContactPhone: form.altContactPhone,
        items: orderItems,
        latitude: lat,
        longitude: lng,
      };

      sessionStorage.setItem("checkout_metadata", JSON.stringify(orderMetadata));

      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          items: shippingFee > 0
            ? [...orderItems, { name: "Shipping Fee", price: shippingFee, quantity: 1 }]
            : orderItems,
          customer_email: form.email,
          customer_name: form.name,
          order_metadata: orderMetadata,
        },
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err: any) {
      console.error(err);
      toast({ title: "Checkout failed", description: err.message || "Something went wrong.", variant: "destructive" });
    } finally {
      setIsOrdering(false);
    }
  };

  const handleManualPayOrder = async () => {
    if (!form.name || !form.email) {
      toast({ title: "Missing info", description: "Please fill in your name and email.", variant: "destructive" });
      return;
    }
    if (!form.address || !form.city) {
      toast({ title: "Missing delivery info", description: "Please fill in your delivery address.", variant: "destructive" });
      return;
    }
    setIsOrdering(true);
    try {
      const orderItems = items.map(i => ({
        product_id: i.product.id,
        name: i.product.name,
        price: i.product.is_on_sale && i.product.sale_price ? i.product.sale_price : i.product.price,
        quantity: i.quantity,
        color: i.selectedColor || null,
        size: i.selectedSize || null,
      }));

      const total = grandTotal;
      const receiptNum = `RCP-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
      const trackingNum = `TRK-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

      const { lat, lng } = await geocodeAddress();

      const { data: order, error: orderError } = await supabase.from("orders").insert({
        customer_name: form.name,
        customer_email: form.email,
        customer_phone: form.phone || null,
        items: orderItems as any,
        total_amount: total,
        delivery_address: form.address,
        delivery_city: form.city,
        delivery_state: form.state || null,
        delivery_zip: form.zip || null,
        delivery_country: form.country,
        delivery_instructions: form.deliveryInstructions || null,
        alt_contact_name: form.altContactName || null,
        alt_contact_phone: form.altContactPhone || null,
        payment_method: "bank_transfer",
        tracking_status: "pending" as any,
        tracking_number: trackingNum,
        latitude: lat,
        longitude: lng,
      } as any).select().single();

      if (orderError) throw orderError;

      await supabase.from("receipts").insert({
        receipt_number: receiptNum,
        order_id: (order as any).id,
        customer_name: form.name,
        customer_email: form.email,
        customer_phone: form.phone || null,
        items: orderItems as any,
        subtotal: total,
        tax: 0,
        total_amount: total,
        payment_method: "bank_transfer",
        payment_status: "pending",
      });

      setReceiptData({
        receipt_number: receiptNum,
        tracking_number: trackingNum,
        items: orderItems,
        total,
        shippingFee,
        method: "Bank Transfer (Pending)",
        date: new Date().toLocaleString(),
      });

      clearCart();
      setStep("confirmation");
      toast({ title: "Order placed! Admin has been notified." });
    } catch (err) {
      console.error(err);
      toast({ title: "Order failed", description: "Something went wrong.", variant: "destructive" });
    } finally {
      setIsOrdering(false);
    }
  };

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<html><head><title>Receipt</title><style>body{font-family:Arial,sans-serif;padding:30px;max-width:380px;margin:0 auto;color:#333}table{width:100%;border-collapse:collapse}td{padding:3px 0;font-size:13px}.center{text-align:center}.right{text-align:right}.line{border-top:1px dashed #ccc;margin:8px 0}.bold{font-weight:bold}.logo{height:36px}</style></head><body>${content.innerHTML}</body></html>`);
    w.document.close();
    w.print();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: text });
  };

  const resetAndClose = () => {
    setStep("cart");
    setForm({ name: "", email: "", phone: "", address: "", city: "", state: "", zip: "", country: "US", deliveryInstructions: "", altContactName: "", altContactPhone: "" });
    setReceiptData(null);
    setIsOpen(false);
  };

  const canProceedToDelivery = form.name && form.email;
  const canProceedToPayment = form.address && form.city;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) resetAndClose(); else setIsOpen(true); }}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {totalItems() > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary">
              {totalItems()}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col h-full overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-space">
            {step === "cart" && "Shopping Cart"}
            {step === "details" && "Contact Information"}
            {step === "delivery" && "Delivery Details"}
            {step === "payment" && "Payment"}
            {step === "confirmation" && "Order Confirmed!"}
          </SheetTitle>
          <SheetDescription>
            {step === "cart" && `${totalItems()} item${totalItems() !== 1 ? 's' : ''} in cart`}
            {step === "details" && "Enter your contact information"}
            {step === "delivery" && "Where should we deliver your order?"}
            {step === "payment" && "Choose payment method"}
            {step === "confirmation" && "Thank you for your order"}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col flex-1 pt-4 min-h-0">
          {/* Step: Cart */}
          {step === "cart" && (
            <>
              {items.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-center">
                  <div>
                    <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Your cart is empty</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                    {items.map((item) => {
                      const cartKey = `${item.product.id}|${item.selectedColor || ''}|${item.selectedSize || ''}`;
                      return (
                      <div key={cartKey} className="flex gap-3 p-3 rounded-xl bg-muted/20">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          {item.product.image_url ? (
                            <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xl">🖼</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{item.product.name}</h4>
                          {(item.selectedColor || item.selectedSize) && (
                            <div className="flex items-center gap-2 mt-0.5">
                              {item.selectedColor && (
                                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                  <span className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: item.selectedColor }} />
                                </span>
                              )}
                              {item.selectedSize && (
                                <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded">{item.selectedSize}</span>
                              )}
                            </div>
                          )}
                          <p className="text-sm text-primary font-semibold">
                            ${((item.product.is_on_sale && item.product.sale_price ? item.product.sale_price : item.product.price) * item.quantity).toFixed(2)}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedColor, item.selectedSize)}>
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm w-6 text-center">{item.quantity}</span>
                            <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedColor, item.selectedSize)}>
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto" onClick={() => removeItem(item.product.id, item.selectedColor, item.selectedSize)}>
                              <Trash2 className="h-3 w-3 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      );
                    })}
                  </div>
                  <div className="flex-shrink-0 pt-4 border-t border-border space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${totalPrice().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1"><Truck className="w-3 h-3" /> Shipping</span>
                      <span>{shippingFee === 0 ? <span className="text-primary font-medium">Free Shipping</span> : `$${shippingFee.toFixed(2)}`}</span>
                    </div>
                    {shippingFee === 0 && shippingSettings.free_shipping_enabled && totalPrice() >= shippingSettings.free_shipping_threshold && (
                      <p className="text-[10px] text-primary">🎉 You qualify for free shipping!</p>
                    )}
                    <div className="flex justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="font-bold text-primary text-xl">${grandTotal.toFixed(2)}</span>
                    </div>
                    <Button onClick={() => setStep("details")} className="w-full" size="lg">
                      Proceed to Checkout
                    </Button>
                  </div>
                </>
              )}
            </>
          )}

          {/* Step: Contact Details */}
          {step === "details" && (
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <User className="w-4 h-4" />
                <span>Primary Contact</span>
              </div>
              <div className="space-y-2">
                <Label>Full Name *</Label>
                <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="john@example.com" />
              </div>
              <div className="space-y-2">
                <Label>Phone *</Label>
                <Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+1 234 567 8900" />
              </div>

              <div className="border-t border-border pt-4 mt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <Phone className="w-4 h-4" />
                  <span>Alternative Contact Person (optional)</span>
                </div>
                <div className="space-y-2">
                  <Label>Alt Contact Name</Label>
                  <Input value={form.altContactName} onChange={e => setForm(p => ({ ...p, altContactName: e.target.value }))} placeholder="Jane Doe" />
                </div>
                <div className="space-y-2 mt-2">
                  <Label>Alt Contact Phone</Label>
                  <Input value={form.altContactPhone} onChange={e => setForm(p => ({ ...p, altContactPhone: e.target.value }))} placeholder="+1 234 567 8900" />
                </div>
              </div>

              <div className="pt-4 border-t border-border space-y-3">
                <Button onClick={() => setStep("delivery")} className="w-full" size="lg" disabled={!canProceedToDelivery}>
                  Continue to Delivery
                </Button>
                <Button variant="ghost" onClick={() => setStep("cart")} className="w-full gap-1">
                  <ArrowLeft className="w-4 h-4" /> Back
                </Button>
              </div>
            </div>
          )}

          {/* Step: Delivery */}
          {step === "delivery" && (
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <MapPin className="w-4 h-4" />
                <span>Delivery Address</span>
              </div>
              <div className="space-y-2">
                <Label>Street Address *</Label>
                <Input value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} placeholder="123 Main Street, Apt 4B" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>City *</Label>
                  <Input value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} placeholder="Phoenix" />
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Input value={form.state} onChange={e => setForm(p => ({ ...p, state: e.target.value }))} placeholder="AZ" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>ZIP Code</Label>
                  <Input value={form.zip} onChange={e => setForm(p => ({ ...p, zip: e.target.value }))} placeholder="85001" />
                </div>
                <div className="space-y-2">
                  <Label>Country</Label>
                  <Input value={form.country} onChange={e => setForm(p => ({ ...p, country: e.target.value }))} placeholder="US" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Delivery Instructions (optional)</Label>
                <Textarea value={form.deliveryInstructions} onChange={e => setForm(p => ({ ...p, deliveryInstructions: e.target.value }))} placeholder="Gate code, leave at door, etc." rows={2} />
              </div>

              <div className="pt-4 border-t border-border space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${totalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1"><Truck className="w-3 h-3" /> Shipping</span>
                  <span>{shippingFee === 0 ? <span className="text-green-500">Free</span> : `$${shippingFee.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-primary text-xl">${grandTotal.toFixed(2)}</span>
                </div>
                <Button onClick={() => setStep("payment")} className="w-full" size="lg" disabled={!canProceedToPayment}>
                  Continue to Payment
                </Button>
                <Button variant="ghost" onClick={() => setStep("details")} className="w-full gap-1">
                  <ArrowLeft className="w-4 h-4" /> Back
                </Button>
              </div>
            </div>
          )}

          {/* Step: Payment */}
          {step === "payment" && (
            <div className="flex-1 space-y-4">
              <div className="glass-card p-4 mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Order for</span>
                  <span className="font-medium">{form.name}</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Deliver to</span>
                  <span className="font-medium text-right text-xs">{form.address}, {form.city}</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${totalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground flex items-center gap-1"><Truck className="w-3 h-3" /> Shipping</span>
                  <span>{shippingFee === 0 ? <span className="text-green-500">Free</span> : `$${shippingFee.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-primary text-xl">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Stripe Card Payment */}
              <Button onClick={handleStripeCheckout} disabled={isOrdering} className="w-full gap-2 h-12" size="lg">
                {isOrdering ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-5 h-5" />}
                Pay with Card — ${grandTotal.toFixed(2)}
              </Button>

              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center text-xs"><span className="bg-background px-2 text-muted-foreground">or pay manually</span></div>
              </div>

              {/* Manual Bank Transfer */}
              <div className="glass-card p-4 space-y-3 text-sm">
                <p className="font-semibold text-sm flex items-center gap-2">
                  <Banknote className="w-4 h-4" /> Bank Transfer Details
                </p>
                <p className="text-xs text-muted-foreground">Transfer the amount below and click "I've Paid" to place your order. Admin will verify and process.</p>
                <div className="space-y-2 mt-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-muted-foreground">Bank</p>
                      <p className="font-medium">{BANK_DETAILS.bankName}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-muted-foreground">Account Name</p>
                      <p className="font-medium">{BANK_DETAILS.accountName}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copyToClipboard(BANK_DETAILS.accountName)}>
                      <Copy className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-muted-foreground">Account Number</p>
                      <p className="font-medium">{BANK_DETAILS.accountNumber}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copyToClipboard(BANK_DETAILS.accountNumber)}>
                      <Copy className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-muted-foreground">Routing Number</p>
                      <p className="font-medium">{BANK_DETAILS.routingNumber}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copyToClipboard(BANK_DETAILS.routingNumber)}>
                      <Copy className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                  <div className="border-t border-border pt-2">
                    <p className="text-xs text-muted-foreground">Amount to Send</p>
                    <p className="font-bold text-primary text-lg">${grandTotal.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <Button variant="outline" onClick={handleManualPayOrder} disabled={isOrdering} className="w-full gap-2 h-12" size="lg">
                {isOrdering ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-5 h-5" />}
                I've Paid — Place Order
              </Button>

              <Button variant="ghost" onClick={() => setStep("delivery")} className="w-full gap-1 mt-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
            </div>
          )}

          {/* Step: Confirmation */}
          {step === "confirmation" && receiptData && (
            <div className="flex-1 space-y-4">
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-lg font-bold font-space mb-1">Order Placed!</h3>
                <p className="text-sm text-muted-foreground">Receipt: {receiptData.receipt_number}</p>
              </div>

              <div className="glass-card p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Your Tracking Number</p>
                <div className="flex items-center justify-center gap-2">
                  <p className="font-bold text-primary font-mono text-lg">{receiptData.tracking_number}</p>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copyToClipboard(receiptData.tracking_number)}>
                    <Copy className="w-3.5 h-3.5" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Use this to track your order at <span className="text-primary">/track</span></p>
              </div>

              <div className="glass-card p-4 text-sm" ref={printRef}>
                <div style={{ textAlign: "center", marginBottom: 12 }}>
                  <img src={logo} alt="Logo" style={{ height: 32, marginBottom: 6, margin: "0 auto", display: "block" }} />
                  <p style={{ fontWeight: "bold", margin: 0 }}>BrightPath Merchandise</p>
                  <p style={{ fontSize: 11, color: "#888" }}>Phoenix, Arizona • +1 (520) 736-1677</p>
                  <div style={{ borderTop: "1px dashed #444", margin: "8px 0" }} />
                  <p style={{ fontWeight: "bold" }}>{receiptData.receipt_number}</p>
                  <p style={{ fontSize: 11, color: "#888" }}>{receiptData.date}</p>
                </div>
                <div style={{ borderTop: "1px dashed #444", margin: "8px 0" }} />
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <tbody>
                    {receiptData.items.map((item: any, i: number) => (
                      <tr key={i}>
                        <td style={{ padding: "2px 0", fontSize: 12 }}>{item.name} x{item.quantity}</td>
                        <td style={{ textAlign: "right", fontSize: 12 }}>${(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ borderTop: "1px dashed #444", margin: "8px 0" }} />
                {receiptData.shippingFee > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                    <span>Shipping</span>
                    <span>${receiptData.shippingFee.toFixed(2)}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: 14 }}>
                  <span>Total</span>
                  <span>${receiptData.total.toFixed(2)}</span>
                </div>
                <div style={{ borderTop: "1px dashed #444", margin: "8px 0" }} />
                <p style={{ textAlign: "center", fontSize: 11, color: "#888" }}>Payment: {receiptData.method}</p>
                <p style={{ textAlign: "center", fontSize: 11, fontStyle: "italic", color: "#666", marginTop: 8 }}>Thank you for shopping with us! ❤️</p>
              </div>

              <Button onClick={handlePrint} variant="outline" className="w-full gap-2">
                <Printer className="w-4 h-4" /> Print Receipt
              </Button>
              <Button onClick={resetAndClose} className="w-full">
                Continue Shopping
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
