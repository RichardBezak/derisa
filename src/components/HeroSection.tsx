import { ChevronDown } from "lucide-react";
import heroImage from "@/assets/dolina-jar.jpeg";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-start justify-end">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Drahožická dolina na jar - kvitnúca čerešňa a zelené kopce v pohorí Tribeč"
          className="w-full h-full object-cover object-bottom"
        />
        {/* Subtle gradient top-right for text readability */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom left, hsl(210 50% 15% / 0.35) 0%, transparent 50%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, hsl(210 50% 15% / 0.2) 0%, transparent 30%)",
          }}
        />
      </div>

      {/* Content – top-right, aligned with nav "Kontakt" */}
      <div className="relative z-10 container-wide pt-32 md:pt-40 flex justify-end">
        <div className="max-w-md text-right">
          <p
            className="text-body-large text-primary-foreground mb-3 opacity-0 animate-slide-up"
            style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
          >
            Rodinné občianske združenie, ktoré žije a tvorí v Drahožickej
            doline – v krajine, kde sa starostlivosť o ľudí prirodzene spája so
            starostlivosťou o krajinu.
          </p>
          <p
            className="text-base text-primary-foreground/80 max-w-md ml-auto opacity-0 animate-slide-up"
            style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
          >
            Tu sme vytvorili našu Čarožicu – energeticky nezávislú usadlosť
            hlboko v pohorí Tribeč.
          </p>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-primary-foreground/80 animate-bounce">
        <ChevronDown size={32} />
      </div>
    </section>
  );
}
