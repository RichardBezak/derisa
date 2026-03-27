import { useState, useEffect } from "react";
import { Droplets, Sun, Flame, Home } from "lucide-react";
import { Lightbox } from "./Lightbox";
import carozica1 from "@/assets/carozica-1.jpeg";
import carozica2 from "@/assets/carozica-2.jpeg";
import carozica3 from "@/assets/carozica-3.jpeg";
import carozica4 from "@/assets/carozica-4.jpeg";
import carozica5 from "@/assets/carozica-5.jpeg";
import carozica6 from "@/assets/carozica-6.jpg";
import carozica7 from "@/assets/carozica-7.jpeg";
import carozica8 from "@/assets/carozica-8.jpeg";

const slideshowImages = [
  { src: carozica1, alt: "Usadlosť Čarožica v lete obklopená lesom" },
  { src: carozica2, alt: "Nočný oheň pod mesiacom na Čarožici" },
  { src: carozica3, alt: "Výhľad z terasy na jesenný les a jazierko" },
  { src: carozica4, alt: "Ranné slnko a kvety pred usadlosťou" },
  { src: carozica5, alt: "Nočný pohľad na útulný interiér cez okno" },
  { src: carozica6, alt: "Západ slnka nad jazierkom v zime" },
  { src: carozica7, alt: "Zimné jazierko so slnkom cez stromy" },
  { src: carozica8, alt: "Lekná na jazierku" },
];

const features = [
  {
    icon: Droplets,
    title: "Voda zo studne",
    description: "Vlastný zdroj čistej vody",
  },
  {
    icon: Sun,
    title: "Solárna energia",
    description: "Elektrinu vyrábame zo slnka",
  },
  {
    icon: Flame,
    title: "Kúrenie drevom",
    description: "Prírodné teplo z miestnych zdrojov",
  },
  {
    icon: Home,
    title: "Ekologický odpad",
    description: "Čistička, plánujeme koreňovú",
  },
];

export function CarozicaSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slideshowImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="carozica" className="section-padding bg-secondary">
      <div className="container-wide">
        <div className="text-center mb-16">
          <div className="accent-line mx-auto mb-6" />
          <h2 className="heading-section text-foreground mb-6">Čarožica</h2>
          <p className="text-body-large text-muted-foreground max-w-3xl mx-auto">
            Energeticky nezávislá rodinná usadlosť uprostred Drahožickej doliny,
            hlboko v pohorí Tribeč. Približne 7 km od najbližšej civilizácie, v
            srdci Veľkej zvernice Topoľčianky – najväčšej zvernice v strednej
            Európe.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Slideshow */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm shadow-lg">
            {slideshowImages.map((image, index) => (
              <img
                key={index}
                src={image.src}
                alt={image.alt}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  index === currentIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-background rounded-sm text-center"
              >
                <feature.icon className="w-8 h-8 text-primary mx-auto mb-4" />
                <h4 className="font-serif text-lg text-foreground mb-2">
                  {feature.title}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Nature */}
        <div className="bg-background p-8 md:p-12 rounded-sm">
          <p className="text-body text-muted-foreground text-center max-w-3xl mx-auto">
            Žijeme tu v bezprostrednom kontakte s prírodou – jelene, srny,
            daniele, muflóny, zajace, ale aj líšky, jazvece a občas medvede sú
            prirodzenou súčasťou tohto priestoru.
          </p>
        </div>
      </div>
    </section>
  );
}
