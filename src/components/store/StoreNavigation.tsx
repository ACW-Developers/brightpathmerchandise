import { useState } from "react";
import { Menu, X, LogIn, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import CartDrawer from "./CartDrawer";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/logo/logo.png";

const StoreNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Track Order", href: "/track" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <img src={logo} alt="BrightPath" className="h-8 w-8 object-contain" />
            <h1 className="text-lg font-bold font-space gradient-text">BrightPath Merchandise</h1>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors ${isActive(item.href) ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <CartDrawer />
            <ThemeToggle />
            {isAdmin && (
              <Link to="/admin">
                <Button variant="ghost" size="sm" className="gap-1">
                  <Shield className="w-4 h-4" /> Admin
                </Button>
              </Link>
            )}
            {user ? (
              <Button variant="ghost" size="icon" onClick={signOut}>
                <LogOut className="w-4 h-4" />
              </Button>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="sm" className="gap-1">
                  <LogIn className="w-4 h-4" /> Sign In
                </Button>
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            <CartDrawer />
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-lg hover:bg-muted transition-colors">
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden border-t border-border pb-4">
            <div className="pt-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 text-base font-medium transition-colors ${isActive(item.href) ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {isAdmin && (
                <Link to="/admin" className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-primary" onClick={() => setIsOpen(false)}>
                  Admin Dashboard
                </Link>
              )}
              {user ? (
                <button onClick={() => { signOut(); setIsOpen(false); }} className="block w-full text-left px-3 py-2 text-base font-medium text-muted-foreground hover:text-primary">
                  Sign Out
                </button>
              ) : (
                <Link to="/login" className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-primary" onClick={() => setIsOpen(false)}>
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default StoreNavigation;
