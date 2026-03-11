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

    const metadata = session.metadata || {};
    const orderData = metadata.order_data ? JSON.parse(metadata.order_data) : {};

    const trackingNum = `TRK-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const receiptNum = `RCP-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    // Create order
    const { data: order, error: orderError } = await supabase.from("orders").insert({
      customer_name: metadata.customer_name || session.customer_email,
      customer_email: session.customer_email,
      customer_phone: orderData.phone || null,
      items: orderData.items || [],
      total_amount: (session.amount_total || 0) / 100,
      delivery_address: orderData.address || null,
      delivery_city: orderData.city || null,
      delivery_state: orderData.state || null,
      delivery_zip: orderData.zip || null,
      delivery_country: orderData.country || "US",
      delivery_instructions: orderData.deliveryInstructions || null,
      alt_contact_name: orderData.altContactName || null,
      alt_contact_phone: orderData.altContactPhone || null,
      payment_method: "stripe_card",
      tracking_status: "pending",
      tracking_number: trackingNum,
      latitude: orderData.latitude || null,
      longitude: orderData.longitude || null,
    }).select().single();

    if (orderError) throw orderError;

    // Create receipt
    await supabase.from("receipts").insert({
      receipt_number: receiptNum,
      order_id: order.id,
      customer_name: metadata.customer_name || session.customer_email,
      customer_email: session.customer_email,
      customer_phone: orderData.phone || null,
      items: orderData.items || [],
      subtotal: (session.amount_total || 0) / 100,
      tax: 0,
      total_amount: (session.amount_total || 0) / 100,
      payment_method: "stripe_card",
      payment_status: "paid",
    });

    return new Response(JSON.stringify({
      success: true,
      tracking_number: trackingNum,
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
