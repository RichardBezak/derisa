import { useState } from "react";
import { Lightbox } from "./Lightbox";
import sunsetPond from "@/assets/sunset-pond.jpeg";
import dolina1 from "@/assets/dolina-1.jpeg";
import dolina2 from "@/assets/dolina-2.jpeg";
import dolina3 from "@/assets/dolina-3.jpeg";
import dolina4 from "@/assets/dolina-4.jpeg";

const galleryImages = [
  { src: sunsetPond, alt: "Jazierko v Drahožickej doline pri západe slnka" },
  { src: dolina1, alt: "Jesenný strom s deťmi na lúke" },
  { src: dolina2, alt: "Slnko presvitajúce cez jesenný strom" },
  { src: dolina3, alt: "Zamrznuté jazierko v zime" },
  { src: dolina4, alt: "Západ slnka nad horami z vyhliadky" },
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

          {/* Gallery */}
          <div className="grid grid-cols-2 gap-3">
            {/* First large image */}
            <div
              className="col-span-2 cursor-pointer overflow-hidden rounded-sm shadow-lg"
              onClick={() => setSelectedImage(0)}
            >
              <img
                src={galleryImages[0].src}
                alt={galleryImages[0].alt}
                className="w-full aspect-[16/9] object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            {/* Remaining images in grid */}
            {galleryImages.slice(1).map((image, index) => (
              <div
                key={index}
                className="cursor-pointer overflow-hidden rounded-sm shadow-md"
                onClick={() => setSelectedImage(index + 1)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full aspect-square object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-white/80 hover:text-white text-4xl font-light"
            onClick={() => setSelectedImage(null)}
          >
            ×
          </button>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white text-4xl px-3"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage((selectedImage - 1 + galleryImages.length) % galleryImages.length);
            }}
          >
            ‹
          </button>
          <img
            src={galleryImages[selectedImage].src}
            alt={galleryImages[selectedImage].alt}
            className="max-h-[85vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white text-4xl px-3"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage((selectedImage + 1) % galleryImages.length);
            }}
          >
            ›
          </button>
        </div>
      )}
    </section>
  );
}
