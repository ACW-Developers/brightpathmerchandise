import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import ElectronicVerification from "@/components/ElectronicVerification";
import TechShowcase from "@/components/TechShowcase";
import Testimonials from "@/components/Testimonials";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <Hero />
        <ElectronicVerification />
        <TechShowcase />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
