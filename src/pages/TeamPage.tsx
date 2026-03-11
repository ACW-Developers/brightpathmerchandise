import Navigation from "@/components/Navigation";
import Team from "@/components/Team";
import Footer from "@/components/Footer";
import { Users2, Target, Lightbulb, Rocket, Heart, Zap } from "lucide-react";
import teamGraphic from "@/assets/decorations/team-graphic.svg";

const culture = [
  {
    icon: Users2,
    title: "Collaborative Environment",
    description: "We foster a culture of teamwork where diverse perspectives drive innovation and creative solutions."
  },
  {
    icon: Lightbulb,
    title: "Continuous Learning",
    description: "Committed to professional growth through training, workshops, and staying ahead of industry trends."
  },
  {
    icon: Heart,
    title: "Work-Life Balance",
    description: "We believe happy teams create exceptional work, promoting a healthy balance between professional and personal life."
  },
  {
    icon: Rocket,
    title: "Innovation First",
    description: "Encouraging creative thinking and experimentation to push the boundaries of what's possible."
  },
];

const values = [
  {
    icon: Target,
    title: "Excellence",
    description: "Pursuing the highest standards in every project we undertake."
  },
  {
    icon: Heart,
    title: "Passion",
    description: "Bringing enthusiasm and dedication to everything we do."
  },
  {
    icon: Users2,
    title: "Collaboration",
    description: "Working together to achieve extraordinary results."
  },
  {
    icon: Zap,
    title: "Innovation",
    description: "Embracing new ideas and cutting-edge technologies."
  },
];

const TeamPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 px-6 relative overflow-hidden hero-bg">
          <div className="absolute top-20 right-10 w-64 h-64 bg-primary/10 rounded-full blur-[120px] animate-pulse-glow" />
          <div className="absolute bottom-20 left-10 w-64 h-64 bg-accent/10 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: "1s" }} />
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left - SVG Graphic */}
              <div className="hidden lg:flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/10 rounded-full blur-[80px]" />
                  <img 
                    src={teamGraphic} 
                    alt="Team collaboration" 
                    className="relative z-10 w-full max-w-md h-auto drop-shadow-2xl animate-float"
                  />
                </div>
              </div>
              
              {/* Right - Content */}
              <div className="text-center lg:text-left">
                <h1 className="text-5xl md:text-7xl font-bold font-space mb-6 animate-fade-in-up">
                  Meet Our <span className="gradient-text animate-gradient-shift">Team</span>
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl animate-fade-in-delayed">
                  Passionate innovators dedicated to delivering exceptional digital solutions that transform businesses.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Team Section */}
        <Team />

        {/* Culture Section */}
        <section className="py-24 px-6 relative about-bg">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold font-space mb-6 animate-text-glow">
                Our <span className="gradient-text animate-gradient-shift">Culture</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                A dynamic workplace where innovation thrives and talent flourishes
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {culture.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="glass-card p-8 group hover:scale-105 transition-all duration-500"
                    style={{ animationDelay: `${index * 0.15}s` }}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/30 to-secondary/20 flex items-center justify-center flex-shrink-0 group-hover:animate-pulse-glow">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold font-space mb-3 cyber-glow">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold font-space mb-6 animate-text-glow">
                Our <span className="gradient-text animate-gradient-shift">Values</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                The core principles that guide our work and define who we are
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div
                    key={value.title}
                    className="glass-card p-6 text-center group hover:scale-105 transition-all duration-300"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/30 to-secondary/20 flex items-center justify-center mx-auto mb-4 group-hover:animate-pulse-glow">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold font-space mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Join Us Section */}
        <section className="py-24 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <div className="glass-card p-8 relative overflow-hidden">
                  <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
                  <div className="relative z-10">
                    <img 
                      src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1770&q=80"
                      alt="Join our team"
                      className="rounded-xl w-full h-auto object-cover"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-4xl md:text-5xl font-bold font-space mb-6 animate-text-glow">
                  Join Our <span className="gradient-text">Team</span>
                </h2>
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  Are you passionate about technology and innovation? We're always looking for talented individuals who share our vision of transforming businesses through digital solutions.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <p className="text-muted-foreground">Competitive compensation packages</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-secondary rounded-full" />
                    <p className="text-muted-foreground">Professional development opportunities</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-accent rounded-full" />
                    <p className="text-muted-foreground">Flexible work arrangements</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <p className="text-muted-foreground">Collaborative and innovative culture</p>
                  </div>
                </div>
                <a href="#contact">
                  <button className="glass-button px-8 py-4 text-lg font-semibold hover:scale-105 transition-all duration-300">
                    Get In Touch
                  </button>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TeamPage;
