import StoreNavigation from "@/components/store/StoreNavigation";
import StoreFooter from "@/components/store/StoreFooter";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const StoreContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Hi, I'm ${form.name} (${form.email}). ${form.message}`;
    window.open(`https://wa.me/15207361677?text=${encodeURIComponent(msg)}`, "_blank");
    toast({ title: "Redirecting to WhatsApp..." });
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <StoreNavigation />
      <main className="pt-20 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold font-space mb-3">Contact Us</h1>
          <p className="text-muted-foreground mb-10">Have a question or custom order? Reach out!</p>

          <div className="grid md:grid-cols-2 gap-8">
            <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
              <div className="space-y-2"><Label>Name</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required /></div>
              <div className="space-y-2"><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required /></div>
              <div className="space-y-2"><Label>Message</Label><Textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required rows={4} /></div>
              <Button type="submit" className="w-full gap-2"><MessageCircle className="w-4 h-4" /> Send via WhatsApp</Button>
            </form>

            <div className="space-y-6">
              <div className="glass-card p-6 space-y-4">
                <div className="flex items-center gap-3"><Mail className="w-5 h-5 text-primary" /><span>davidirihose94@gmail.com</span></div>
                <div className="flex items-center gap-3"><Phone className="w-5 h-5 text-primary" /><span>+1 (520) 736-1677</span></div>
                <div className="flex items-center gap-3"><MapPin className="w-5 h-5 text-primary" /><span>Phoenix, Arizona</span></div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <StoreFooter />
      <WhatsAppWidget />
    </div>
  );
};

export default StoreContactPage;
