import { ShoppingCart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { Link } from "react-router-dom";
import type { Product } from "@/types/product";
import { toast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const addItem = useCartStore((s) => s.addItem);
  const effectivePrice = product.is_on_sale && product.sale_price ? product.sale_price : product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast({ title: "Added to cart", description: `${product.name} added to your cart.` });
  };

  return (
    <Link to={`/product/${product.id}`} className="block">
      <div className="glass-card group overflow-hidden hover:scale-[1.03] transition-all duration-500">
        <div className="relative h-56 overflow-hidden">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-muted-foreground/30" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

          {product.is_on_sale && (
            <div className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-xs font-bold px-3 py-1 rounded-full">
              SALE
            </div>
          )}
          {product.is_featured && !product.is_on_sale && (
            <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
              FEATURED
            </div>
          )}
        </div>

        <div className="p-5">
          <p className="text-xs text-primary font-medium uppercase tracking-wider mb-1">{product.category}</p>
          <h3 className="font-bold font-space text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{product.description}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-primary font-space">${effectivePrice.toFixed(2)}</span>
              {product.is_on_sale && product.sale_price && (
                <span className="text-sm text-muted-foreground line-through">${product.price.toFixed(2)}</span>
              )}
            </div>
            <Button size="sm" onClick={handleAddToCart} className="gap-1">
              <ShoppingCart className="w-4 h-4" />
              Add
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
