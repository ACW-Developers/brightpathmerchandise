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

    const { items, customer_email, customer_name, order_metadata } = await req.json();

    if (!items || !items.length || !customer_email) {
      throw new Error("Missing required fields: items and customer_email");
    }

    const total = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
    if (total < 0.50) {
      throw new Error("Order total must be at least $0.50 USD. Please add more items or choose a different product.");
    }
    const trackingNum = `TRK-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    // Create pending order in DB first
    const { data: order, error: orderError } = await supabase.from("orders").insert({
      customer_name: customer_name || customer_email,
      customer_email,
      customer_phone: order_metadata?.phone || null,
      items: order_metadata?.items || items,
      total_amount: total,
      delivery_address: order_metadata?.address || null,
      delivery_city: order_metadata?.city || null,
      delivery_state: order_metadata?.state || null,
      delivery_zip: order_metadata?.zip || null,
      delivery_country: order_metadata?.country || "US",
      delivery_instructions: order_metadata?.deliveryInstructions || null,
      alt_contact_name: order_metadata?.altContactName || null,
      alt_contact_phone: order_metadata?.altContactPhone || null,
      payment_method: "stripe_card",
      tracking_status: "pending",
      tracking_number: trackingNum,
      status: "pending",
      latitude: order_metadata?.latitude || null,
      longitude: order_metadata?.longitude || null,
    }).select().single();

    if (orderError) throw orderError;

    // Build line items for Stripe
    const line_items = items.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      customer_email,
      line_items,
      mode: "payment",
      success_url: `${req.headers.get("origin")}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/shop`,
      metadata: {
        order_id: order.id,
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
