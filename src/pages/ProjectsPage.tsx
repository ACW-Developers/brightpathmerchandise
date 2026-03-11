import Navigation from "@/components/Navigation";
import Projects from "@/components/Projects";
import Footer from "@/components/Footer";
import MarketingSection from "@/components/MarketingSection";
import { Code2, Palette, Database, Smartphone, Globe, Zap } from "lucide-react";
import preferenceGraphic from "@/assets/decorations/preference-graphic.svg";
import turtleSvg from "@/assets/decorations/turtle.svg";

const technologies = [
  { icon: Code2, name: "React & Vue.js", color: "text-primary" },
  { icon: Database, name: "PostgreSQL & MongoDB", color: "text-secondary" },
  { icon: Smartphone, name: "Mobile Development", color: "text-accent" },
  { icon: Globe, name: "Cloud Services", color: "text-primary" },
  { icon: Palette, name: "UI/UX Design", color: "text-secondary" },
  { icon: Zap, name: "Django & Node.js", color: "text-accent" },
];

const industries = [
  {
    title: "Healthcare",
    description: "Digital health solutions and patient management systems",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1770&q=80"
  },
  {
    title: "E-Commerce",
    description: "Online stores and marketplace platforms",
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=1632&q=80"
  },
  {
    title: "Education",
    description: "E-learning platforms and educational management systems",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1632&q=80"
  },
  {
    title: "Finance",
    description: "Fintech solutions and financial management tools",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1715&q=80"
  },
];

const ProjectsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 px-6 relative overflow-hidden hero-bg">
          <div className="absolute top-20 right-10 w-64 h-64 bg-accent/10 rounded-full blur-[120px] animate-pulse-glow" />
          <div className="absolute bottom-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: "1s" }} />
          
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <h1 className="text-5xl md:text-7xl font-bold font-space mb-6 animate-fade-in-up">
              Our <span className="gradient-text animate-gradient-shift">Projects</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-delayed">
              Showcasing successful digital solutions that have transformed businesses across various industries.
            </p>
          </div>
        </section>

        {/* Technologies Section */}
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-space mb-4">
                Technologies We <span className="gradient-text">Master</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {technologies.map((tech, index) => {
                const Icon = tech.icon;
                return (
                  <div
                    key={tech.name}
                    className="glass-card p-6 text-center group hover:scale-105 transition-all duration-300"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Icon className={`w-12 h-12 mx-auto mb-3 ${tech.color} group-hover:animate-bounce-subtle`} />
                    <p className="text-sm font-semibold text-muted-foreground">{tech.name}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Main Projects Section */}
        <Projects />

        {/* Marketing Section - Your Preference */}
        <MarketingSection
          svgSrc={preferenceGraphic}
          title="Crafted to Your"
          highlightedText="Specifications"
          description="Every project we undertake is unique. We take the time to understand your specific requirements and deliver solutions that perfectly match your vision and business goals."
          buttonText="Start Your Project"
          buttonLink="/contact"
          features={[
            { title: "Custom Development", description: "Tailored solutions for unique challenges" },
            { title: "Agile Methodology", description: "Flexible and iterative development process" },
            { title: "Quality Assurance", description: "Rigorous testing at every stage" },
          ]}
        />

        {/* Industries Section */}
        <section className="py-24 px-6 relative about-bg">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold font-space mb-6 animate-text-glow">
                Industries We <span className="gradient-text animate-gradient-shift">Serve</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Delivering tailored solutions across diverse sectors with deep industry expertise
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {industries.map((industry, index) => (
                <div
                  key={industry.title}
                  className="glass-card group overflow-hidden hover:scale-105 transition-all duration-500"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={industry.image}
                      alt={industry.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                  </div>
                  <div className="p-6 relative -mt-20">
                    <h3 className="text-2xl font-bold font-space mb-3 cyber-glow">
                      {industry.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {industry.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Marketing Section - Digital Transformation */}
        <MarketingSection
          svgSrc={turtleSvg}
          title="Digital Transformation"
          highlightedText="Made Simple"
          description="Navigate the complexities of digital transformation with our expert guidance. We help you leverage technology to streamline operations and achieve sustainable growth."
          buttonText="Get a Free Consultation"
          buttonLink="/contact"
          reversed
          features={[
            { title: "Strategic Planning", description: "Roadmap for your digital journey" },
            { title: "Seamless Integration", description: "Connect all your systems effortlessly" },
            { title: "Ongoing Optimization", description: "Continuous improvement for best results" },
          ]}
        />
      </main>
      <Footer />
    </div>
  );
};

export default ProjectsPage;
