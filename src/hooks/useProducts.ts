import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Product, MarketingBanner } from '@/types/product';

const mapProduct = (d: any): Product => ({
  ...d,
  colors: Array.isArray(d.colors) ? d.colors : [],
  sizes: Array.isArray(d.sizes) ? d.sizes : [],
  brand: d.brand || null,
});

/** Add cache-busting headers to prevent CDN/browser caching */
const noCacheHeaders = () => ({
  headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache' },
});

export function useProducts(category?: string) {
  return useQuery({
    queryKey: ['products', category],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*', { head: false, count: undefined })
        .order('created_at', { ascending: false });
      if (category && category !== 'All') query = query.eq('category', category);
      const { data, error } = await query;
      if (error) { console.error('[useProducts] fetch error:', error); throw error; }
      if (!data || data.length === 0) console.warn('[useProducts] No products returned for category:', category);
      return (data || []).map(mapProduct);
    },
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(8);
      if (error) { console.error('[useFeaturedProducts] fetch error:', error); throw error; }
      return (data || []).map(mapProduct);
    },
  });
}

export function useSaleProducts() {
  return useQuery({
    queryKey: ['products', 'sale'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_on_sale', true)
        .order('created_at', { ascending: false })
        .limit(8);
      if (error) { console.error('[useSaleProducts] fetch error:', error); throw error; }
      return (data || []).map(mapProduct);
    },
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('products').select('category');
      if (error) { console.error('[useCategories] fetch error:', error); throw error; }
      const cats = [...new Set((data || []).map(d => d.category).filter(Boolean))] as string[];
      return ['All', ...cats];
    },
  });
}

export function useBrands() {
  return useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      const { data, error } = await supabase.from('products').select('brand');
      if (error) { console.error('[useBrands] fetch error:', error); throw error; }
      return [...new Set((data || []).map(d => d.brand).filter(Boolean))] as string[];
    },
  });
}

export function useBanners(position?: string) {
  return useQuery({
    queryKey: ['banners', position],
    queryFn: async () => {
      let query = supabase.from('marketing_banners').select('*').eq('is_active', true).order('display_order');
      if (position) query = query.eq('position', position);
      const { data, error } = await query;
      if (error) { console.error('[useBanners] fetch error:', error); throw error; }
      return (data || []) as MarketingBanner[];
    },
  });
}
