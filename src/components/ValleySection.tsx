import { useState } from "react";
import { Lightbox } from "./Lightbox";
import sunsetPond from "@/assets/sunset-pond.jpeg";
import dolina1 from "@/assets/dolina-1.jpeg";
import dolina2 from "@/assets/dolina-2.jpeg";
import dolina3 from "@/assets/dolina-3.jpeg";
import dolina4 from "@/assets/dolina-4.jpeg";
import dolina5 from "@/assets/dolina-5.jpg";
import dolina6 from "@/assets/dolina-6.jpg";
import dolina7 from "@/assets/dolina-7.jpg";
import dolina8 from "@/assets/dolina-8.jpg";
import dolina9 from "@/assets/dolina-9.jpg";
import dolina10 from "@/assets/dolina-10.jpg";
import dolina11 from "@/assets/dolina-11.jpg";
import dolina12 from "@/assets/dolina-12.jpg";
import dolina13 from "@/assets/dolina-13.jpg";

const galleryImages = [
  { src: sunsetPond, alt: "Jazierko v Drahožickej doline pri západe slnka" },
  { src: dolina1, alt: "Jesenný strom s deťmi na lúke" },
  { src: dolina2, alt: "Slnko presvitajúce cez jesenný strom" },
  { src: dolina3, alt: "Zamrznuté jazierko v zime" },
  { src: dolina4, alt: "Západ slnka nad horami z vyhliadky" },
  { src: dolina5, alt: "Bedle pred domom na jeseň" },
  { src: dolina6, alt: "Zasnežená Čarožica v zime" },
  { src: dolina7, alt: "Dom v mesačnej zimnej noci" },
  { src: dolina8, alt: "Zamrznuté jazierko pred domom" },
  { src: dolina9, alt: "Jarné kvety pri drevenom stole" },
  { src: dolina10, alt: "Kačky na jazierku medzi stromami" },
  { src: dolina11, alt: "Dom odrážajúci sa v jazierku v lete" },
  { src: dolina12, alt: "Slnečný bok domu pri lese" },
  { src: dolina13, alt: "Hviezdna noc nad domom" },
];

export function ValleySection() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  return (
    <section id="dolina" className="section-padding bg-secondary">
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div>
            <div className="accent-line mb-6" />
            <h2 className="heading-section text-foreground mb-6">
              Drahožická dolina
            </h2>
            <div className="space-y-6 text-body text-muted-foreground">
              <p className="text-foreground font-serif text-xl">
                Drahožická dolina je naším domovom.
              </p>
              <p>
                Spolu s jediným susedom z Horárne sa staráme o celý priestor –
                naše sú lúky, jeho je les.
              </p>
              <blockquote className="border-l-2 border-primary pl-6 my-8 italic text-foreground">
                „Od dobrého suseda ploty robiť netreba."
              </blockquote>
              <p>Krajina funguje ako jeden celok.</p>
            </div>

            <div className="mt-10">
              <h3 className="font-serif text-xl text-foreground mb-4">
                Našou snahou je:
              </h3>
              <ul className="space-y-3">
                {[
                  "Udržiavať lúky a vodný režim",
                  "Podporovať biodiverzitu",
                  "Obnovovať prirodzené vzťahy medzi človekom a krajinou",
                ].map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-muted-foreground"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Main image */}
          <div
            className="cursor-pointer overflow-hidden rounded-sm shadow-lg"
            onClick={() => setSelectedImage(0)}
          >
            <img
              src={galleryImages[0].src}
              alt={galleryImages[0].alt}
              className="w-full aspect-[4/3] object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Thumbnail gallery */}
        <div className="mt-12 grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 gap-2 sm:gap-3">
          {galleryImages.slice(1).map((image, index) => (
            <div
              key={index}
              className="cursor-pointer overflow-hidden rounded-sm shadow-md"
              onClick={() => setSelectedImage(index + 1)}
            >
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                className="w-full aspect-square object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </div>

      <Lightbox
        images={galleryImages}
        selectedIndex={selectedImage}
        onClose={() => setSelectedImage(null)}
        onChange={setSelectedImage}
      />
    </section>
  );
}
