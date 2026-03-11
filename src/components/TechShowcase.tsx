import { Code2, Zap, Layers, Globe2, Cpu, CloudCog } from "lucide-react";
import miteImg from "@/assets/projects/mite.png";
import jikubaliImg from "@/assets/projects/jikubali.png";
import cityImg from "@/assets/projects/city.png";

const TechShowcase = () => {
  const techFeatures = [
    {
      icon: Code2,
      title: "Modern Development",
      description: "Cutting-edge technologies and best practices for scalable applications"
    },
    {
      icon: CloudCog,
      title: "Cloud Solutions",
      description: "Robust cloud infrastructure for reliability and performance"
    },
    {
      icon: Cpu,
      title: "AI Integration",
      description: "Smart automation and intelligent decision-making systems"
    },
    {
      icon: Globe2,
      title: "Global Reach",
      description: "Cross-platform solutions accessible anywhere, anytime"
    }
  ];

  const showcaseProjects = [
    {
      title: "MITE System",
      description: "Advanced electronic verification and tracking platform",
      image: miteImg,
      tags: ["Verification", "Real-time", "Secure"]
    },
    {
      title: "Jikubali Platform",
      description: "Comprehensive digital management solution",
      image: jikubaliImg,
      tags: ["Management", "Analytics", "Cloud"]
    },
    {
      title: "Smart City Integration",
      description: "IoT-enabled urban management systems",
      image: cityImg,
      tags: ["IoT", "Smart Tech", "Integration"]
    }
  ];

  return (
    <section className="py-24 px-6 relative overflow-hidden bg-gradient-to-b from-background to-background/50">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Tech Stack Highlights */}
        <div className="mb-20 animate-fade-in-up">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-accent/10 backdrop-blur-md rounded-full px-6 py-2 mb-6 border border-accent/20">
              <Zap className="w-5 h-5 text-accent animate-pulse" />
              <span className="text-sm font-semibold text-accent">Powered by Innovation</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold font-space mb-4">
              <span className="gradient-text">Technology</span> That Drives Results
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {techFeatures.map((feature, index) => (
              <div
                key={index}
                className="glass-card p-6 group hover:scale-105 transition-all duration-500 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold font-space mb-2 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Project Showcase */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold font-space mb-4">
              Featured <span className="gradient-text">Solutions</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Real-world applications built with precision and innovation
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {showcaseProjects.map((project, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl glass-card border border-border/50 hover:border-primary/50 transition-all duration-500 animate-fade-in"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                  
                  {/* Floating Icon */}
                  <div className="absolute top-4 right-4 w-12 h-12 rounded-xl bg-primary/20 backdrop-blur-md flex items-center justify-center border border-primary/30 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                    <Layers className="w-6 h-6 text-primary" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold font-space mb-2 text-foreground group-hover:text-primary transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 rounded-full bg-primary/5 blur-3xl animate-float" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-accent/5 blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>
    </section>
  );
};

export default TechShowcase;
