import { useState } from "react";
import { X, SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useBrands, useCategories } from "@/hooks/useProducts";
import { motion, AnimatePresence } from "framer-motion";

export interface ShopFilters {
  category: string;
  brand: string;
  priceRange: [number, number];
  sortBy: string;
  searchQuery: string;
  onSale: boolean;
}

interface Props {
  filters: ShopFilters;
  onFiltersChange: (f: ShopFilters) => void;
  isOpen: boolean;
  onClose: () => void;
}

const FilterSection = ({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border/50 pb-4">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full py-2 text-sm font-semibold text-foreground hover:text-primary transition-colors">
        {title}
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ShopSidebar = ({ filters, onFiltersChange, isOpen, onClose }: Props) => {
  const { data: brands = [] } = useBrands();
  const { data: categories = ["All"] } = useCategories();

  const update = (partial: Partial<ShopFilters>) => onFiltersChange({ ...filters, ...partial });

  const sidebarContent = (
    <div className="space-y-4 p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold font-space text-lg flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-primary" /> Filters
        </h3>
        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={() => onFiltersChange({ category: "All", brand: "", priceRange: [0, 1000], sortBy: "newest", searchQuery: "", onSale: false })}>
          Clear All
        </Button>
      </div>

      {/* Categories */}
      <FilterSection title="Category">
        <div className="space-y-1.5 mt-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => update({ category: cat })}
              className={`block w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all ${
                filters.category === cat
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Brands */}
      {brands.length > 0 && (
        <FilterSection title="Brand">
          <div className="space-y-2 mt-2">
            <button
              onClick={() => update({ brand: "" })}
              className={`block w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all ${
                !filters.brand ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted/50"
              }`}
            >
              All Brands
            </button>
            {brands.map(b => (
              <button
                key={b}
                onClick={() => update({ brand: b })}
                className={`block w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all ${
                  filters.brand === b ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted/50"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </FilterSection>
      )}

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="mt-3 px-1">
          <Slider
            value={filters.priceRange}
            onValueChange={(v) => update({ priceRange: v as [number, number] })}
            max={1000}
            min={0}
            step={5}
            className="mb-3"
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}+</span>
          </div>
        </div>
      </FilterSection>

      {/* Sort */}
      <FilterSection title="Sort By">
        <div className="space-y-1.5 mt-2">
          {[
            { v: "newest", l: "Newest First" },
            { v: "price-low", l: "Price: Low → High" },
            { v: "price-high", l: "Price: High → Low" },
            { v: "name", l: "Name A–Z" },
          ].map(s => (
            <button
              key={s.v}
              onClick={() => update({ sortBy: s.v })}
              className={`block w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all ${
                filters.sortBy === s.v ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted/50"
              }`}
            >
              {s.l}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* On Sale */}
      <div className="flex items-center gap-2 pt-2">
        <Checkbox id="sale-filter" checked={filters.onSale} onCheckedChange={v => update({ onSale: !!v })} />
        <Label htmlFor="sale-filter" className="text-sm cursor-pointer">On Sale Only</Label>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-72 flex-shrink-0">
        <div className="sticky top-20 glass-card overflow-hidden max-h-[calc(100vh-6rem)] overflow-y-auto scrollbar-hide">
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50 lg:hidden"
              onClick={onClose}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-card border-r border-border z-50 overflow-y-auto lg:hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="font-bold font-space">Filters</h3>
                <Button variant="ghost" size="icon" onClick={onClose}><X className="w-5 h-5" /></Button>
              </div>
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ShopSidebar;
