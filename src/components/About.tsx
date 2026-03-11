import { Target, Eye, Heart, Users, Lightbulb, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const values = [
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "Continuously bringing fresh, creative, and effective ideas to our clients."
  },
  {
    icon: Target,
    title: "Excellence",
    description: "Striving for the highest quality in every solution delivered."
  },
  {
    icon: Heart,
    title: "Integrity",
    description: "Building trust through honesty, transparency, and accountability."
  },
  {
    icon: Users,
    title: "Customer Success",
    description: "Prioritizing client growth and satisfaction above all."
  },
  {
    icon: Users,
    title: "Collaboration",
    description: "Working together with clients and within our team to achieve outstanding results."
  },
  {
    icon: Zap,
    title: "Adaptability",
    description: "Embracing change and leveraging technology to stay ahead."
  }
];

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-6 relative overflow-hidden about-bg">
      {/* Floating geometric shapes */}
      <div className="absolute top-20 right-10 w-32 h-32 border border-primary/20 rotate-45 animate-spin-slow" />
      <div className="absolute bottom-40 left-20 w-24 h-24 border border-secondary/20 rotate-12 animate-pulse-glow" />
      <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-accent/10 rounded-full animate-float-slow" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* About Us */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <div className={`transition-all duration-1000 ${isVisible ? 'animate-slide-in-left opacity-100' : 'opacity-0 -translate-x-10'}`}>
            <h2 className="text-4xl md:text-5xl font-bold font-space mb-6 animate-text-glow">
              About <span className="gradient-text animate-gradient-shift">BrightPath</span>
            </h2>
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p className={`transition-all duration-1000 delay-300 ${isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-5'}`}>
                At BrightPath Technologies, we believe that every business deserves a powerful digital presence. We are a dynamic team of designers, developers, and strategists passionate about delivering solutions that go beyond expectations.
              </p>
              <p className={`transition-all duration-1000 delay-500 ${isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-5'}`}>
                From creating stunning websites and custom software to designing impactful brand identities and managing your digital footprint, we partner with you to turn your vision into reality.
              </p>
              <p className={`transition-all duration-1000 delay-700 ${isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-5'}`}>
                Our approach is simple: we listen, we innovate, and we deliver. Whether you are a startup, a growing business, or an established enterprise, our solutions are designed to scale with you.
              </p>
            </div>
          </div>
          
          <div className={`glass-card p-8 hover:scale-105 transition-all duration-500 animate-glow-pulse ${isVisible ? 'animate-slide-in-right opacity-100' : 'opacity-0 translate-x-10'}`}>
            <div className="space-y-8">
              <div className="group">
                <div className="flex items-center space-x-3 mb-4">
                  <Target className="w-6 h-6 text-primary group-hover:animate-spin transition-all duration-300" />
                  <h3 className="text-xl font-semibold font-space cyber-glow">Mission</h3>
                </div>
                <p className="text-muted-foreground">
                  To empower businesses and individuals by providing innovative, reliable, and tailor-made digital solutions that enhance growth, streamline processes, and amplify brand presence in a rapidly evolving digital world.
                </p>
              </div>
              
              <div className="group">
                <div className="flex items-center space-x-3 mb-4">
                  <Eye className="w-6 h-6 text-secondary group-hover:animate-bounce transition-all duration-300" />
                  <h3 className="text-xl font-semibold font-space cyber-glow">Vision</h3>
                </div>
                <p className="text-muted-foreground">
                  To be a leading digital solutions partner recognized for creativity, innovation, and customer-centric services, driving business success across industries and borders.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-10'}`}>
          <h3 className="text-3xl md:text-4xl font-bold font-space mb-6 animate-text-glow">
            Our <span className="gradient-text animate-gradient-shift">Core Values</span>
          </h3>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            The principles that guide everything we do and shape our commitment to excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div
                key={value.title}
                className={`glass-card p-6 text-center hover:scale-105 hover:animate-glow-pulse group transition-all duration-500 ${
                  isVisible ? 'animate-slide-in-up opacity-100' : 'opacity-0 translate-y-10'
                }`}
                style={{ 
                  animationDelay: `${index * 0.2}s`,
                  transitionDelay: `${index * 0.1}s`
                }}
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/30 to-secondary/20 flex items-center justify-center mx-auto mb-4 group-hover:animate-pulse-glow transition-all duration-300">
                  <Icon className="w-8 h-8 text-primary group-hover:scale-110 group-hover:animate-bounce transition-all duration-300" />
                </div>
                <h4 className="text-lg font-semibold font-space mb-3 cyber-glow">{value.title}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default About;