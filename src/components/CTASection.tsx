import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Rocket, ArrowRight, Sparkles } from "lucide-react";
import turtleSvg from "@/assets/decorations/turtle.svg";

const CTASection = () => {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[150px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-[130px] animate-pulse-glow" style={{ animationDelay: '1s' }} />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="glass-card p-8 md:p-12 relative overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left side - SVG Illustration */}
            <div className="relative flex justify-center lg:justify-start order-2 lg:order-1">
              <div className="relative w-full max-w-md lg:max-w-lg">
                <img 
                  src={turtleSvg} 
                  alt="Digital transformation illustration" 
                  className="w-full h-auto animate-float-slow drop-shadow-2xl"
                />
                {/* Decorative glow behind SVG */}
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-[80px] -z-10" />
              </div>
            </div>

            {/* Right side - Content */}
            <div className="relative z-10 text-center lg:text-left order-1 lg:order-2">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-full px-4 py-2 mb-6">
                <Rocket className="w-4 h-4 text-primary animate-bounce-subtle" />
                <span className="text-sm font-medium text-primary">Let's Build Together</span>
              </div>

              {/* Heading */}
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold font-space mb-6 leading-tight">
                Ready to Transform
                <br />
                <span className="gradient-text animate-gradient-shift">Your Business?</span>
              </h2>

              {/* Description */}
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-8">
                From innovative digital solutions to premium printing services, 
                we're here to help you succeed in the modern marketplace.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/contact">
                  <Button
                    size="lg"
                    className="futuristic-btn group/btn px-8 py-6 text-lg font-semibold w-full sm:w-auto"
                  >
                    <Rocket className="w-5 h-5 mr-2 group-hover/btn:animate-bounce" />
                    Start Your Project
                    <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/services">
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-8 py-6 text-lg border-primary/50 hover:border-primary hover:bg-primary/10 transition-all w-full sm:w-auto"
                  >
                    Explore Services
                  </Button>
                </Link>
              </div>

              {/* Stats row */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 mt-10 pt-8 border-t border-border/50">
                <div className="text-center">
                  <div className="text-2xl font-bold gradient-text">10+</div>
                  <div className="text-xs text-muted-foreground">Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold gradient-text">5+</div>
                  <div className="text-xs text-muted-foreground">Clients</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold gradient-text">100%</div>
                  <div className="text-xs text-muted-foreground">Satisfaction</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold gradient-text">24/7</div>
                  <div className="text-xs text-muted-foreground">Support</div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating sparkle decoration */}
          <div className="absolute top-6 right-6 opacity-20">
            <Sparkles className="w-12 h-12 text-primary animate-float" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
