import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface MarketingSectionProps {
  svgSrc: string;
  title: string;
  highlightedText: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  features?: { title: string; description: string }[];
  reversed?: boolean;
}

const MarketingSection = ({
  svgSrc,
  title,
  highlightedText,
  description,
  buttonText,
  buttonLink,
  features = [],
  reversed = false,
}: MarketingSectionProps) => {
  return (
    <section className="py-20 px-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-accent/3" />
      <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-accent/5 rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className={`grid lg:grid-cols-2 gap-12 items-center ${reversed ? 'lg:flex-row-reverse' : ''}`}>
          {/* SVG Side */}
          <div className={`relative flex justify-center ${reversed ? 'lg:order-2' : 'lg:order-1'}`}>
            <div className="relative w-full max-w-lg">
              <img 
                src={svgSrc} 
                alt={title} 
                className="w-full h-auto drop-shadow-xl animate-float-slow"
              />
              {/* Glow effect behind SVG */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-[60px] -z-10" />
            </div>
          </div>

          {/* Content Side */}
          <div className={`${reversed ? 'lg:order-1' : 'lg:order-2'}`}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-space mb-6 leading-tight">
              {title}{" "}
              <span className="gradient-text animate-gradient-shift">{highlightedText}</span>
            </h2>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {description}
            </p>

            {features.length > 0 && (
              <div className="space-y-4 mb-8">
                {features.map((feature, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-3 p-4 glass-card rounded-lg hover:scale-[1.02] transition-transform"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Link to={buttonLink}>
              <Button size="lg" className="group futuristic-btn">
                {buttonText}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketingSection;
