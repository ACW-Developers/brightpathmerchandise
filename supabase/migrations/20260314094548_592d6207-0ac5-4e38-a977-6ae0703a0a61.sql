
ALTER TABLE public.store_settings
  ADD COLUMN IF NOT EXISTS shipping_fee numeric NOT NULL DEFAULT 5.99,
  ADD COLUMN IF NOT EXISTS free_shipping_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS free_shipping_threshold numeric NOT NULL DEFAULT 50;
