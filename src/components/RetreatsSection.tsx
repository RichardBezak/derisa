import { Heart, Users, BookOpen, Leaf } from "lucide-react";

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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {retreatTypes.map((retreat, index) => (
            <div
              key={index}
              className="group p-8 bg-card rounded-sm border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
            >
              <retreat.icon className="w-10 h-10 text-primary mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="font-serif text-xl text-foreground mb-3">
                {retreat.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {retreat.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-body text-muted-foreground italic">
            Aktuálne pripravované akcie budeme postupne pridávať.
          </p>
        </div>
      </div>
    </section>
  );
}
