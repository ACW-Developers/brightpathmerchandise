import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import OrderServiceModal from "@/components/OrderServiceModal";
import { Button } from "@/components/ui/button";
import {
  Globe,
  Code,
  Palette,
  Share2,
  TrendingUp,
  Headphones,
  Smartphone,
  ShoppingCart,
  Rocket,
  Zap,
  CheckCircle2,
} from "lucide-react";

import digitalMarketingImg from "@/assets/services/digital-marketing.jpg";
import ecommerceImg from "@/assets/services/ecommerce.jpg";
import logoDesignImg from "@/assets/services/branding.jpg";
import decorativeBlob from "@/assets/decorative-blob.svg";

const digitalServices = [
  {
    icon: Globe,
    title: "Website Design & Development",
    description: "Custom websites that combine stunning design with powerful functionality to create exceptional user experiences.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1715&q=80",
    features: ["Responsive Design", "SEO Optimized", "Fast Loading", "Custom CMS"],
  },
  {
    icon: Code,
    title: "Custom Software Development",
    description: "Tailored software solutions built to meet your specific business requirements and streamline operations.",
    image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=1770&q=80",
    features: ["Scalable Architecture", "API Integration", "Cloud Deployment", "24/7 Support"],
  },
  {
    icon: Palette,
    title: "Logo & Business Card Design",
    description: "Professional brand identity design that makes your business memorable and stands out from the competition.",
    image: logoDesignImg,
    features: ["Multiple Concepts", "Vector Files", "Brand Guidelines", "Print Ready"],
  },
  {
    icon: Share2,
    title: "Social Media Management",
    description: "Comprehensive social media strategies to build your online presence and engage with your target audience.",
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=1674&q=80",
    features: ["Content Creation", "Engagement Strategy", "Analytics Reports", "Ad Management"],
  },
  {
    icon: TrendingUp,
    title: "Digital Marketing & SEO",
    description: "Data-driven marketing campaigns and SEO optimization to increase visibility and drive qualified traffic.",
    image: digitalMarketingImg,
    features: ["Keyword Research", "PPC Campaigns", "Conversion Tracking", "Monthly Reports"],
  },
  {
    icon: Headphones,
    title: "IT Consulting & Support",
    description: "Expert technology consulting and reliable support services to keep your business running smoothly.",
    image: "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?auto=format&fit=crop&w=1780&q=80",
    features: ["Infrastructure Setup", "Security Audits", "Remote Support", "Training"],
  },
  {
    icon: Smartphone,
    title: "Mobile App Development",
    description: "Native and cross-platform mobile applications that deliver seamless experiences across all devices.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1770&q=80",
    features: ["iOS & Android", "Push Notifications", "Offline Mode", "App Store Publishing"],
  },
  {
    icon: ShoppingCart,
    title: "E-commerce Solutions",
    description: "Complete e-commerce platforms with secure payment processing and inventory management systems.",
    image: ecommerceImg,
    features: ["Payment Gateway", "Inventory Management", "Order Tracking", "Multi-Currency"],
  },
];

const DigitalSolutionsPage = () => {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");

  const handleOrderService = (serviceName: string) => {
    setSelectedService(serviceName);
    setIsOrderModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-24 px-6 relative overflow-hidden hero-bg">
          {/* Decorative Blobs */}
          <div className="absolute -left-32 -top-32 w-[600px] h-[600px] opacity-20 pointer-events-none">
            <img src={decorativeBlob} alt="" className="w-full h-full animate-float-slow" />
          </div>
          <div className="absolute -right-32 -bottom-32 w-[500px] h-[500px] opacity-15 pointer-events-none rotate-90">
            <img src={decorativeBlob} alt="" className="w-full h-full animate-float-slow" style={{ animationDelay: '-4s' }} />
          </div>

          {/* Animated grid background */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5 animate-grid-move" />
          
          <div className="absolute top-20 left-10 w-64 h-64 bg-secondary/10 rounded-full blur-[120px] animate-pulse-glow" />
          <div className="absolute bottom-20 right-10 w-64 h-64 bg-accent/10 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: "1s" }} />
          
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6">
              <Zap className="w-5 h-5 text-secondary animate-pulse" />
              <span className="text-sm font-medium text-muted-foreground">Innovative Technology Solutions</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold font-space mb-6 animate-fade-in-up">
              Digital <span className="gradient-text animate-gradient-shift">Solutions</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-delayed">
              Transform your business with cutting-edge digital solutions. From web development to mobile apps, we bring your vision to life.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-24 px-6 relative">
          <div className="absolute left-0 top-1/3 w-[400px] h-[400px] opacity-10 pointer-events-none">
            <img src={decorativeBlob} alt="" className="w-full h-full" />
          </div>
          
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold font-space mb-6">
                Our <span className="gradient-text">Services</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Comprehensive digital solutions to power your business growth
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {digitalServices.map((service, index) => {
                const Icon = service.icon;
                return (
                  <div
                    key={service.title}
                    className="glass-card group overflow-hidden hover:scale-[1.02] transition-all duration-500 flex flex-col md:flex-row"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="relative w-full md:w-2/5 h-64 md:h-auto overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-background md:bg-gradient-to-r md:from-transparent md:to-background" />
                      <div className="absolute top-4 left-4 w-12 h-12 rounded-xl bg-primary/20 backdrop-blur-md flex items-center justify-center group-hover:bg-primary/40 transition-colors">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-center">
                      <h3 className="text-xl font-bold font-space mb-3 text-foreground group-hover:text-primary transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        {service.description}
                      </p>
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {service.features.map((feature) => (
                          <div key={feature} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <CheckCircle2 className="w-3 h-3 text-primary" />
                            {feature}
                          </div>
                        ))}
                      </div>
                      <Button
                        onClick={() => handleOrderService(service.title)}
                        className="futuristic-btn w-full md:w-auto"
                      >
                        <Rocket className="w-4 h-4 mr-2" />
                        Order Now
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="py-16 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold font-space mb-4">
                Technologies We <span className="gradient-text">Use</span>
              </h3>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {["React", "Vue.js", "Node.js", "Django", "PostgreSQL", "MongoDB", "AWS", "Docker", "TypeScript", "Python", "Flutter", "Tailwind CSS"].map((tech) => (
                <span
                  key={tech}
                  className="glass-card px-4 py-2 text-sm font-medium hover:bg-primary/20 transition-colors cursor-default"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 via-primary/10 to-accent/10" />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="glass-card p-12">
              <Code className="w-12 h-12 text-secondary mx-auto mb-6 animate-bounce-subtle" />
              <h2 className="text-3xl md:text-5xl font-bold font-space mb-6">
                Ready to Go <span className="gradient-text">Digital?</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Transform your business with our innovative digital solutions. Let's build something amazing together.
              </p>
              <Button
                size="lg"
                onClick={() => handleOrderService("Custom Digital Solution")}
                className="futuristic-btn px-8 py-4 text-lg"
              >
                <Rocket className="w-5 h-5 mr-2" />
                Start Your Project
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <OrderServiceModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        selectedService={selectedService}
      />
    </div>
  );
};

export default DigitalSolutionsPage;
