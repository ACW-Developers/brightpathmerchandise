import React, { useState } from "react";
import { 
  Shield, Fingerprint, Scan, Database, Lock, CheckCircle2, 
  Smartphone, QrCode, Globe, Code, Palette, Printer, Rocket,
  Sparkles, Zap, TrendingUp, Smartphone as Mobile, ShoppingCart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
// Import local images
import evvSoftwareImage from "@/assets/projects/Screenshot (510).png";
import digitalSolutionsImage from "@/assets/projects/healthcare-system.jpg";
import printingBrandingImage from "@/assets/projects/print.jpg";

const ServicesOverview = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  const services = [
    {
      icon: Shield,
      title: "EVV Software Solutions",
      description: "Comprehensive Electronic Visit Verification systems with biometric authentication, GPS tracking, and real-time reporting for healthcare and service industries.",
      category: "evv",
      color: "primary",
      features: ["Biometric Verification", "Real-time GPS Tracking", "Compliance Reporting", "Mobile Applications"],
      image: evvSoftwareImage,
      tag: "Secure & Compliant"
    },
    {
      icon: Globe,
      title: "Digital Solutions",
      description: "End-to-end digital transformation services including web development, mobile apps, and custom software to drive your business forward.",
      category: "digital",
      color: "accent",
      features: ["Web Development", "Mobile Applications", "Custom Software", "Cloud Solutions"],
      image: digitalSolutionsImage,
      tag: "Innovative Tech"
    },
    {
      icon: Printer,
      title: "Printing & Branding",
      description: "Complete branding and printing services from business cards to large-format prints, vehicle wraps, and promotional products.",
      category: "printing",
      color: "secondary",
      features: ["Brand Identity", "Large Format Printing", "Promotional Products", "Vehicle Branding"],
      image: printingBrandingImage,
      tag: "Visual Impact"
    }
  ];

  const features = [
    {
      icon: Fingerprint,
      title: "Biometric Authentication",
      description: "Advanced fingerprint and facial recognition for secure identity verification",
      category: "evv"
    },
    {
      icon: QrCode,
      title: "QR Code Systems",
      description: "Dynamic QR code generation and scanning solutions for various applications",
      category: "evv"
    },
    {
      icon: Code,
      title: "Custom Development",
      description: "Tailored software solutions built to meet your specific business requirements",
      category: "digital"
    },
    {
      icon: Mobile,
      title: "Mobile Apps",
      description: "Native and cross-platform mobile applications for iOS and Android",
      category: "digital"
    },
    {
      icon: Palette,
      title: "Brand Design",
      description: "Professional logo design and brand identity development",
      category: "printing"
    },
    {
      icon: ShoppingCart,
      title: "Promotional Products",
      description: "Custom printed merchandise to boost your brand visibility",
      category: "printing"
    }
  ];

  const filteredFeatures = features.filter(feature => 
    activeCategory === "all" || feature.category === activeCategory
  );

  const filteredServices = services.filter(service =>
    activeCategory === "all" || service.category === activeCategory
  );

  return (
    <section className="py-24 px-6 relative overflow-hidden bg-gradient-to-br from-background via-background/95 to-muted/30">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--primary)) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center space-x-2 bg-primary/10 backdrop-blur-md rounded-full px-6 py-2 mb-6 border border-primary/20">
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            <span className="text-sm font-semibold text-primary">Comprehensive Solutions</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-space mb-6">
            <span className="gradient-text animate-gradient-shift">What We Do</span>
            <br />
            <span className="text-foreground">Our Core Services</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We provide innovative solutions across three key areas: cutting-edge EVV software, 
            comprehensive digital services, and professional printing & branding to elevate your business.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12 animate-fade-in-up">
          {[
            { id: "all", label: "All Services", icon: Sparkles },
            { id: "evv", label: "EVV Software", icon: Shield },
            { id: "digital", label: "Digital Solutions", icon: Globe },
            { id: "printing", label: "Printing & Branding", icon: Printer }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeCategory === item.id ? "default" : "outline"}
                className={`rounded-full px-6 py-3 transition-all duration-300 ${
                  activeCategory === item.id 
                    ? "shadow-lg shadow-primary/25" 
                    : "border-border/50 hover:border-primary/50"
                }`}
                onClick={() => setActiveCategory(item.id)}
              >
                <Icon className="w-4 h-4 mr-2" />
                {item.label}
              </Button>
            );
          })}
        </div>

        {/* Main Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {filteredServices.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card
                key={service.title}
                className="glass-card group hover:scale-105 transition-all duration-500 p-0 border border-border/50 hover:border-primary/50 overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Service Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  
                  {/* Tag */}
                  <div className="absolute top-4 right-4">
                    <div className={`bg-${service.color}/20 backdrop-blur-md rounded-full px-3 py-1 border border-${service.color}/30`}>
                      <span className={`text-sm font-semibold text-${service.color}`}>
                        {service.tag}
                      </span>
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="absolute bottom-4 left-4 w-12 h-12 rounded-xl bg-primary/20 backdrop-blur-md flex items-center justify-center animate-glow-pulse">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold font-space mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {service.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button className="w-full group/btn">
                    Learn More
                    <Rocket className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="glass-card group p-6 border border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                  <Icon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h4 className="text-lg font-bold font-space mb-2 text-foreground">
                  {feature.title}
                </h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center animate-fade-in-up">
          <div className="glass-card p-12 rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5">
            <h3 className="text-3xl font-bold font-space mb-4 text-foreground">
              Ready to Transform Your Business?
            </h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Whether you need secure EVV solutions, digital transformation, or professional branding, 
              we have the expertise to bring your vision to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="group text-lg px-8 py-6"
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              >
                Get Started
                <Rocket className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 border-primary/50 hover:border-primary"
                onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
              >
                View All Services
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Decorative Elements */}
      <div className="absolute top-20 left-10 w-24 h-24 rounded-full bg-primary/10 blur-3xl animate-float" />
      <div className="absolute bottom-32 right-16 w-32 h-32 rounded-full bg-accent/10 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 right-1/4 w-20 h-20 rounded-full bg-secondary/10 blur-3xl animate-float" style={{ animationDelay: '4s' }} />
    </section>
  );
};

export default ServicesOverview;