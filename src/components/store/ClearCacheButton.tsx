import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const ClearCacheButton = () => {
  const queryClient = useQueryClient();
  const [clearing, setClearing] = useState(false);

  const handleClearAndReload = async () => {
    setClearing(true);
    queryClient.clear();
    try { localStorage.clear(); } catch (_) {}
    try { sessionStorage.clear(); } catch (_) {}
    if ("caches" in window) {
      try {
        const names = await caches.keys();
        await Promise.all(names.map((n) => caches.delete(n)));
      } catch (_) {}
    }
    window.location.reload();
  };

  return (
    <Button
      onClick={handleClearAndReload}
      variant="outline"
      size="sm"
      disabled={clearing}
      className="gap-1.5 text-xs"
    >
      <RefreshCw className={`w-3.5 h-3.5 ${clearing ? "animate-spin" : ""}`} />
      <span className="hidden sm:inline">{clearing ? "Refreshing…" : "Refresh Products"}</span>
      <span className="sm:hidden">{clearing ? "…" : "Refresh"}</span>
    </Button>
  );
};

export default ClearCacheButton;
