import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import StoreNavigation from "@/components/store/StoreNavigation";
import StoreFooter from "@/components/store/StoreFooter";
import ProductCard from "@/components/store/ProductCard";
import ShopSidebar, { type ShopFilters } from "@/components/store/ShopSidebar";
import MarketingBanner from "@/components/store/MarketingBanner";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import PageLoadingScreen from "@/components/PageLoadingScreen";
import { useProducts } from "@/hooks/useProducts";
import ProductFetchError from "@/components/store/ProductFetchError";
import ClearCacheButton from "@/components/store/ClearCacheButton";
import { ShoppingBag, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ShopPage = () => {
  const [pageLoading, setPageLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filters, setFilters] = useState<ShopFilters>({
    category: "All",
    brand: "",
    priceRange: [0, 1000],
    sortBy: "newest",
    searchQuery: "",
    onSale: false,
  });

  const { data: products = [], isLoading, isError } = useProducts(filters.category);

  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const filtered = products
    .filter(p => {
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !(p.description || "").toLowerCase().includes(q)) return false;
      }
      if (filters.brand && p.brand !== filters.brand) return false;
      const price = p.is_on_sale && p.sale_price ? p.sale_price : p.price;
      if (price < filters.priceRange[0] || price > filters.priceRange[1]) return false;
      if (filters.onSale && !p.is_on_sale) return false;
      return true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case "price-low": return a.price - b.price;
        case "price-high": return b.price - a.price;
        case "name": return a.name.localeCompare(b.name);
        default: return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  return (
    <>
      <AnimatePresence>{pageLoading && <PageLoadingScreen label="Shop" />}</AnimatePresence>
      <div className="min-h-screen bg-background">
        <StoreNavigation />
        <main className="pt-20 pb-16 px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-7 h-7 text-primary" />
                <h1 className="text-3xl md:text-4xl font-bold font-space">Shop</h1>
                <span className="text-sm text-muted-foreground ml-2">{filtered.length} products</span>
              </div>
              <div className="flex items-center gap-2">
                <ClearCacheButton />
                <Button variant="outline" size="sm" className="lg:hidden gap-1" onClick={() => setSidebarOpen(true)}>
                  <SlidersHorizontal className="w-4 h-4" /> Filters
                </Button>
              </div>
            </div>

            <MarketingBanner position="shop-top" className="mb-8" />

            <div className="relative max-w-lg mb-8">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={filters.searchQuery}
                onChange={e => setFilters(f => ({ ...f, searchQuery: e.target.value }))}
                className="pl-10"
              />
            </div>

            <div className="flex gap-8">
              <ShopSidebar
                filters={filters}
                onFiltersChange={setFilters}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
              />

              <div className="flex-1 min-w-0">
                {isLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => <div key={i} className="glass-card h-80 animate-pulse" />)}
                  </div>
                ) : isError ? (
                  <ProductFetchError />
                ) : filtered.length === 0 ? (
                  <div className="text-center py-20">
                    <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-xl text-muted-foreground">No products found</p>
                    <p className="text-sm text-muted-foreground/60 mt-1">Try adjusting your filters</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filtered.slice(0, 8).map(p => <ProductCard key={p.id} product={p} />)}
                    </div>

                    {filtered.length > 8 && (
                      <MarketingBanner position="shop-mid" className="my-8" />
                    )}

                    {filtered.length > 8 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filtered.slice(8).map(p => <ProductCard key={p.id} product={p} />)}
                      </div>
                    )}
                  </>
                )}

                <MarketingBanner position="shop-bottom" className="mt-8" />
              </div>
            </div>
          </div>
        </main>
        <StoreFooter />
        <WhatsAppWidget />
      </div>
    </>
  );
};

export default ShopPage;
