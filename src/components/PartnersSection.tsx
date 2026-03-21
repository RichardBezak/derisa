import partnerEuronlab from "@/assets/partner-euronlab.png";
import partnerEsi from "@/assets/partner-esi.png";
import partnerSklenenka from "@/assets/partner-sklenenka.png";

const partners = [
  {
    name: "EuronLab",
    logo: partnerEuronlab,
    url: "https://euronlab.lovable.app/",
    description:
      "Nezávislé analytické a poradenské štúdio z Estónska. EuronLab nás podporuje finančne aj odborne – pomáha nám riešiť komplexné výzvy a prináša know-how v oblasti stratégie, udržateľnosti a systémového myslenia.",
  },
  {
    name: "ESI",
    logo: partnerEsi,
    url: "https://esi.live/o-nas/",
    description:
      "Občianske združenie zamerané na zvyšovanie kvality života a udržateľný rozvoj. Spoločne realizujeme projekt „Živá krajina – aktívny človek" – program komunitnej regenerácie prepájajúci environmentálne opatrenia, vzdelávanie a komunitný život.",
  },
  {
    name: "Skleněnka, z.s.",
    logo: partnerSklenenka,
    url: "http://duhovasklenenka.cz/",
    description:
      "České združenie pracujúce s pestúnskymi rodinami. V rámci programu Erasmus+ si vymieňame skúsenosti v oblasti rešpektujúceho prístupu a facilitácie pri práci s dospelými.",
  },
];

export function PartnersSection() {
  return (
    <section id="partneri" className="section-padding bg-secondary/30">
      <div className="container-wide">
        <div className="text-center mb-16">
          <h2 className="heading-section text-foreground mb-4">Partneri</h2>
          <div className="accent-line mx-auto mb-6" />
          <p className="text-body text-muted-foreground max-w-2xl mx-auto">
            Veríme v sieťovanie a spoluprácu. Títo partneri s nami zdieľajú
            hodnoty a spoločne vytvárame projekty s reálnym dopadom.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {partners.map((partner) => (
            <a
              key={partner.name}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-background rounded-lg p-8 flex flex-col items-center text-center transition-shadow hover:shadow-lg border border-border/50"
            >
              <div className="h-20 flex items-center justify-center mb-6">
                <img
                  src={partner.logo}
                  alt={`Logo ${partner.name}`}
                  className="max-h-20 max-w-[180px] w-auto object-contain"
                />
              </div>
              <h3 className="heading-subsection text-foreground mb-3 group-hover:text-accent transition-colors text-xl md:text-2xl">
                {partner.name}
              </h3>
              <p className="text-body text-muted-foreground text-sm leading-relaxed">
                {partner.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
