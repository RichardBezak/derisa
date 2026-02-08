import { Droplets, Sun, Flame, Home } from "lucide-react";
import retreatRoom from "@/assets/retreat-room.jpeg";

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
          {/* Image */}
          <div>
            <img
              src={retreatRoom}
              alt="Meditačná miestnosť v Čarožici - drevená podlaha, tibetské misky a harfa"
              className="w-full rounded-sm shadow-lg"
            />
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
