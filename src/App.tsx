import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { usePageTracking } from "@/hooks/usePageTracking";
import StorePage from "./pages/StorePage";
import ShopPage from "./pages/ShopPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import StoreContactPage from "./pages/StoreContactPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/admin/DashboardPage";
import ProductsPage from "./pages/admin/ProductsPage";
import OrdersPage from "./pages/admin/OrdersPage";
import BannersPage from "./pages/admin/BannersPage";
import InvoicesPage from "./pages/admin/InvoicesPage";
import ReceiptsPage from "./pages/admin/ReceiptsPage";
import SettingsPage from "./pages/admin/SettingsPage";
import ProfilePage from "./pages/admin/ProfilePage";
import AnalyticsPage from "./pages/admin/AnalyticsPage";
import NotFound from "./pages/NotFound";
import TrackOrderPage from "./pages/TrackOrderPage";
import CheckoutSuccessPage from "./pages/CheckoutSuccessPage";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,            // Always treat data as stale → refetch on every mount
      gcTime: 1000 * 60 * 2,   // Garbage-collect unused cache after 2 min
      refetchInterval: 1000 * 120,
      refetchOnWindowFocus: true,
      refetchOnMount: 'always',
      refetchOnReconnect: true,
      retry: 1,
    },
  },
});

const AppRoutes = () => {
  usePageTracking();
  return (
    <Routes>
      <Route path="/" element={<StorePage />} />
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />
      <Route path="/contact" element={<StoreContactPage />} />
      <Route path="/track" element={<TrackOrderPage />} />
      <Route path="/checkout-success" element={<CheckoutSuccessPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin" element={<DashboardPage />} />
      <Route path="/admin/products" element={<ProductsPage />} />
      <Route path="/admin/orders" element={<OrdersPage />} />
      <Route path="/admin/banners" element={<BannersPage />} />
      <Route path="/admin/invoices" element={<InvoicesPage />} />
      <Route path="/admin/receipts" element={<ReceiptsPage />} />
      <Route path="/admin/settings" element={<SettingsPage />} />
      <Route path="/admin/profile" element={<ProfilePage />} />
      <Route path="/admin/analytics" element={<AnalyticsPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
