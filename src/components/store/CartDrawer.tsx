import { useState, useRef } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingCart, Minus, Plus, Trash2, CreditCard, Loader2, Check, Printer, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import logo from "@/assets/logo/logo.png";

type Step = "cart" | "details" | "payment" | "confirmation";

const CartDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<Step>("cart");
  const [isOrdering, setIsOrdering] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [receiptData, setReceiptData] = useState<any>(null);
  const { items, updateQuantity, removeItem, clearCart, totalItems, totalPrice } = useCartStore();
  const printRef = useRef<HTMLDivElement>(null);

  const handleOrder = async (method: string) => {
    if (!form.name || !form.email) {
      toast({ title: "Missing info", description: "Please fill in your name and email.", variant: "destructive" });
      return;
    }
    setIsOrdering(true);
    try {
      const orderItems = items.map(i => ({
        product_id: i.product.id,
        name: i.product.name,
        price: i.product.is_on_sale && i.product.sale_price ? i.product.sale_price : i.product.price,
        quantity: i.quantity,
      }));

      const total = totalPrice();
      const receiptNum = `RCP-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

      // Create order
      const { data: order, error: orderError } = await supabase.from("orders").insert({
        customer_name: form.name,
        customer_email: form.email,
        customer_phone: form.phone || null,
        items: orderItems as any,
        total_amount: total,
      }).select().single();

      if (orderError) throw orderError;

      // Create receipt
      await supabase.from("receipts").insert({
        receipt_number: receiptNum,
        order_id: order.id,
        customer_name: form.name,
        customer_email: form.email,
        customer_phone: form.phone || null,
        items: orderItems as any,
        subtotal: total,
        tax: 0,
        total_amount: total,
        payment_method: method,
        payment_status: method === "whatsapp" ? "pending" : "pending",
      });

      setReceiptData({
        receipt_number: receiptNum,
        items: orderItems,
        total,
        method,
        date: new Date().toLocaleString(),
      });

      // Redirect based on payment method
      if (method === "paypal") {
        window.open(`https://www.paypal.com/paypalme/amosclinton196/${total.toFixed(2)}USD`, "_blank");
      } else if (method === "venmo") {
        window.open(`https://venmo.com/?txn=pay&audience=public&recipients=&amount=${total.toFixed(2)}&note=${encodeURIComponent(`BrightPath Order ${receiptNum}`)}`, "_blank");
      } else {
        const message = `New Order ${receiptNum}\n${items.map(i => `${i.product.name} x${i.quantity}`).join('\n')}\nTotal: $${total.toFixed(2)}\nEmail: ${form.email}\nPhone: ${form.phone}`;
        window.open(`https://wa.me/15207361677?text=${encodeURIComponent(message)}`, "_blank");
      }

      clearCart();
      setStep("confirmation");
      toast({ title: "Order placed!" });
    } catch (err) {
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

  const resetAndClose = () => {
    setStep("cart");
    setForm({ name: "", email: "", phone: "" });
    setReceiptData(null);
    setIsOpen(false);
  };

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
      <SheetContent className="w-full sm:max-w-lg flex flex-col h-full">
        <SheetHeader>
          <SheetTitle className="font-space">
            {step === "cart" && "Shopping Cart"}
            {step === "details" && "Your Details"}
            {step === "payment" && "Payment"}
            {step === "confirmation" && "Order Confirmed!"}
          </SheetTitle>
          <SheetDescription>
            {step === "cart" && `${totalItems()} item${totalItems() !== 1 ? 's' : ''} in cart`}
            {step === "details" && "Enter your contact info"}
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
                    {items.map((item) => (
                      <div key={item.product.id} className="flex gap-3 p-3 rounded-xl bg-muted/20">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          {item.product.image_url ? (
                            <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xl">🖼</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{item.product.name}</h4>
                          <p className="text-sm text-primary font-semibold">
                            ${((item.product.is_on_sale && item.product.sale_price ? item.product.sale_price : item.product.price) * item.quantity).toFixed(2)}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm w-6 text-center">{item.quantity}</span>
                            <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto" onClick={() => removeItem(item.product.id)}>
                              <Trash2 className="h-3 w-3 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex-shrink-0 pt-4 border-t border-border space-y-3">
                    <div className="flex justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="font-bold text-primary text-xl">${totalPrice().toFixed(2)}</span>
                    </div>
                    <Button onClick={() => setStep("details")} className="w-full" size="lg">
                      Proceed to Checkout
                    </Button>
                  </div>
                </>
              )}
            </>
          )}

          {/* Step: Details */}
          {step === "details" && (
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label>Full Name *</Label>
                <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="john@example.com" />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+1 234 567 8900" />
              </div>
              <div className="pt-4 border-t border-border space-y-3">
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-primary text-xl">${totalPrice().toFixed(2)}</span>
                </div>
                <Button onClick={() => setStep("payment")} className="w-full" size="lg" disabled={!form.name || !form.email}>
                  Continue to Payment
                </Button>
                <Button variant="ghost" onClick={() => setStep("cart")} className="w-full gap-1">
                  <ArrowLeft className="w-4 h-4" /> Back
                </Button>
              </div>
            </div>
          )}

          {/* Step: Payment */}
          {step === "payment" && (
            <div className="flex-1 space-y-4">
              <div className="glass-card p-4 mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Order for</span>
                  <span className="font-medium">{form.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-primary text-xl">${totalPrice().toFixed(2)}</span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-2">Choose a payment method:</p>

              <Button onClick={() => handleOrder("paypal")} disabled={isOrdering} className="w-full gap-2 h-12 bg-[#0070ba] hover:bg-[#005ea6] text-white" size="lg">
                {isOrdering ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-5 h-5" />}
                Pay with PayPal
              </Button>

              <Button onClick={() => handleOrder("venmo")} disabled={isOrdering} className="w-full gap-2 h-12 bg-[#3d95ce] hover:bg-[#2d7ab3] text-white" size="lg">
                {isOrdering ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-5 h-5" />}
                Pay with Venmo
              </Button>

              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center text-xs"><span className="bg-background px-2 text-muted-foreground">or</span></div>
              </div>

              <Button variant="outline" onClick={() => handleOrder("whatsapp")} disabled={isOrdering} className="w-full gap-2 h-12" size="lg">
                💬 Order via WhatsApp
              </Button>

              <Button variant="ghost" onClick={() => setStep("details")} className="w-full gap-1 mt-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
            </div>
          )}

          {/* Step: Confirmation */}
          {step === "confirmation" && receiptData && (
            <div className="flex-1 space-y-4">
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-lg font-bold font-space mb-1">Order Placed!</h3>
                <p className="text-sm text-muted-foreground">Receipt: {receiptData.receipt_number}</p>
              </div>

              {/* Receipt preview */}
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
