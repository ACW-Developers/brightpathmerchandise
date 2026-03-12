import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Globe, MessageCircle, Zap, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const contactMethods = [
  { icon: MessageCircle, title: "WhatsApp", detail: "+1 (520) 736-1677", description: "Instant replies", action: "whatsapp", color: "from-green-500 to-emerald-600" },
  { icon: Mail, title: "Email", detail: "davidirihose94@gmail.com", description: "Detailed inquiries", action: "email", color: "from-blue-500 to-cyan-600" },
  { icon: Phone, title: "Call", detail: "+1 (520) 736-1677", description: "Mon–Fri, 8am–6pm", action: "phone", color: "from-violet-500 to-purple-600" },
  { icon: MapPin, title: "Visit", detail: "Phoenix, Arizona", description: "Come say hello", action: "location", color: "from-orange-500 to-red-500" },
];

const ContactPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `*New Contact Form Submission*%0A%0A*Name:* ${formData.name}%0A*Email:* ${formData.email}%0A*Phone:* ${formData.phone}%0A*Subject:* ${formData.subject}%0A%0A*Message:*%0A${formData.message}`;
    window.open(`https://wa.me/15207361677?text=${msg}`, '_blank');
    toast({ title: "Opening WhatsApp!", description: "You'll be redirected to WhatsApp to send your message." });
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  const handleContactMethodClick = (method: typeof contactMethods[0]) => {
    switch (method.action) {
      case 'whatsapp': window.open('https://wa.me/15207361677', '_blank'); break;
      case 'email': window.location.href = 'mailto:davidirihose94@gmail.com'; break;
      case 'phone': window.location.href = 'tel:+15207361677'; break;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        {/* Hero */}
        <section className="relative py-28 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/8 rounded-full blur-[150px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/8 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "2s" }} />
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

          <div className="max-w-5xl mx-auto text-center relative z-10">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Let's Connect</span>
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-space mb-6 tracking-tight">
                Get in{" "}
                <span className="relative">
                  <span className="gradient-text">Touch</span>
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                    <path d="M1 5.5Q50 1 100 5.5Q150 10 199 5.5" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Transform your business with innovative digital solutions. We respond faster than you'd expect.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Cards */}
        <section className="py-12 px-6 -mt-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {contactMethods.map((method, index) => {
                const Icon = method.icon;
                return (
                  <motion.div
                    key={method.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    onMouseEnter={() => setHoveredCard(index)}
                    onMouseLeave={() => setHoveredCard(null)}
                    onClick={() => handleContactMethodClick(method)}
                    className="group relative cursor-pointer"
                  >
                    <div className={`relative overflow-hidden rounded-2xl border border-white/10 p-6 transition-all duration-500 ${hoveredCard === index ? 'bg-gradient-to-br ' + method.color + ' text-white scale-[1.02] shadow-2xl' : 'glass-card hover:border-primary/30'}`}>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-500 ${hoveredCard === index ? 'bg-white/20' : 'bg-gradient-to-br ' + method.color + ' bg-opacity-20'}`}>
                        <Icon className={`w-6 h-6 transition-colors duration-500 ${hoveredCard === index ? 'text-white' : 'text-white'}`} />
                      </div>
                      <h3 className="font-bold font-space text-lg mb-1">{method.title}</h3>
                      <p className={`text-sm font-medium mb-1 ${hoveredCard === index ? 'text-white/90' : 'text-primary'}`}>{method.detail}</p>
                      <p className={`text-xs ${hoveredCard === index ? 'text-white/70' : 'text-muted-foreground'}`}>{method.description}</p>
                      <ArrowRight className={`absolute top-6 right-6 w-5 h-5 transition-all duration-300 ${hoveredCard === index ? 'opacity-100 translate-x-0 text-white' : 'opacity-0 -translate-x-2'}`} />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Main Section */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-5 gap-10">
              {/* Left – Info (2 cols) */}
              <div className="lg:col-span-2 space-y-6">
                <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                  <h2 className="text-3xl md:text-4xl font-bold font-space mb-4">
                    Let's Build Something <span className="gradient-text">Amazing</span>
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Whether you need a stunning website, custom software, or comprehensive digital marketing — we're here.
                  </p>
                </motion.div>

                {[
                  { icon: Zap, title: "Lightning Fast", desc: "We reply within hours, not days", color: "text-yellow-500", bg: "bg-yellow-500/10" },
                  { icon: MessageSquare, title: "Free Consultation", desc: "No obligation project discussion", color: "text-blue-500", bg: "bg-blue-500/10" },
                  { icon: Globe, title: "Global Reach", desc: "Serving clients worldwide", color: "text-emerald-500", bg: "bg-emerald-500/10" },
                  { icon: Clock, title: "24/7 Available", desc: "WhatsApp support anytime", color: "text-violet-500", bg: "bg-violet-500/10" },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-4 p-4 rounded-xl border border-border/50 hover:border-primary/30 transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-lg ${item.bg} flex items-center justify-center flex-shrink-0`}>
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold font-space text-sm">{item.title}</h3>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}

                {/* WhatsApp CTA */}
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 p-6 text-white">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <MessageCircle className="w-8 h-8 mb-3 relative z-10" />
                  <h3 className="text-lg font-bold font-space mb-2 relative z-10">Prefer Direct Chat?</h3>
                  <p className="text-sm text-white/80 mb-4 relative z-10">Start a conversation on WhatsApp instantly</p>
                  <Button onClick={() => window.open('https://wa.me/15207361677', '_blank')} className="bg-white text-green-600 hover:bg-white/90 w-full group relative z-10">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Chat Now
                    <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </div>

              {/* Right – Form (3 cols) */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-3"
              >
                <div className="rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 shadow-2xl shadow-primary/5">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                      <Send className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold font-space">Send a Message</h3>
                      <p className="text-xs text-muted-foreground">Opens WhatsApp with your message pre-filled</p>
                    </div>
                  </div>

                  <form onSubmit={handleWhatsAppSubmit} className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Name *</label>
                        <Input type="text" placeholder="John Doe" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required className="h-12 bg-background/80 border-border/50 focus:border-primary rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email *</label>
                        <Input type="email" placeholder="john@example.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required className="h-12 bg-background/80 border-border/50 focus:border-primary rounded-xl" />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Phone</label>
                        <Input type="tel" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="h-12 bg-background/80 border-border/50 focus:border-primary rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Subject *</label>
                        <Input type="text" placeholder="Project Inquiry" value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} required className="h-12 bg-background/80 border-border/50 focus:border-primary rounded-xl" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Message *</label>
                      <Textarea placeholder="Tell us about your project..." value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} required rows={5} className="bg-background/80 border-border/50 focus:border-primary resize-none rounded-xl" />
                    </div>
                    <Button type="submit" size="lg" className="w-full h-14 text-base group bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl shadow-lg shadow-green-500/20">
                      <MessageCircle className="mr-2 w-5 h-5" />
                      Send via WhatsApp
                      <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Map */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8">
              <h2 className="text-3xl font-bold font-space">Find <span className="gradient-text">Us</span></h2>
              <p className="text-muted-foreground mt-2">Phoenix, Arizona • Maricopa, Amsterdam Road</p>
            </motion.div>
            <div className="rounded-3xl overflow-hidden border border-border/50 shadow-xl h-80">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d424143.99840399865!2d-112.59471879921797!3d33.43914729394703!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x872b12ed50a179cb%3A0x8c69c7f8354a1bac!2sPhoenix%2C%20AZ!5e0!3m2!1sen!2sus!4v1645555555555!5m2!1sen!2sus"
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
