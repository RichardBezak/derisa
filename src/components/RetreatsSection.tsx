import { useState, useEffect } from "react";
import { Heart, Users, BookOpen, Leaf } from "lucide-react";
import pobyty1 from "@/assets/pobyty-1.jpeg";
import pobyty2 from "@/assets/pobyty-2.jpeg";
import pobyty3 from "@/assets/pobyty-3.jpeg";
import pobyty4 from "@/assets/pobyty-4.jpg";
import pobyty5 from "@/assets/pobyty-5.jpg";
import pobyty6 from "@/assets/pobyty-6.jpg";
import pobyty7 from "@/assets/pobyty-7.jpg";
import pobyty8 from "@/assets/pobyty-8.jpeg";
import pobyty9 from "@/assets/pobyty-9.jpeg";
import pobyty10 from "@/assets/pobyty-10.jpeg";
import pobyty11 from "@/assets/pobyty-11.jpeg";
import pobyty12 from "@/assets/pobyty-12.jpeg";
import pobyty13 from "@/assets/pobyty-13.jpeg";
import pobyty14 from "@/assets/pobyty-14.jpeg";

const slideshowImages = [
  { src: pobyty1, alt: "Soška bohyne Zeme so sviečkou v interiéri" },
  { src: pobyty2, alt: "Ohňové miesto pred usadlosťou" },
  { src: pobyty3, alt: "Čítací kútik s kreslom a knižnicou" },
  { src: pobyty4, alt: "Útulná kuchyňa s výhľadom do lesa" },
  { src: pobyty5, alt: "Izba s kreslom a posteľou" },
  { src: pobyty6, alt: "Útulná izba s dreveným stropom" },
  { src: pobyty7, alt: "Obývačka s krbom a hudobnými nástrojmi" },
  { src: pobyty8, alt: "Keramická soška s červenou sviečkou" },
  { src: pobyty9, alt: "Kvety v džbáne so sviečkou na stole" },
  { src: pobyty10, alt: "Meditačná sála s vianočným kruhovým oltárom" },
  { src: pobyty11, alt: "Podkrovná sála s matracmi na spanie" },
  { src: pobyty12, alt: "Podkrovná sála s gobelínom stromu" },
  { src: pobyty13, alt: "Podkrovná sála s hojdacou sieťou" },
  { src: pobyty14, alt: "Šálka čaju s kvetmi a soškou bohyne" },
];

const retreatTypes = [
  {
    icon: Heart,
    title: "Liečivé a tiché pobyty",
    description: "Priestor pre ticho, sebareflexiu a vnútorné liečenie",
  },
  {
    icon: Users,
    title: "Rodinné víkendy",
    description: "Čas pre rodinu v lone prírody, bez rozptýlení",
  },
  {
    icon: BookOpen,
    title: "Vzdelávacie stretnutia",
    description: "Workshopy a kurzy v duchu rešpektu k prírode",
  },
  {
    icon: Leaf,
    title: "Malé retreaty",
    description: "Programy vznikajú organicky – podľa ľudí a ročného obdobia",
  },
];

export function RetreatsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slideshowImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="pobyty" className="section-padding bg-background">
      <div className="container-wide">
        <div className="text-center mb-16">
          <div className="accent-line mx-auto mb-6" />
          <h2 className="heading-section text-foreground mb-6">
            Pobytové akcie
          </h2>
          <p className="text-body text-muted-foreground max-w-2xl mx-auto">
            Na Čarožici sa konajú rôzne pobyty a stretnutia. Programy vznikajú
            organicky – podľa ľudí, ročného obdobia a potrieb krajiny.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Slideshow - left */}
          <div className="relative aspect-[3/4] max-h-[500px] overflow-hidden rounded-sm shadow-lg mx-auto w-full">
            {slideshowImages.map((image, index) => (
              <img
                key={index}
                src={image.src}
                alt={image.alt}
                className={`absolute inset-0 w-full h-full object-contain bg-muted transition-opacity duration-1000 ${
                  index === currentIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </div>

          {/* Retreat types - right */}
          <div className="space-y-6">
            {retreatTypes.map((retreat, index) => (
              <div
                key={index}
                className="group flex items-start gap-5 p-6 bg-card rounded-sm border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
              >
                <retreat.icon className="w-8 h-8 text-primary shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                <div>
                  <h3 className="font-serif text-xl text-foreground mb-2">
                    {retreat.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {retreat.description}
                  </p>
                </div>
              </div>
            ))}
            <p className="text-body text-muted-foreground italic pt-4">
              Aktuálne pripravované akcie budeme postupne pridávať.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
