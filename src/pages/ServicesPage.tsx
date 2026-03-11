import Navigation from "@/components/Navigation";
import Services from "@/components/Services";
import Footer from "@/components/Footer";
import MarketingSection from "@/components/MarketingSection";
import { CheckCircle2, Zap, Shield, Headphones } from "lucide-react";
import boostGraphic from "@/assets/decorations/boost-graphic.svg";
import preferenceGraphic from "@/assets/decorations/preference-graphic.svg";

const benefits = [
  {
    icon: Zap,
    title: "Fast Turnaround",
    description: "Quick delivery without compromising quality, keeping your projects on schedule."
  },
  {
    icon: CheckCircle2,
    title: "Quality Assured",
    description: "Rigorous testing and quality control processes ensure flawless results."
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Enterprise-grade security measures to protect your data and systems."
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Round-the-clock technical support to keep your business running smoothly."
  },
];

const process = [
  {
    step: "01",
    title: "Discovery & Planning",
    description: "Understanding your requirements, goals, and target audience to create a strategic plan."
  },
  {
    step: "02",
    title: "Design & Development",
    description: "Creating intuitive designs and robust development following industry best practices."
  },
  {
    step: "03",
    title: "Testing & Quality Assurance",
    description: "Comprehensive testing to ensure functionality, performance, and security."
  },
  {
    step: "04",
    title: "Deployment & Support",
    description: "Smooth deployment and ongoing support to ensure continued success."
  },
];

const ServicesPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">

        {/* Main Services Section */}
        <Services />

        {/* Marketing Section - Boost Your Business */}
        <MarketingSection
          svgSrc={boostGraphic}
          title="Boost Your Business"
          highlightedText="Growth"
          description="Our comprehensive digital solutions are designed to accelerate your business growth. From custom software to digital marketing, we provide end-to-end services that drive results."
          buttonText="Get Started"
          buttonLink="/contact"
          features={[
            { title: "Custom Solutions", description: "Tailored specifically to your business needs" },
            { title: "Scalable Architecture", description: "Built to grow with your business" },
            { title: "Expert Team", description: "Experienced professionals at your service" },
          ]}
        />

        {/* Process Section */}
        <section className="py-24 px-6 relative about-bg">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold font-space mb-6 animate-text-glow">
                Our <span className="gradient-text animate-gradient-shift">Process</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                A proven methodology that ensures successful project delivery every time
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {process.map((item, index) => (
                <div
                  key={item.step}
                  className="glass-card p-6 relative group hover:scale-105 transition-all duration-500"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className="text-6xl font-bold font-space gradient-text opacity-20 absolute top-4 right-4">
                    {item.step}
                  </div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4 group-hover:animate-bounce-subtle">
                      <span className="text-primary font-bold text-lg">{item.step}</span>
                    </div>
                    <h3 className="text-xl font-bold font-space mb-3 cyber-glow">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={benefit.title}
                    className="glass-card p-6 text-center group hover:scale-105 transition-all duration-300"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/30 to-secondary/20 flex items-center justify-center mx-auto mb-4 group-hover:animate-pulse-glow">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold font-space mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Marketing Section - Your Preference */}
        <MarketingSection
          svgSrc={preferenceGraphic}
          title="Your Vision,"
          highlightedText="Our Priority"
          description="We believe in building solutions that truly reflect your unique business identity. Our collaborative approach ensures every project is aligned with your goals and preferences."
          buttonText="Discuss Your Project"
          buttonLink="/contact"
          reversed
          features={[
            { title: "Personalized Approach", description: "Solutions crafted around your specific needs" },
            { title: "Transparent Process", description: "Stay informed at every stage of development" },
            { title: "Ongoing Support", description: "We're here for you even after launch" },
          ]}
        />
      </main>
      <Footer />
    </div>
  );
};

export default ServicesPage;
