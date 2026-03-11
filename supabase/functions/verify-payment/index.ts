import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { session_id } = await req.json();
    if (!session_id) throw new Error("Missing session_id");

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== "paid") {
      return new Response(JSON.stringify({ success: false, status: session.payment_status }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const orderId = session.metadata?.order_id;
    if (!orderId) throw new Error("No order_id in session metadata");

    // Update order status to confirmed
    const { data: order, error: updateError } = await supabase
      .from("orders")
      .update({ status: "confirmed", tracking_status: "confirmed" })
      .eq("id", orderId)
      .select()
      .single();

    if (updateError) throw updateError;

    // Create receipt
    const receiptNum = `RCP-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    await supabase.from("receipts").insert({
      receipt_number: receiptNum,
      order_id: order.id,
      customer_name: order.customer_name,
      customer_email: order.customer_email,
      customer_phone: order.customer_phone,
      items: order.items,
      subtotal: order.total_amount,
      tax: 0,
      total_amount: order.total_amount,
      payment_method: "stripe_card",
      payment_status: "paid",
    });

    return new Response(JSON.stringify({
      success: true,
      tracking_number: order.tracking_number,
      receipt_number: receiptNum,
      order_id: order.id,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
