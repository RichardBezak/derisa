import { ChevronDown } from "lucide-react";
import heroImage from "@/assets/drahozica-jesen.jpeg";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-end">
      {/* Background Image - full wide-angle, no crop */}
      <div className="absolute inset-0 bg-foreground">
        <img
          src={heroImage}
          alt="Drahožická dolina v jeseni - pohľad na zelené kopce a lesy v pohorí Tribeč"
          className="w-full h-full object-cover object-center"
          style={{ imageRendering: "auto" }}
        />
        {/* Subtle gradient only at bottom-left for text readability */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, hsl(30 10% 10% / 0.55) 0%, hsl(30 10% 10% / 0.25) 50%, transparent 75%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, hsl(30 10% 10% / 0.4) 0%, transparent 40%)",
          }}
        />
      </div>

      {/* Content – positioned bottom-left in the "empty" space */}
      <div className="relative z-10 container-wide pb-24 pt-40">
        <div className="max-w-xl">
          <h1 className="heading-hero text-primary-foreground opacity-0 animate-slide-up mb-5">
            DERISA
          </h1>
          <p
            className="text-body-large text-primary-foreground/90 mb-3 opacity-0 animate-slide-up"
            style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
          >
            Rodinné občianske združenie, ktoré žije a tvorí v Drahožickej
            doline – v krajine, kde sa starostlivosť o ľudí prirodzene spája so
            starostlivosťou o krajinu.
          </p>
          <p
            className="text-base text-primary-foreground/70 max-w-md opacity-0 animate-slide-up"
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
