
-- Add delivery/tracking columns to orders table
ALTER TABLE public.orders 
  ADD COLUMN IF NOT EXISTS delivery_address TEXT,
  ADD COLUMN IF NOT EXISTS delivery_city TEXT,
  ADD COLUMN IF NOT EXISTS delivery_state TEXT,
  ADD COLUMN IF NOT EXISTS delivery_zip TEXT,
  ADD COLUMN IF NOT EXISTS delivery_country TEXT DEFAULT 'US',
  ADD COLUMN IF NOT EXISTS delivery_instructions TEXT,
  ADD COLUMN IF NOT EXISTS alt_contact_name TEXT,
  ADD COLUMN IF NOT EXISTS alt_contact_phone TEXT,
  ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS tracking_status TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS tracking_number TEXT,
  ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;

-- Create an index on tracking_number for quick lookups
CREATE INDEX IF NOT EXISTS idx_orders_tracking_number ON public.orders(tracking_number);
