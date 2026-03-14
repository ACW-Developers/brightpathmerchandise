import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import ElectronicVerification from "@/components/ElectronicVerification";
import TechShowcase from "@/components/TechShowcase";
import Testimonials from "@/components/Testimonials";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import PageLoadingScreen from "@/components/PageLoadingScreen";

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>{loading && <PageLoadingScreen label="Home" />}</AnimatePresence>
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
    </>
  );
};

export default Home;
