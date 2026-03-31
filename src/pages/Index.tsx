import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { CarozicaSection } from "@/components/CarozicaSection";
import { RetreatsSection } from "@/components/RetreatsSection";
import { ValleySection } from "@/components/ValleySection";
import { PartnersSection } from "@/components/PartnersSection";
import { StabilizacnyFondSection } from "@/components/StabilizacnyFondSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HeroSection />
        <AboutSection />
        <CarozicaSection />
        <RetreatsSection />
        <ValleySection />
        <PartnersSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
