import Navigation from "@/components/Navigation";
import About from "@/components/About";
import Footer from "@/components/Footer";
import MarketingSection from "@/components/MarketingSection";
import { Shield, Award, Users2, TrendingUp, Clock, Globe2, Sparkles } from "lucide-react";
import turtleSvg from "@/assets/decorations/turtle.svg";
import boostGraphic from "@/assets/decorations/boost-graphic.svg";

const stats = [
  { icon: Users2, value: "50+", label: "Happy Clients" },
  { icon: Award, value: "100+", label: "Projects Completed" },
  { icon: Clock, value: "2+", label: "Years Experience" },
  { icon: Globe2, value: "3+", label: "Countries Served" },
];

const achievements = [
  {
    icon: Shield,
    title: "ISO Certified Quality",
    description: "Committed to maintaining the highest standards in software development and service delivery.",
    image: "https://images.unsplash.com/photo-1565689223820-bfc715acbfbe?auto=format&fit=crop&w=800&q=80"
  },
  {
    icon: Award,
    title: "Industry Recognition",
    description: "Recognized for innovation and excellence in digital transformation solutions.",
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80"
  },
  {
    icon: TrendingUp,
    title: "98% Client Satisfaction",
    description: "Consistently delivering solutions that exceed client expectations and drive business growth.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80"
  },
];

const AboutPage = () => {
  return (
    <div className="min-h-[70vh] bg-background">
      <Navigation />
      <main className="pt-5">
        {/* Hero Section with Background Image */}
        <section 
          className="relative min-h-[80vh] flex items-center justify-center px-6 overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.9)), url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        >
          {/* Animated Overlay Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
          <div className="absolute top-20 right-10 w-64 h-64 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-20 left-10 w-64 h-64 bg-accent/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "2s" }} />
          
          <div className="max-w-4xl mx-auto text-center relative z-10 text-white">
            <div className="flex justify-center mb-6">
              <Sparkles className="w-12 h-12 text-white animate-pulse" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold font-space mb-6">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-primary-200">BrightPath</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Transforming businesses through innovative technology and creative digital solutions since 2020.
            </p>
          </div>
        </section>

        {/* Main About Content */}
        <About />

        {/* Marketing Section - Innovation */}
        <MarketingSection
          svgSrc={turtleSvg}
          title="Innovation at"
          highlightedText="Every Step"
          description="We combine cutting-edge technology with creative thinking to deliver solutions that not only meet your current needs but anticipate future challenges."
          buttonText="Explore Our Services"
          buttonLink="/services"
          features={[
            { title: "Forward Thinking", description: "Building solutions for tomorrow's challenges" },
            { title: "Continuous Learning", description: "Always staying ahead of industry trends" },
            { title: "Client Partnership", description: "Growing together with our clients" },
          ]}
        />

        {/* Stats Section */}
        <section className="py-20 px-6 bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="glass-card p-6 text-center group hover:scale-105 transition-all duration-300"
                  >
                    <Icon className="w-10 h-10 text-primary mx-auto mb-3" />
                    <div className="text-3xl font-bold font-space gradient-text mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Achievements Section */}
        <section className="py-20 px-6 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold font-space mb-6">
                Our <span className="gradient-text">Achievements</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Recognition and milestones that showcase our commitment to excellence
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {achievements.map((achievement) => {
                const Icon = achievement.icon;
                return (
                  <div
                    key={achievement.title}
                    className="bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative h-48">
                      <img 
                        src={achievement.image}
                        alt={achievement.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <Icon className="w-8 h-8 text-primary mr-3" />
                        <h3 className="text-xl font-bold font-space">
                          {achievement.title}
                        </h3>
                      </div>
                      <p className="text-muted-foreground">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Marketing Section - Growth */}
        <MarketingSection
          svgSrc={boostGraphic}
          title="Partner for"
          highlightedText="Success"
          description="Join the growing list of businesses that have transformed their digital presence with BrightPath. We're committed to your success every step of the way."
          buttonText="Start Your Journey"
          buttonLink="/contact"
          reversed
          features={[
            { title: "Proven Track Record", description: "100+ successful projects delivered" },
            { title: "Long-term Support", description: "We're here for you beyond launch" },
            { title: "Measurable Results", description: "Data-driven strategies that work" },
          ]}
        />

        {/* Why Choose Us */}
        <section className="py-20 px-6 bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold font-space mb-6">
                Why <span className="gradient-text">Choose Us</span>
              </h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="p-6 rounded-lg border hover:shadow-md transition-all duration-300">
                  <h3 className="text-xl font-bold font-space mb-3 text-primary">Client-Centric Approach</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We prioritize your business goals and work collaboratively to deliver solutions that align with your vision.
                  </p>
                </div>
                <div className="p-6 rounded-lg border hover:shadow-md transition-all duration-300">
                  <h3 className="text-xl font-bold font-space mb-3 text-secondary">Cutting-Edge Technology</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Leveraging the latest technologies and industry best practices to create future-proof solutions.
                  </p>
                </div>
                <div className="p-6 rounded-lg border hover:shadow-md transition-all duration-300">
                  <h3 className="text-xl font-bold font-space mb-3 text-accent">Proven Track Record</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Successfully delivered 100+ projects across various industries with exceptional results.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="rounded-xl overflow-hidden shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80"
                    alt="Team collaboration"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;