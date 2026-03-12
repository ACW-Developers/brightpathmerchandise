
-- Add product variant columns
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS colors jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sizes jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS brand text DEFAULT NULL;

-- Create marketing_banners table
CREATE TABLE public.marketing_banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  image_url text NOT NULL,
  link_url text DEFAULT NULL,
  position text NOT NULL DEFAULT 'hero',
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  dimensions_hint text DEFAULT '1200x400',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.marketing_banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active banners" ON public.marketing_banners FOR SELECT TO public USING (is_active = true);
CREATE POLICY "Admins can manage banners" ON public.marketing_banners FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
