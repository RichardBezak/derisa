import { ChevronDown } from "lucide-react";
import heroImage from "@/assets/drahozica-jesen.jpeg";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Drahožická dolina v jeseni - pohľad na zelené kopce a lesy v pohorí Tribeč"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-foreground/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-wide text-center text-primary-foreground">
        <div className="max-w-4xl mx-auto">
          <h1 className="heading-hero opacity-0 animate-slide-up mb-6">
            DERISA
          </h1>
          <p
            className="text-body-large max-w-2xl mx-auto mb-4 opacity-0 animate-slide-up"
            style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
          >
            Rodinné občianske združenie, ktoré žije a tvorí v Drahožickej
            doline – v krajine, kde sa starostlivosť o ľudí prirodzene spája so
            starostlivosťou o krajinu.
          </p>
          <p
            className="text-base opacity-80 max-w-xl mx-auto opacity-0 animate-slide-up"
            style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
          >
            Tu sme vytvorili našu Čarožicu – energeticky nezávislú usadlosť
            hlboko v pohorí Tribeč.
          </p>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-primary-foreground animate-bounce">
        <ChevronDown size={32} />
      </div>
    </section>
  );
}
