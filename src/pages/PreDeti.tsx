import { useEffect } from "react";
import { Gamepad2, Heart, ShieldCheck, Sparkles } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

const PreDeti = () => {
  useEffect(() => {
    document.title = "Pre deti | DERISA o.z.";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <Navigation solid />
      <main>
        <section className="pt-36 md:pt-44 pb-16 md:pb-24 bg-secondary/40">
          <div className="container-narrow text-center">
            <p className="text-sm tracking-[0.25em] uppercase text-accent mb-4">Pre deti</p>
            <h1 className="heading-hero text-foreground mb-8">
              Digitálny svet patrí aj deťom. Ukážme im ho bezpečne.
            </h1>
            <div className="accent-line mx-auto mb-8" />
            <div className="space-y-5 text-body text-muted-foreground max-w-2xl mx-auto">
              <p>
                Digitálnym technológiám sa naše deti v budúcnosti nevyhnú. Nemusíme ich však
                nechať objavovať tento svet bez nás.
              </p>
              <p>
                Chceme deťom ukázať, že počítač, tablet či umelá inteligencia nemusia byť iba
                miestom na pasívne sledovanie obsahu. Môžu byť nástrojom na hranie, objavovanie,
                tvorenie a učenie.
              </p>
            </div>
            <p className="mt-8 text-body-large text-foreground font-normal max-w-2xl mx-auto">
              Bez reklám. Bez sociálnych sietí. Bez potreby vytvárať si účet. A hlavne – s
              rodičom stále pri kormidle.
            </p>
            <p className="mt-6 text-body text-muted-foreground">
              Na DERISE preto ponúkame dve malé cesty do digitálneho sveta.
            </p>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-wide grid gap-8 md:grid-cols-2">
            <article className="bg-card border border-border rounded-lg p-8 md:p-10 flex flex-col">
              <Heart className="text-accent mb-6" size={32} strokeWidth={1.5} />
              <h2 className="heading-section mb-2">MUMO</h2>
              <p className="font-serif text-xl italic text-primary mb-6">
                Bezpečné prvé dobrodružstvo v digitálnom svete
              </p>
              <div className="space-y-4 text-body text-muted-foreground flex-1">
                <p>
                  MUMO je virtuálny medvedík, o ktorého sa dieťa stará, hrá sa s ním a objavuje
                  jeho svet.
                </p>
                <p>
                  Je vytvorený ako jednoduché a bezpečné prostredie pre prvé samostatné digitálne
                  skúsenosti dieťaťa.
                </p>
              </div>
              <a
                href="/pre-deti/mumo/"
                className="mt-8 self-start inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 rounded-sm font-medium hover:opacity-90 transition-opacity"
              >
                <Sparkles size={18} /> Spustiť MUMO
              </a>
            </article>

            <article className="bg-card border border-border rounded-lg p-8 md:p-10 flex flex-col">
              <Gamepad2 className="text-accent mb-6" size={32} strokeWidth={1.5} />
              <h2 className="heading-section mb-2">Ježkove dobrodružstvá</h2>
              <p className="font-serif text-xl italic text-primary mb-6">Od hrania k tvoreniu</p>
              <div className="space-y-4 text-body text-muted-foreground flex-1">
                <p>Deti nemusia digitálny svet iba používať. Môžu ho aj vytvárať.</p>
                <p>
                  Ježkove dobrodružstvá vytvorila naša najmladšia dcéra{" "}
                  <strong className="font-medium text-foreground">Saskia ako 7-ročná</strong> s
                  pomocou umelej inteligencie a nástroja Lovable.
                </p>
                <p>
                  Je to jednoduchá hra, ale pre nás je dôležitá práve tým, čo ukazuje: aj malé
                  dieťa môže pochopiť, že počítač nie je iba obrazovka, ktorá mu niečo ponúka.
                  Môže mu povedať, čo chce vytvoriť, skúšať, meniť svoje nápady a sledovať, ako
                  postupne vzniká jeho vlastné digitálne dielo.
                </p>
              </div>
              <a
                href="/pre-deti/jezko/"
                className="mt-8 self-start inline-flex items-center gap-2 bg-accent text-accent-foreground px-7 py-3.5 rounded-sm font-medium hover:opacity-90 transition-opacity"
              >
                <Sparkles size={18} /> Zahrať si Ježkove dobrodružstvá
              </a>
            </article>
          </div>
        </section>

        <section className="section-padding bg-secondary/40">
          <div className="container-narrow text-center">
            <ShieldCheck className="mx-auto text-primary mb-6" size={36} strokeWidth={1.5} />
            <h2 className="heading-section mb-8">Majte digitálny svet svojich detí pod kontrolou</h2>
            <div className="space-y-5 text-body text-muted-foreground max-w-2xl mx-auto">
              <p>Nejde nám o to dostať deti k obrazovkám čo najskôr.</p>
              <p>
                Ide nám o to, aby keď sa s digitálnym svetom stretnú, stretli sa s ním bezpečne,
                tvorivo a spolu s dospelými.
              </p>
              <p className="text-foreground font-normal">
                Technológie tu budú. Naučme deti, že ich môžu používať – a nie iba nechať
                technológie používať ich.
              </p>
            </div>
          </div>
        </section>

        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default PreDeti;
