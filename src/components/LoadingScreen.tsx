import { useEffect, useState } from "react";
import logo from "@/assets/logo/logo.png";

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-background flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-grid-pattern animate-grid-move opacity-20" />
      
      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: "1s" }} />
      
      {/* Content */}
      <div className="relative z-10 text-center">
        {/* Logo with animation */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl animate-ping-slow" />
            <img 
              src={logo} 
              alt="BrightPath Logo" 
              className="h-24 w-24 object-contain relative z-10 animate-float-slow"
            />
          </div>
        </div>
        
        {/* Brand name */}
        <h1 className="text-4xl md:text-5xl font-bold font-space mb-4 animate-text-glow">
          <span className="gradient-text animate-gradient-shift">BrightPath</span>
        </h1>
        <p className="text-muted-foreground text-lg mb-8 animate-fade-in-delayed">
          Technologies
        </p>
        
        {/* Progress bar */}
        <div className="w-64 h-2 bg-muted/30 rounded-full overflow-hidden mx-auto mb-4">
          <div 
            className="h-full bg-gradient-to-r from-primary via-secondary to-accent rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Loading text */}
        <p className="text-sm text-muted-foreground">
          {progress < 100 ? "Loading..." : "Ready!"}
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
