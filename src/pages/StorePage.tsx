import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import StoreNavigation from "@/components/store/StoreNavigation";
import StoreFooter from "@/components/store/StoreFooter";
import ProductCard from "@/components/store/ProductCard";
import HeroCarousel from "@/components/store/HeroCarousel";
import MarketingBanner from "@/components/store/MarketingBanner";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import PageLoadingScreen from "@/components/PageLoadingScreen";
import { useProducts, useFeaturedProducts, useSaleProducts, useCategories } from "@/hooks/useProducts";
import ProductFetchError from "@/components/store/ProductFetchError";
import ClearCacheButton from "@/components/store/ClearCacheButton";
import { Sparkles, Flame, ShoppingBag, Search, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const StorePage = () => {
  const [pageLoading, setPageLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: products = [], isLoading, isError } = useProducts(selectedCategory);
  const { data: featured = [] } = useFeaturedProducts();
  const { data: saleProducts = [] } = useSaleProducts();
  const { data: categories = ["All"] } = useCategories();

  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.description || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <AnimatePresence>{pageLoading && <PageLoadingScreen label="Store" />}</AnimatePresence>
      <div className="min-h-screen bg-background">
        <StoreNavigation />
        <main className="pt-16">
          <HeroCarousel />

          <div className="max-w-7xl mx-auto px-6 mt-8">
            <MarketingBanner position="hero" />
          </div>

          {featured.length > 0 && (
            <section className="py-16 px-6">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                  <Sparkles className="w-6 h-6 text-primary" />
                  <h2 className="text-3xl font-bold font-space">Featured Products</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {featured.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
              </div>
            </section>
          )}

          <div className="max-w-7xl mx-auto px-6">
            <MarketingBanner position="home-mid" />
          </div>

          {saleProducts.length > 0 && (
            <section className="py-16 px-6 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-destructive/5 via-transparent to-destructive/5" />
              <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <Flame className="w-6 h-6 text-destructive" />
                  <h2 className="text-3xl font-bold font-space">On Sale</h2>
                  <span className="bg-destructive text-destructive-foreground text-xs font-bold px-3 py-1 rounded-full">HOT</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {saleProducts.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
              </div>
            </section>
          )}

          <section className="py-16 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="glass-card p-12 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10" />
                <div className="relative z-10">
                  <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h2 className="text-3xl md:text-4xl font-bold font-space mb-4">
                    Elevate Your <span className="gradient-text">Brand</span>
                  </h2>
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
                    From custom t-shirts and caps to car branding and office signage — we bring your brand to life with premium quality prints.
                  </p>
                  <Button
                    variant="glass"
                    size="lg"
                    onClick={() => window.open("https://wa.me/15207361677?text=" + encodeURIComponent("Hello there, I'm interested in your service."), "_blank")}
                  >
                    Get a Custom Quote
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <section className="py-16 px-6" id="products">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-6 h-6 text-primary" />
                  <h2 className="text-3xl font-bold font-space">All Products</h2>
                </div>
                <ClearCacheButton />
              </div>

              <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {categories.map((cat) => (
                    <Button key={cat} variant={selectedCategory === cat ? "default" : "outline"} size="sm" onClick={() => setSelectedCategory(cat)}>
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Array.from({ length: 8 }).map((_, i) => <div key={i} className="glass-card h-80 animate-pulse" />)}
                </div>
              ) : isError ? (
                <ProductFetchError />
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20">
                  <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-xl text-muted-foreground">No products found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
              )}
            </div>
          </section>

          <div className="max-w-7xl mx-auto px-6 pb-8">
            <MarketingBanner position="home-bottom" />
          </div>
        </main>
        <StoreFooter />
        <WhatsAppWidget />
      </div>
    </>
  );
};

export default StorePage;
