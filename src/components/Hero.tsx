import { ArrowRight, Sparkles, Zap, Globe, Shield, Lock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-bg.jpg";
// Import local images
import printingBrandingImage from "@/assets/projects/print.jpg";
import digitalSolutionsImage from "@/assets/projects/healthcare-system.jpg";
import evvSoftwareImage from "@/assets/projects/Screenshot (510).png";
import { useState, useEffect } from "react";

const Hero = () => {
  const [typedText, setTypedText] = useState("");
  const fullText = "Transforming Ideas into Digital Success";
  
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 100);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[120vh] md:min-h-screen flex items-center hero-bg overflow-hidden">
      {/* Particles Background */}
      <div className="particles">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      {/* Hero Background Image */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Text Content */}
          <div className="animate-fade-in-up max-w-2xl text-left">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-1 mb-4 border border-white/20 animate-glow-pulse">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-sm font-medium">Welcome to the Future</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-6xl mt-8 md:mt-0 font-bold font-space mb-4 animate-slide-in-left">
              <span className="gradient-text animate-gradient-shift">BrightPath</span>
              <br />
              <span className="text-foreground animate-fade-in-delayed">Technologies</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 font-inter typing-animation">
              {typedText}
              <span className="animate-blink">|</span>
            </p>

            <p className="text-lg text-muted-foreground mb-12 max-w-2xl leading-relaxed animate-fade-in-delayed-2 hidden md:block">
              Empowering businesses with innovative, reliable, and tailor-made digital solutions that enhance growth, streamline processes, and amplify brand presence in a rapidly evolving digital world.
            </p>

            <p className="text-base text-muted-foreground mb-4 leading-relaxed animate-fade-in-delayed-2 block md:hidden">
              Empowering businesses with reliable digital solutions for growth and visibility.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-start animate-slide-in-up">
              <Link to="/services">
                <Button
                  size="lg"
                  variant="glass"
                  className="hidden md:flex group text-lg px-6 py-3 animate-bounce-subtle hover:animate-glow-pulse"
                >
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-all duration-300" />
                </Button>
              </Link>

              <Link to="/services">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-6 py-3 border-primary/50 hover:border-primary hover:shadow-glow transition-all duration-300"
                >
                  Our Services
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Elegant Image Stack Section */}
          <div className="relative w-full lg:w-1/2 flex justify-center items-center animate-fade-in">
            <div className="relative w-80 h-80">
              {/* Background Glow Effects */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 rounded-full bg-primary/20 blur-2xl animate-pulse-glow" />
                <div className="absolute w-72 h-72 rounded-full bg-accent/15 blur-xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
              </div>

              {/* Image Stack */}
              <div className="relative w-full h-full flex items-center justify-center">
                
                {/* Printing & Branding Image */}
                <div className="absolute z-30 -left-4 top-1/2 transform -translate-y-1/2 animate-float-delayed-1">
                  <div className="relative group">
                    <div className="w-48 h-48 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl shadow-primary/20 transition-all duration-500 group-hover:scale-105 group-hover:border-primary/40 group-hover:shadow-primary/30">
                      <img 
                        src={printingBrandingImage}
                        alt="Printing and Branding"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>
                    
                    {/* Tag */}
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 z-40">
                      <div className="bg-gradient-to-r from-primary to-primary/80 text-white px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap shadow-lg border border-white/20 backdrop-blur-sm flex items-center gap-2 group-hover:scale-110 transition-transform duration-300">
                        <Zap className="w-3 h-3" />
                        Printing & Branding
                      </div>
                    </div>
                  </div>
                </div>

                {/* Digital Solutions Image */}
                <div className="absolute z-20 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-float">
                  <div className="relative group">
                    <div className="w-52 h-52 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl shadow-accent/20 transition-all duration-500 group-hover:scale-105 group-hover:border-accent/40 group-hover:shadow-accent/30">
                      <img 
                        src={digitalSolutionsImage}
                        alt="Digital Solutions"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>
                    
                    {/* Tag */}
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 z-40">
                      <div className="bg-gradient-to-r from-accent to-accent/80 text-white px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap shadow-lg border border-white/20 backdrop-blur-sm flex items-center gap-2 group-hover:scale-110 transition-transform duration-300">
                        <Globe className="w-3 h-3" />
                        Digital Solutions
                      </div>
                    </div>
                  </div>
                </div>

                {/* EVV Software Image */}
                <div className="absolute z-10 -right-5 top-1/5 transform -translate-y-1/2 animate-float-delayed-2">
                  <div className="relative group">
                    <div className="w-48 h-48 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl shadow-secondary/20 transition-all duration-500 group-hover:scale-105 group-hover:border-secondary/40 group-hover:shadow-secondary/30">
                      <img 
                        src={evvSoftwareImage}
                        alt="EVV Software"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>
                    
                    {/* Tag */}
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-40">
                      <div className="bg-gradient-to-r from-secondary to-secondary/80 text-gray-500 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap shadow-lg border border-white/20 backdrop-blur-sm flex items-center gap-2 group-hover:scale-110 transition-transform duration-300">
                        <Shield className="w-3 h-3" />
                        EVV Software
                      </div>
                    </div>
                  </div>
                </div>

                {/* Connecting Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="hsl(var(--primary))" />
                      <stop offset="50%" stopColor="hsl(var(--accent))" />
                      <stop offset="100%" stopColor="hsl(var(--secondary))" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 120 240 Q 200 200 280 160"
                    stroke="url(#lineGradient)"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="8,8"
                    className="animate-pulse"
                  />
                  <path
                    d="M 120 240 Q 240 240 360 240"
                    stroke="url(#lineGradient)"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="8,8"
                    className="animate-pulse"
                    style={{ animationDelay: '0.3s' }}
                  />
                </svg>
              </div>

              {/* Floating Tech Icons */}
              <div className="absolute -top-4 -right-4 w-16 h-16 rounded-2xl bg-primary/10 backdrop-blur-sm flex items-center justify-center border border-primary/20 animate-float">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              
              <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-2xl bg-accent/10 backdrop-blur-sm flex items-center justify-center border border-accent/20 animate-float" style={{ animationDelay: '1s' }}>
                <Lock className="w-8 h-8 text-accent" />
              </div>
              
              <div className="absolute top-1/2 -right-8 w-16 h-16 rounded-2xl bg-secondary/10 backdrop-blur-sm flex items-center justify-center border border-secondary/20 animate-float" style={{ animationDelay: '2s' }}>
                <CheckCircle2 className="w-8 h-8 text-secondary" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-primary/20 blur-xl float" />
      <div className="absolute bottom-32 right-16 w-32 h-32 rounded-full bg-accent/20 blur-xl float-delayed" />
      <div className="absolute top-1/2 left-20 w-16 h-16 rounded-full bg-secondary/20 blur-xl float" />
    </section>
  );
};

export default Hero;