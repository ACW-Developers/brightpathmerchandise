import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import MarketingSection from "@/components/MarketingSection";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Globe, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import turtleSvg from "@/assets/decorations/turtle.svg";

const contactMethods = [
  {
    icon: MessageCircle,
    title: "WhatsApp Us",
    detail: "+1 (520) 736-1677",
    description: "Fastest way to reach us",
    action: "whatsapp"
  },
  {
    icon: Mail,
    title: "Email Us",
    detail: "davidirihose94@gmail.com",
    description: "Send us an email anytime",
    action: "email"
  },
  {
    icon: Phone,
    title: "Call Us",
    detail: "+1 (520) 736-1677",
    description: "Mon-Fri from 8am to 6pm",
    action: "phone"
  },
  {
    icon: MapPin,
    title: "Visit Us",
    detail: "Phoenix, Arizona",
    description: "Come say hello",
    action: "location"
  }
];

const ContactPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format the message for WhatsApp
    const whatsappMessage = `*New Contact Form Submission*%0A%0A*Name:* ${formData.name}%0A*Email:* ${formData.email}%0A*Phone:* ${formData.phone}%0A*Subject:* ${formData.subject}%0A%0A*Message:*%0A${formData.message}`;
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/15207361677?text=${whatsappMessage}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "Opening WhatsApp!",
      description: "You'll be redirected to WhatsApp to send your message.",
    });
    
    // Reset form
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  const handleContactMethodClick = (method: typeof contactMethods[0]) => {
    switch (method.action) {
      case 'whatsapp':
        window.open(`https://wa.me/15207361677`, '_blank');
        break;
      case 'email':
        window.location.href = `mailto:davidirihose94@gmail.com`;
        break;
      case 'phone':
        window.location.href = `tel:+15207361677`;
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 px-6 relative overflow-hidden hero-bg">
          <div className="absolute top-20 right-10 w-64 h-64 bg-primary/10 rounded-full blur-[120px] animate-pulse-glow" />
          <div className="absolute bottom-20 left-10 w-64 h-64 bg-accent/10 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: "1s" }} />
          
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <h1 className="text-5xl md:text-7xl font-bold font-space mb-6 animate-fade-in-up">
              Get in <span className="gradient-text animate-gradient-shift">Touch</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-delayed">
              Have a project in mind? Let's discuss how we can help transform your business with innovative digital solutions.
            </p>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-16 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {contactMethods.map((method, index) => {
                const Icon = method.icon;
                return (
                  <div
                    key={method.title}
                    className="glass-card p-6 text-center group hover:scale-105 transition-all duration-300 cursor-pointer"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => handleContactMethodClick(method)}
                  >
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-pulse-glow ${
                      method.action === 'whatsapp' 
                        ? 'bg-green-500/20' 
                        : 'bg-gradient-to-br from-primary/30 to-secondary/20'
                    }`}>
                      <Icon className={`w-8 h-8 ${
                        method.action === 'whatsapp' ? 'text-green-500' : 'text-primary'
                      }`} />
                    </div>
                    <h3 className="text-lg font-bold font-space mb-2">{method.title}</h3>
                    <p className={`text-sm font-medium mb-1 ${
                      method.action === 'whatsapp' ? 'text-green-500' : 'text-primary'
                    }`}>
                      {method.detail}
                    </p>
                    <p className="text-xs text-muted-foreground">{method.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-24 px-6 relative about-bg">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Left Column - Info */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold font-space mb-6 animate-text-glow">
                    Let's Build Something <span className="gradient-text animate-gradient-shift">Amazing</span>
                  </h2>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    Whether you need a stunning website, custom software, or comprehensive digital marketing, we're here to bring your vision to life.
                  </p>
                </div>

                <div className="glass-card p-8 space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold font-space mb-2">Instant WhatsApp</h3>
                      <p className="text-muted-foreground text-sm">
                        Get immediate responses via WhatsApp. We're just a message away!
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold font-space mb-2">Quick Response</h3>
                      <p className="text-muted-foreground text-sm">
                        We typically respond within 24 hours and are committed to addressing your needs promptly.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Globe className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold font-space mb-2">Global Reach</h3>
                      <p className="text-muted-foreground text-sm">
                        Serving clients worldwide with digital solutions that transcend geographical boundaries.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Direct WhatsApp Button */}
                <div className="glass-card p-6 border-2 border-green-500/20">
                  <div className="text-center">
                    <h3 className="text-xl font-bold font-space mb-3 text-green-500">
                      Prefer Direct Chat?
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Click below to start a conversation on WhatsApp instantly
                    </p>
                    <Button
                      onClick={() => window.open('https://wa.me/15207361677', '_blank')}
                      className="bg-green-600 hover:bg-green-700 text-white w-full group"
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Chat on WhatsApp
                      <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right Column - Form */}
              <div className="glass-card p-8">
                <div className="flex items-center mb-6 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                  <MessageCircle className="w-6 h-6 text-green-500 mr-3" />
                  <div>
                    <h3 className="font-semibold text-green-500">WhatsApp Submission</h3>
                    <p className="text-sm text-muted-foreground">
                      This form will open WhatsApp with your message pre-filled
                    </p>
                  </div>
                </div>

                <form onSubmit={handleWhatsAppSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Your Name *</label>
                      <Input
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="bg-background/50 border-white/10 focus:border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Email Address *</label>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="bg-background/50 border-white/10 focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Phone Number</label>
                      <Input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="bg-background/50 border-white/10 focus:border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Subject *</label>
                      <Input
                        type="text"
                        placeholder="Project Inquiry"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                        className="bg-background/50 border-white/10 focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Message *</label>
                    <Textarea
                      placeholder="Tell us about your project..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      rows={6}
                      className="bg-background/50 border-white/10 focus:border-primary resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full group bg-green-600 hover:bg-green-700"
                  >
                    <MessageCircle className="mr-2 w-5 h-5" />
                    Send via WhatsApp
                    <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Marketing Section */}
        <MarketingSection
          svgSrc={turtleSvg}
          title="Let's Create Something"
          highlightedText="Amazing Together"
          description="Ready to take your business to the next level? Our team is excited to hear about your project and help bring your vision to life."
          buttonText="Chat on WhatsApp"
          buttonLink="https://wa.me/15207361677"
          features={[
            { title: "Quick Response", description: "We reply within hours, not days" },
            { title: "Free Consultation", description: "No obligation project discussion" },
          ]}
        />

        {/* Map Section */}
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="glass-card overflow-hidden h-96">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d424143.99840399865!2d-112.59471879921797!3d33.43914729394703!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x872b12ed50a179cb%3A0x8c69c7f8354a1bac!2sPhoenix%2C%20AZ!5e0!3m2!1sen!2sus!4v1645555555555!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
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