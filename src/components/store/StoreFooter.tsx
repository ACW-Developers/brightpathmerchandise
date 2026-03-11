import { Mail, Phone, MapPin } from "lucide-react";

const StoreFooter = () => {
  return (
    <footer className="bg-black/40 backdrop-blur-xl border-t border-white/10 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold font-space gradient-text mb-3">BrightPath Merchandise</h3>
            <p className="text-muted-foreground text-sm">Premium quality printing and branding merchandise. Custom products that make your brand stand out.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold font-space mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="text-muted-foreground hover:text-primary transition-colors">Home</a></li>
              <li><a href="/shop" className="text-muted-foreground hover:text-primary transition-colors">Shop</a></li>
              <li><a href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold font-space mb-3">Contact</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /><span className="text-muted-foreground">davidirihose94@gmail.com</span></div>
              <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /><span className="text-muted-foreground">+1 (520) 736-1677</span></div>
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /><span className="text-muted-foreground">Phoenix, Arizona</span></div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 text-center">
          <p className="text-sm text-muted-foreground">© 2024 BrightPath Merchandise. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default StoreFooter;
