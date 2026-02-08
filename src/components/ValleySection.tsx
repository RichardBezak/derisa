import sunsetPond from "@/assets/sunset-pond.jpeg";

export function ValleySection() {
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

          {/* Image */}
          <div>
            <img
              src={sunsetPond}
              alt="Jazierko v Drahožickej doline pri západe slnka"
              className="w-full rounded-sm shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
