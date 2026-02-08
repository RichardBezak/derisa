import foundersImage from "@/assets/richard-denisa.jpg";

export function AboutSection() {
  return (
    <section id="o-nas" className="section-padding bg-background">
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div className="order-2 lg:order-1">
            <div className="relative">
              <img
                src={foundersImage}
                alt="Richard a Denisa - zakladatelia DERISA o.z."
                className="w-full max-w-md mx-auto lg:mx-0 rounded-sm shadow-lg grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <div className="accent-line mb-6" />
            <h2 className="heading-section text-foreground mb-6">O nás</h2>
            <div className="space-y-6 text-body text-muted-foreground">
              <p>
                Občianske združenie DERISA sme založili v roku 2021 ako dospelá
                časť našej rodiny –{" "}
                <span className="text-foreground font-medium">DE</span>nisa,{" "}
                <span className="text-foreground font-medium">RI</span>chard a{" "}
                <span className="text-foreground font-medium">SA</span>lome.
                Spolu máme ale tri deti.
              </p>
              <p>
                Najstaršia dcéra Salome študuje cirkusové umenie na vysokej
                škole CRAC v Lille vo Francúzsku. Naše dve mladšie deti, Stella
                a Saskia, navštevujú montessori vzdelávaciu skupinu pre
                domškolákov Pohoďáci.
              </p>
              <p>
                DERISA vznikla prirodzene – nie ako projekt, ale ako forma,
                ktorá nám umožňuje robiť to, čo už roky žijeme.
              </p>
            </div>
          </div>
        </div>

        {/* Activities */}
        <div className="mt-20 pt-12 border-t border-border">
          <h3 className="heading-subsection text-foreground mb-8 text-center">
            Čomu sa venujeme
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Rozvoj osobnosti, tradícií, kultúry a športu",
              "Podpora zdravého životného štýlu",
              "Environmentálna osveta a ochrana prírody",
              "Podpora prírode blízkeho hospodárenia",
              "Opatrenia na zadržiavanie vody",
              "Ochrana biodiverzity v Drahožickej doline",
            ].map((activity, index) => (
              <div
                key={index}
                className="p-6 bg-card rounded-sm border border-border hover:border-primary/30 transition-colors"
              >
                <p className="text-foreground">{activity}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
