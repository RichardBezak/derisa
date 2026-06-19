import fondImage from "@/assets/stabilizacny-fond.jpg";
import euronLogo from "@/assets/euron-logo.png.asset.json";

export function StabilizacnyFondSection() {
  return (
    <section id="fond" className="section-padding bg-background">
      <div className="container-wide">
        <div className="text-center mb-16">
          <h2 className="heading-section text-foreground mb-4">Stabilizačný fond</h2>
          <div className="accent-line mx-auto mb-6" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <div className="order-2 lg:order-1">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img
                src={fondImage}
                alt="Stabilizačný fond - euro"
                loading="lazy"
                width={1280}
                height={720}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Text */}
          <div className="order-1 lg:order-2 space-y-5">
            <p className="text-body text-muted-foreground italic font-serif text-lg">
              Naša činnosť je postavená na dôvere, zodpovednosti a dlhodobej udržateľnosti.
            </p>

            <p className="text-body text-muted-foreground">
              Naše aktivity financujeme kombináciou darov, vlastných príjmov a projektových zdrojov, vrátane grantov a podpory partnerov. Každý zdroj využívame s dôrazom na transparentnosť a zmysluplný dopad.
            </p>

            <p className="text-body text-muted-foreground">
              S cieľom zabezpečiť kontinuitu našich aktivít aj v prípade nepredvídateľných situácií postupne budujeme v rámci programu finančnej odolnosti <strong className="text-foreground">Stabilizačný fond</strong>. Tento fond predstavuje rezervu, ktorá nám umožňuje zachovať fungovanie projektov, starostlivosť o zverené územie aj podporu ľudí, ktorým sa venujeme, bez ohľadu na vonkajšie okolnosti.
            </p>

            <p className="text-body text-muted-foreground">
              Veríme, že zodpovedné hospodárenie a tvorba rezerv sú prirodzenou súčasťou organizácií, ktoré myslia dlhodobo.
            </p>

            <p className="text-body text-muted-foreground">
              Tento prístup nám umožňuje rozhodovať sa slobodne a nezávisle, v súlade s našimi hodnotami.
            </p>

            <div className="pt-4 border-t border-border">
              <p className="text-body text-muted-foreground mb-3">
                Ak vás naša činnosť oslovuje a chcete ju podporiť, môžete tak urobiť darom:
              </p>
              <p className="font-mono text-lg text-foreground font-medium tracking-wide bg-secondary/50 rounded-md px-4 py-3 inline-block">
                IBAN: SK86 0900 0000 0051 8464 0792
              </p>
              <p className="text-body text-muted-foreground mt-4 italic font-serif">
                Ďakujeme, že ste súčasťou toho, čo tvoríme.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
