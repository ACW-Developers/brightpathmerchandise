import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import OrderServiceModal from "@/components/OrderServiceModal";
import { Button } from "@/components/ui/button";
import {
  Shirt,
  Badge,
  FileText,
  File,
  TrendingUp,
  ShoppingCart,
  Car,
  Building2,
  Disc,
  StickyNote,
  BookOpen,
  Book,
  Rocket,
  Printer,
  Sparkles,
} from "lucide-react";

// Import images
import mainImg from "@/assets/printing/printing.jpeg";
import tshirtImg from "@/assets/printing/tshirt.jpeg";
import capImg from "@/assets/printing/cap.jpeg";
import businessCardsImg from "@/assets/printing/buss.jpeg";
import documentsImg from "@/assets/printing/doc.jpg";
import bannersImg from "@/assets/printing/banners.jpeg";
import promotionalImg from "@/assets/printing/mug.jpeg";
import carBranding from "@/assets/printing/car.png";
import officeBranding from "@/assets/printing/office.jpeg";
import wheelCover from "@/assets/printing/wheel.webp";
import stickers from "@/assets/printing/stickers.jpeg";
import magazines from "@/assets/printing/magazine.jpeg";
import books from "@/assets/printing/book.jpeg";
import decorativeBlob from "@/assets/decorative-blob.svg";

const printingServices = [
  {
    icon: Shirt,
    title: "T-Shirt Printing",
    description: "Custom t-shirt printing with high-quality materials and vibrant designs for events, promotions, or personal use.",
    image: tshirtImg,
  },
  {
    icon: Badge,
    title: "Cap & Headwear Printing",
    description: "Customized caps and headwear with professional embroidery or printing for branding and merchandise.",
    image: capImg,
  },
  {
    icon: FileText,
    title: "Business Cards & Stationery",
    description: "Elegant business cards, letterheads, and stationery that make a lasting impression on your clients.",
    image: businessCardsImg,
  },
  {
    icon: File,
    title: "Document Printing & Binding",
    description: "Professional document printing, reports, presentations with various binding options for a polished look.",
    image: documentsImg,
  },
  {
    icon: TrendingUp,
    title: "Banners & Signage",
    description: "Eye-catching banners, signs, and displays for events, retail spaces, and promotional campaigns.",
    image: bannersImg,
  },
  {
    icon: ShoppingCart,
    title: "Promotional Products",
    description: "Custom printed promotional items including mugs, pens, bags, and more to boost your brand visibility.",
    image: promotionalImg,
  },
  {
    icon: Car,
    title: "Car Branding",
    description: "Professional vehicle wraps and branding solutions to transform your fleet into mobile advertisements.",
    image: carBranding,
  },
  {
    icon: Building2,
    title: "Office Branding",
    description: "Complete office branding solutions including wall graphics, signage, and interior decor to reflect your brand identity.",
    image: officeBranding,
  },
  {
    icon: Disc,
    title: "Wheel Cover",
    description: "Custom designed wheel covers for promotional campaigns and branded vehicles with durable materials.",
    image: wheelCover,
  },
  {
    icon: StickyNote,
    title: "Stickers",
    description: "High-quality custom stickers in various shapes, sizes, and finishes for branding, packaging, and promotional use.",
    image: stickers,
  },
  {
    icon: BookOpen,
    title: "Magazines",
    description: "Professional magazine printing with premium paper quality and binding options for publications and portfolios.",
    image: magazines,
  },
  {
    icon: Book,
    title: "Books",
    description: "Complete book printing services from softcover to hardcover with various binding styles for authors and publishers.",
    image: books,
  },
];

const PrintingBrandingPage = () => {
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
        {/* Hero Section with Blob */}
        <section className="py-24 px-6 relative overflow-hidden hero-bg">
          {/* Decorative Blob */}
          <div className="absolute -right-32 -top-32 w-[600px] h-[600px] opacity-20 pointer-events-none">
            <img src={decorativeBlob} alt="" className="w-full h-full animate-float-slow" />
          </div>
          <div className="absolute -left-32 -bottom-32 w-[500px] h-[500px] opacity-15 pointer-events-none rotate-180">
            <img src={decorativeBlob} alt="" className="w-full h-full animate-float-slow" style={{ animationDelay: '-3s' }} />
          </div>
          
          <div className="absolute top-20 right-10 w-64 h-64 bg-accent/10 rounded-full blur-[120px] animate-pulse-glow" />
          <div className="absolute bottom-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: "1s" }} />
          
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6">
              <Printer className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Professional Printing Solutions</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold font-space mb-6 animate-fade-in-up">
              Printing & <span className="gradient-text animate-gradient-shift">Branding</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-delayed">
              Premium quality printing and branding solutions that make your business stand out. From apparel to office branding, we've got you covered.
            </p>
          </div>
        </section>

        {/* Main Image Banner */}
        <section className="relative h-80 overflow-hidden">
          <img src={mainImg} alt="Printing Services" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold font-space text-foreground mb-2">Full-Service Printing</h2>
              <p className="text-muted-foreground">From concept to delivery, we handle it all</p>
            </div>
            <Button
              onClick={() => handleOrderService("Professional Printing Services")}
              className="futuristic-btn flex items-center gap-2"
            >
              <Rocket className="w-5 h-5" />
              Order Now
            </Button>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-24 px-6 relative">
          {/* More decorative blobs */}
          <div className="absolute right-0 top-1/4 w-[400px] h-[400px] opacity-10 pointer-events-none">
            <img src={decorativeBlob} alt="" className="w-full h-full" />
          </div>
          
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold font-space mb-6">
                Our <span className="gradient-text">Services</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Comprehensive printing and branding solutions for every need
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {printingServices.map((service, index) => {
                const Icon = service.icon;
                return (
                  <div
                    key={service.title}
                    className="glass-card group overflow-hidden hover:scale-105 transition-all duration-500"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
                      <div className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-primary/20 backdrop-blur-md flex items-center justify-center group-hover:bg-primary/40 transition-colors">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold font-space mb-2 text-foreground group-hover:text-primary transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {service.description}
                      </p>
                      <Button
                        size="sm"
                        onClick={() => handleOrderService(service.title)}
                        className="w-full futuristic-btn"
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

        {/* CTA Section */}
        <section className="py-24 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10" />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="glass-card p-12">
              <Sparkles className="w-12 h-12 text-primary mx-auto mb-6 animate-pulse" />
              <h2 className="text-3xl md:text-5xl font-bold font-space mb-6">
                Ready to <span className="gradient-text">Stand Out?</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Let's create stunning prints and branding materials that elevate your business to the next level.
              </p>
              <Button
                size="lg"
                onClick={() => handleOrderService("Custom Printing Package")}
                className="futuristic-btn px-8 py-4 text-lg"
              >
                <Rocket className="w-5 h-5 mr-2" />
                Get Started Today
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

export default PrintingBrandingPage;
