import partnerEuronlab from "@/assets/partner-euronlab.png";
import partnerEsi from "@/assets/partner-esi.png";
import partnerSklenenka from "@/assets/partner-sklenenka.png";
import partnerPohodaci from "@/assets/partner-pohodaci.png";
import partnerEcceHomo from "@/assets/partner-eccehomo.png";
import partnerTsok from "@/assets/partner-tsok.png";

const partners = [
  {
    name: "EuronLab",
    logo: partnerEuronlab,
    logoClass: "max-h-20 max-w-[220px] w-auto object-contain scale-150",
    url: "https://www.euronlab.eu",
    description:
      "Nezávislé analytické a poradenské štúdio z Estónska. EuronLab nás podporuje finančne aj odborne – pomáha nám riešiť komplexné výzvy a prináša know-how v oblasti stratégie, udržateľnosti a systémového myslenia.",
  },
  {
    name: "ESI",
    logo: partnerEsi,
    logoClass: "max-h-20 max-w-[180px] w-auto object-contain",
    url: "https://esi.live/o-nas/",
    description:
      "Občianske združenie zamerané na zvyšovanie kvality života a udržateľný rozvoj. Spoločne realizujeme projekt Živá krajina – aktívny človek – program komunitnej regenerácie prepájajúci environmentálne opatrenia, vzdelávanie a komunitný život.",
  },
  {
    name: "Skleněnka, z.s.",
    logo: partnerSklenenka,
    logoClass: "max-h-20 max-w-[180px] w-auto object-contain",
    url: "http://duhovasklenenka.cz/",
    description:
      "České združenie pracujúce s pestúnskymi rodinami. V rámci programu Erasmus+ si vymieňame skúsenosti v oblasti rešpektujúceho prístupu a facilitácie pri práci s dospelými.",
  },
  {
    name: "Pohoďáci",
    logo: partnerPohodaci,
    logoClass: "max-h-20 max-w-[180px] w-auto object-contain",
    url: "https://www.pohodaci.sk",
    description:
      "Montessori vzdelávacia skupina pre deti v školskom a predškolskom veku. Spolupracujeme v oblasti alternatívneho vzdelávania – prepájame deti s prírodou, pestovaním a reálnym životom na Čarožici.",
  },
  {
    name: "ECCE HOMO",
    logo: partnerEcceHomo,
    logoClass: "max-h-20 max-w-[180px] w-auto object-contain",
    url: "http://eccehomo.sk",
    description:
      "Nezisková organizácia venujúca sa dôstojnosti ľudského života a službe spoločnosti. Spája nás hlboký rešpekt voči človeku a presvedčenie, že empatia, solidarita a starostlivosť o zraniteľných dokážu meniť svet k lepšiemu.",
  },
  {
    name: "TSOK",
    logo: partnerTsok,
    logoClass: "max-h-20 max-w-[200px] w-auto object-contain",
    url: "http://t-sok.sk/",
    description:
      "Thajsko-slovenská obchodná komora, ktorá od roku 2008 buduje most medzi Slovenskom a Thajskom. Podporuje obchodné partnerstvá, kultúrnu výmenu a vzájomné porozumenie oboch krajín.",
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 lg:gap-12">
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
                  className={partner.logoClass}
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
