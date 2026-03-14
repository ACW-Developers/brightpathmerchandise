import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import ElectronicVerification from "@/components/ElectronicVerification";
import TechShowcase from "@/components/TechShowcase";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import Team from "@/components/Team";
import Testimonials from "@/components/Testimonials";
import About from "@/components/About";
import Footer from "@/components/Footer";
import PageLoadingScreen from "@/components/PageLoadingScreen";

const Index = () => {
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
          <div id="home">
            <Hero />
          </div>
          <ElectronicVerification />
          <TechShowcase />
          <div id="about">
            <About />
          </div>
          <div id="services">
            <Services />
          </div>
          <div id="projects">
            <Projects />
          </div>
          <div id="team">
            <Team />
          </div>
          <div id="testimonials">
            <Testimonials />
          </div>
        </main>
        <div id="contact">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Index;
