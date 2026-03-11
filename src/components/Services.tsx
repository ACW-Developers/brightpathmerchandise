import React, { useState } from "react";
import {
  Globe,
  Code,
  Palette,
  Share2,
  TrendingUp,
  Headphones,
  Smartphone,
  ShoppingCart,
  Shirt,
  Badge,
  FileText,
  File,
  Printer,
  Rocket,
  Sparkles,
  Car,
  Building2,
  Disc,
  StickyNote,
  BookOpen,
  Book,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import OrderServiceModal from "./OrderServiceModal";

// Import local images
import mainImg from "@/assets/printing/printing.jpeg";
import tshirtImg from "@/assets/printing/tshirt.jpeg";
import capImg from "@/assets/printing/cap.jpeg";
import businessCardsImg from "@/assets/printing/buss.jpeg";
import documentsImg from "@/assets/printing/doc.jpg";
import bannersImg from "@/assets/printing/banners.jpeg";
import promotionalImg from "@/assets/printing/mug.jpeg";
import digitalMarketingImg from "@/assets/services/digital-marketing.jpg";
import ecommerceImg from "@/assets/services/ecommerce.jpg";
import logoDesignImg from "@/assets/services/branding.jpg";
import carBranding from "@/assets/printing/car.png";
import officeBranding from "@/assets/printing/office.jpeg";
import wheelCover from "@/assets/printing/wheel.webp";
import stickers from "@/assets/printing/stickers.jpeg";
import magazines from "@/assets/printing/magazine.jpeg";
import books from "@/assets/printing/book.jpeg";

const Services: React.FC = () => {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");

  const printingServiceImages = {
    main: mainImg,
    tshirt: tshirtImg,
    cap: capImg,
    businessCards: businessCardsImg,
    documents: documentsImg,
    banners: bannersImg,
    promotional: promotionalImg,
    carBranding: carBranding,
    officeBranding: officeBranding,
    wheelCover: wheelCover,
    stickers: stickers,
    magazines: magazines,
    books: books,
  };

  const services = [
    {
      icon: Printer,
      title: "Professional Printing Services",
      description:
        "Comprehensive printing solutions for all your business and personal needs with premium quality and fast turnaround.",
      image: printingServiceImages.main,
      category: "Printing & Branding",
      subServices: [
        {
          icon: Shirt,
          title: "T-Shirt Printing",
          description:
            "Custom t-shirt printing with high-quality materials and vibrant designs for events, promotions, or personal use.",
          image: printingServiceImages.tshirt,
        },
        {
          icon: Badge,
          title: "Cap & Headwear Printing",
          description:
            "Customized caps and headwear with professional embroidery or printing for branding and merchandise.",
          image: printingServiceImages.cap,
        },
        {
          icon: FileText,
          title: "Business Cards & Stationery",
          description:
            "Elegant business cards, letterheads, and stationery that make a lasting impression on your clients.",
          image: printingServiceImages.businessCards,
        },
        {
          icon: File,
          title: "Document Printing & Binding",
          description:
            "Professional document printing, reports, presentations with various binding options for a polished look.",
          image: printingServiceImages.documents,
        },
        {
          icon: TrendingUp,
          title: "Banners & Signage",
          description:
            "Eye-catching banners, signs, and displays for events, retail spaces, and promotional campaigns.",
          image: printingServiceImages.banners,
        },
        {
          icon: ShoppingCart,
          title: "Promotional Products",
          description:
            "Custom printed promotional items including mugs, pens, bags, and more to boost your brand visibility.",
          image: printingServiceImages.promotional,
        },
        {
          icon: Car,
          title: "Car Branding",
          description:
            "Professional vehicle wraps and branding solutions to transform your fleet into mobile advertisements.",
          image: printingServiceImages.carBranding,
        },
        {
          icon: Building2,
          title: "Office Branding",
          description:
            "Complete office branding solutions including wall graphics, signage, and interior decor to reflect your brand identity.",
          image: printingServiceImages.officeBranding,
        },
        {
          icon: Disc,
          title: "Wheel Cover",
          description:
            "Custom designed wheel covers for promotional campaigns and branded vehicles with durable materials.",
          image: printingServiceImages.wheelCover,
        },
        {
          icon: StickyNote,
          title: "Stickers",
          description:
            "High-quality custom stickers in various shapes, sizes, and finishes for branding, packaging, and promotional use.",
          image: printingServiceImages.stickers,
        },
        {
          icon: BookOpen,
          title: "Magazines",
          description:
            "Professional magazine printing with premium paper quality and binding options for publications and portfolios.",
          image: printingServiceImages.magazines,
        },
        {
          icon: Book,
          title: "Books",
          description:
            "Complete book printing services from softcover to hardcover with various binding styles for authors and publishers.",
          image: printingServiceImages.books,
        },
      ],
    },
    {
      icon: Globe,
      title: "Website Design & Development",
      description:
        "Custom websites that combine stunning design with powerful functionality to create exceptional user experiences.",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1715&q=80",
      category: "Digital Solutions",
    },
    {
      icon: Code,
      title: "Custom Software Development",
      description:
        "Tailored software solutions built to meet your specific business requirements and streamline operations.",
      image:
        "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=1770&q=80",
      category: "Digital Solutions",
    },
    {
      icon: Palette,
      title: "Logo & Business Card Design",
      description:
        "Professional brand identity design that makes your business memorable and stands out from the competition.",
      image: logoDesignImg,
      category: "Digital Solutions",
    },
    {
      icon: Share2,
      title: "Social Media Management",
      description:
        "Comprehensive social media strategies to build your online presence and engage with your target audience.",
      image:
        "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=1674&q=80",
      category: "Digital Solutions",
    },
    {
      icon: TrendingUp,
      title: "Digital Marketing & SEO",
      description:
        "Data-driven marketing campaigns and SEO optimization to increase visibility and drive qualified traffic.",
      image: digitalMarketingImg,
      category: "Digital Solutions",
    },
    {
      icon: Headphones,
      title: "IT Consulting & Support",
      description:
        "Expert technology consulting and reliable support services to keep your business running smoothly.",
      image:
        "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?auto=format&fit=crop&w=1780&q=80",
      category: "Digital Solutions",
    },
    {
      icon: Smartphone,
      title: "Mobile App Development",
      description:
        "Native and cross-platform mobile applications that deliver seamless experiences across all devices.",
      image:
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1770&q=80",
      category: "Digital Solutions",
    },
    {
      icon: ShoppingCart,
      title: "E-commerce Solutions",
      description:
        "Complete e-commerce platforms with secure payment processing and inventory management systems.",
      image: ecommerceImg,
      category: "Digital Solutions",
    },
  ];

  const printingService = services[0];
  const otherServices = services.slice(1);

  const handleOrderService = (serviceName: string) => {
    setSelectedService(serviceName);
    setIsOrderModalOpen(true);
  };

  return (
    <section className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-space mb-6">
            Our <span className="gradient-text">Services</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive digital and printing solutions tailored to elevate
            your business and drive success.
          </p>
        </div>

        {/* Printing Services Section */}
        <div className="grid grid-cols-1 gap-6 mb-20">
          <div className="service-card group overflow-hidden lg:col-span-4">
            <div className="relative">
              <div className="relative h-64 overflow-hidden rounded-t-2xl">
                <img
                  src={printingService.image}
                  alt={printingService.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <div className="absolute bottom-4 left-4 w-12 h-12 rounded-xl bg-primary/20 backdrop-blur-md flex items-center justify-center animate-pulse">
                  <printingService.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="absolute top-4 right-4">
                  <div className="bg-background/80 backdrop-blur-md rounded-full px-3 py-1">
                    <span className="text-sm font-semibold text-foreground">
                      {printingService.category}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold font-space mb-3 text-foreground">
                  {printingService.title}
                </h3>
                <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                  {printingService.description}
                </p>

                <div className="mb-6">
                  <Button
                    onClick={() => handleOrderService(printingService.title)}
                    className="futuristic-btn flex items-center gap-2 px-6 py-3"
                  >
                    <Rocket className="w-5 h-5" />
                    Order Now
                  </Button>
                </div>

                {/* Sub-services */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                  {printingService.subServices.map((subService) => {
                    const SubIcon = subService.icon;
                    return (
                      <div
                        key={subService.title}
                        className="bg-muted/30 rounded-xl p-4 transition-all duration-300 hover:bg-muted/50 hover:shadow-lg border border-border/50 group/sub"
                      >
                        <div className="relative h-32 mb-3 overflow-hidden rounded-lg">
                          <img
                            src={subService.image}
                            alt={subService.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover/sub:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                          <div className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-primary/20 backdrop-blur-sm flex items-center justify-center">
                            <SubIcon className="w-4 h-4 text-primary" />
                          </div>
                        </div>

                        <h4 className="font-semibold font-space mb-2 text-foreground">
                          {subService.title}
                        </h4>
                        <p className="text-muted-foreground text-xs leading-relaxed">
                          {subService.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Other Services Section */}
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold font-space mb-4">
            Digital <span className="gradient-text">Solutions</span>
          </h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our comprehensive digital solutions to enhance your business
            presence and operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherServices.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="service-card group overflow-hidden h-full flex flex-col"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative flex-1 flex flex-col">
                  <div className="relative h-48 overflow-hidden rounded-t-2xl">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                    <div className="absolute bottom-4 left-4 w-12 h-12 rounded-xl bg-primary/20 backdrop-blur-md flex items-center justify-center animate-glow-pulse">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="absolute top-4 right-4">
                      <div className="bg-background/80 backdrop-blur-md rounded-full px-3 py-1">
                        <span className="text-sm font-semibold text-foreground">
                          {service.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-lg font-semibold font-space mb-3 text-foreground">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">
                      {service.description}
                    </p>

                    <div className="mt-auto">
                      <Button
                        size="sm"
                        onClick={() => handleOrderService(service.title)}
                        className="futuristic-btn flex items-center gap-1 w-full"
                      >
                        <Rocket className="w-4 h-4" />
                        Order Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <OrderServiceModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        selectedService={selectedService}
      />
    </section>
  );
};

export default Services;
