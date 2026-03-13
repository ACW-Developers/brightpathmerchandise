import StoreNavigation from "@/components/store/StoreNavigation";
import StoreFooter from "@/components/store/StoreFooter";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, MessageCircle, Send, Clock, Headphones, Star, ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const StoreContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `*New Inquiry*\n\n*Name:* ${form.name}\n*Email:* ${form.email}\n*Phone:* ${form.phone}\n*Subject:* ${form.subject}\n\n*Message:*\n${form.message}`;
    window.open(`https://wa.me/15207361677?text=${encodeURIComponent(msg)}`, "_blank");
    toast({ title: "Opening WhatsApp!", description: "Your message is ready to send." });
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  const contactCards = [
    { icon: MessageCircle, label: "WhatsApp", value: "+1 (520) 736-1677", sub: "Instant replies", action: () => window.open("https://wa.me/15207361677", "_blank"), gradient: "from-emerald-500 to-green-600" },
    { icon: Mail, label: "Email Us", value: "davidirihose94@gmail.com", sub: "We reply within 2 hrs", action: () => window.location.href = "mailto:davidirihose94@gmail.com", gradient: "from-blue-500 to-cyan-500" },
    { icon: Phone, label: "Call Us", value: "+1 (520) 736-1677", sub: "Mon – Fri, 8am – 6pm", action: () => window.location.href = "tel:+15207361677", gradient: "from-violet-500 to-purple-600" },
    { icon: MapPin, label: "Visit Us", value: "Phoenix, Arizona", sub: "Maricopa, Amsterdam Rd", action: () => {}, gradient: "from-orange-500 to-rose-500" },
  ];

  const highlights = [
    { icon: Clock, title: "Quick Response", desc: "Average reply in under 2 hours" },
    { icon: Headphones, title: "Dedicated Support", desc: "Personal attention to every inquiry" },
    { icon: Star, title: "5-Star Service", desc: "Trusted by hundreds of clients" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <StoreNavigation />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative py-24 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          <div className="absolute top-20 left-1/3 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[180px]" />
          <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[150px]" />

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-6">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-semibold tracking-wider uppercase text-primary">Get in Touch</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold font-space tracking-tight mb-4">
                We'd Love to{" "}
                <span className="gradient-text">Hear From You</span>
              </h1>
              <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto leading-relaxed">
                Questions about an order, custom request, or just want to say hello? We're here and ready to help.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Cards */}
        <section className="px-6 -mt-6 mb-16">
          <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-3">
            {contactCards.map((card, i) => {
              const Icon = card.icon;
              const isActive = activeCard === i;
              return (
                <motion.button
                  key={card.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  onMouseEnter={() => setActiveCard(i)}
                  onMouseLeave={() => setActiveCard(null)}
                  onClick={card.action}
                  className={`relative text-left rounded-2xl border p-5 transition-all duration-400 cursor-pointer ${
                    isActive
                      ? `bg-gradient-to-br ${card.gradient} text-white border-transparent shadow-xl scale-[1.03]`
                      : "glass-card border-border/50 hover:border-primary/30"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                    isActive ? "bg-white/20" : `bg-gradient-to-br ${card.gradient}`
                  }`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="font-bold font-space text-sm mb-0.5">{card.label}</p>
                  <p className={`text-xs font-medium ${isActive ? "text-white/90" : "text-primary"}`}>{card.value}</p>
                  <p className={`text-[11px] mt-0.5 ${isActive ? "text-white/60" : "text-muted-foreground"}`}>{card.sub}</p>
                  <ArrowRight className={`absolute top-5 right-5 w-4 h-4 transition-all duration-300 ${isActive ? "opacity-100 text-white" : "opacity-0"}`} />
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* Main Content */}
        <section className="px-6 pb-20">
          <div className="max-w-5xl mx-auto grid lg:grid-cols-5 gap-8">
            {/* Left Panel */}
            <div className="lg:col-span-2 space-y-5">
              <motion.div initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <h2 className="text-2xl md:text-3xl font-bold font-space mb-2">
                  Why Reach <span className="gradient-text">Out?</span>
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Whether it's a custom order, bulk inquiry, or product question — our team provides fast, personal support.
                </p>
              </motion.div>

              {highlights.map((h, i) => (
                <motion.div
                  key={h.title}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3 p-4 rounded-xl border border-border/40 hover:border-primary/30 transition-colors bg-card/30"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <h.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold font-space text-sm">{h.title}</p>
                    <p className="text-xs text-muted-foreground">{h.desc}</p>
                  </div>
                </motion.div>
              ))}

              {/* WhatsApp CTA Card */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 p-6 text-white"
              >
                <div className="absolute -top-8 -right-8 w-28 h-28 bg-white/10 rounded-full" />
                <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-white/5 rounded-full" />
                <MessageCircle className="w-7 h-7 mb-2 relative z-10" />
                <h3 className="text-base font-bold font-space mb-1 relative z-10">Prefer WhatsApp?</h3>
                <p className="text-xs text-white/75 mb-3 relative z-10">Chat directly — we usually reply in minutes</p>
                <Button
                  onClick={() => window.open("https://wa.me/15207361677", "_blank")}
                  className="bg-white text-emerald-600 hover:bg-white/90 w-full text-sm font-semibold gap-2 relative z-10"
                >
                  <MessageCircle className="w-4 h-4" /> Start Chat
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </motion.div>
            </div>

            {/* Right Panel – Form */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-3"
            >
              <div className="rounded-2xl border-2 border-primary/20 bg-card backdrop-blur-sm p-6 md:p-8 shadow-2xl shadow-primary/5 relative overflow-hidden">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                    <Send className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold font-space text-sm">Send a Message</h3>
                    <p className="text-[11px] text-muted-foreground">Pre-fills your WhatsApp with details</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Full Name *</label>
                      <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="John Doe" required className="h-11 bg-background/60 border-border/40 focus:border-primary rounded-xl text-sm" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Email *</label>
                      <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="john@example.com" required className="h-11 bg-background/60 border-border/40 focus:border-primary rounded-xl text-sm" />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Phone</label>
                      <Input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+1 (555) 000-0000" className="h-11 bg-background/60 border-border/40 focus:border-primary rounded-xl text-sm" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Subject *</label>
                      <Input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="Custom Order Inquiry" required className="h-11 bg-background/60 border-border/40 focus:border-primary rounded-xl text-sm" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Message *</label>
                    <Textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Tell us about your needs..." required rows={5} className="bg-background/60 border-border/40 focus:border-primary resize-none rounded-xl text-sm" />
                  </div>
                  <Button type="submit" size="lg" className="w-full h-12 text-sm font-semibold gap-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 rounded-xl shadow-lg shadow-emerald-500/20 group">
                    <MessageCircle className="w-4 h-4" />
                    Send via WhatsApp
                    <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Map */}
        <section className="px-6 pb-16">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-6">
              <h2 className="text-2xl font-bold font-space">Our <span className="gradient-text">Location</span></h2>
              <p className="text-sm text-muted-foreground mt-1">Phoenix, Arizona • Maricopa, Amsterdam Road</p>
            </motion.div>
            <div className="rounded-2xl overflow-hidden border border-border/40 shadow-xl h-64">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d424143.99840399865!2d-112.59471879921797!3d33.43914729394703!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x872b12ed50a179cb%3A0x8c69c7f8354a1bac!2sPhoenix%2C%20AZ!5e0!3m2!1sen!2sus!4v1645555555555!5m2!1sen!2sus"
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      </main>
      <StoreFooter />
      <WhatsAppWidget />
    </div>
  );
};

export default StoreContactPage;
