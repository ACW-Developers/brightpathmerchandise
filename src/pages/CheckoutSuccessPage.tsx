import { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Check, Loader2, Copy, Printer, ShoppingBag, XCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import logo from "@/assets/logo/logo.png";

const CheckoutSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [orderInfo, setOrderInfo] = useState<any>(null);
  const printRef = useRef<HTMLDivElement>(null);
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }

    const verifyPayment = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("verify-payment", {
          body: { session_id: sessionId },
        });
        if (error) throw error;
        if (data?.success) {
          setOrderInfo(data);
          setStatus("success");
          // Clear cart from localStorage
          localStorage.removeItem("brightpath-cart");
        } else {
          setStatus("error");
        }
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    };

    verifyPayment();
  }, [sessionId]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: text });
  };

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<html><head><title>Receipt</title><style>body{font-family:Arial,sans-serif;padding:30px;max-width:380px;margin:0 auto;color:#333}.center{text-align:center}.bold{font-weight:bold}</style></head><body>${content.innerHTML}</body></html>`);
    w.document.close();
    w.print();
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Payment Verification Failed</h1>
          <p className="text-muted-foreground mb-6">We couldn't verify your payment. If you were charged, please contact support.</p>
          <Link to="/shop">
            <Button className="gap-2">
              <ShoppingBag className="w-4 h-4" /> Back to Shop
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
            <Check className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-2xl font-bold font-space mb-1">Payment Successful!</h1>
          <p className="text-muted-foreground">Your order has been placed and confirmed.</p>
        </div>

        {/* Tracking Number */}
        <div className="glass-card p-6 text-center">
          <p className="text-xs text-muted-foreground mb-1">Your Tracking Number</p>
          <div className="flex items-center justify-center gap-2">
            <p className="font-bold text-primary font-mono text-xl">{orderInfo?.tracking_number}</p>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copyToClipboard(orderInfo?.tracking_number)}>
              <Copy className="w-3.5 h-3.5" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Receipt: {orderInfo?.receipt_number}</p>
        </div>

        {/* Printable receipt */}
        <div className="glass-card p-4 text-sm" ref={printRef}>
          <div style={{ textAlign: "center", marginBottom: 12 }}>
            <img src={logo} alt="Logo" style={{ height: 32, marginBottom: 6, margin: "0 auto", display: "block" }} />
            <p style={{ fontWeight: "bold", margin: 0 }}>BrightPath Merchandise</p>
            <p style={{ fontSize: 11, color: "#888" }}>Phoenix, Arizona • +1 (520) 736-1677</p>
            <div style={{ borderTop: "1px dashed #444", margin: "8px 0" }} />
            <p style={{ fontWeight: "bold" }}>{orderInfo?.receipt_number}</p>
            <p style={{ fontSize: 11, color: "#888" }}>Payment: Stripe Card ✓</p>
          </div>
        </div>

        <div className="space-y-3">
          <Button onClick={handlePrint} variant="outline" className="w-full gap-2">
            <Printer className="w-4 h-4" /> Print Receipt
          </Button>
          <Link to="/track" className="block">
            <Button variant="outline" className="w-full">Track Your Order</Button>
          </Link>
          <Link to="/shop" className="block">
            <Button className="w-full gap-2">
              <ShoppingBag className="w-4 h-4" /> Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;
