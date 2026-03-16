import { RefreshCw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";

const ProductFetchError = () => {
  const queryClient = useQueryClient();

  const handleClearAndReload = async () => {
    // 1. Clear React Query cache
    queryClient.clear();

    // 2. Clear localStorage & sessionStorage
    try { localStorage.clear(); } catch (_) {}
    try { sessionStorage.clear(); } catch (_) {}

    // 3. Clear service worker caches
    if ("caches" in window) {
      try {
        const names = await caches.keys();
        await Promise.all(names.map((n) => caches.delete(n)));
      } catch (_) {}
    }

    // 4. Force reload
    window.location.reload();
  };

  return (
    <div className="text-center py-20">
      <AlertTriangle className="w-16 h-16 text-destructive/50 mx-auto mb-4" />
      <p className="text-xl font-semibold text-foreground mb-2">Failed to load products</p>
      <p className="text-sm text-muted-foreground mb-6">
        There was a problem fetching products. Clear the cache and try again.
      </p>
      <Button onClick={handleClearAndReload} variant="destructive" className="gap-2">
        <RefreshCw className="w-4 h-4" />
        Clear Cache & Reload
      </Button>
    </div>
  );
};

export default ProductFetchError;
