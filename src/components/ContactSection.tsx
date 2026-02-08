import { Mail } from "lucide-react";

export function ContactSection() {
  return (
    <section id="kontakt" className="section-padding bg-primary text-primary-foreground">
      <div className="container-narrow text-center">
        <h2 className="heading-section mb-6">Kontakt</h2>
        <p className="text-body-large opacity-90 mb-10 max-w-xl mx-auto">
          Ak máte záujem o pobyt, spoluprácu alebo sa len chcete ozvať, napíšte
          nám.
        </p>

        <a
          href="mailto:richardadenisa@gmail.com"
          className="inline-flex items-center gap-3 bg-primary-foreground text-primary px-8 py-4 rounded-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Mail size={20} />
          richardadenisa@gmail.com
        </a>

        <div className="mt-16 pt-12 border-t border-primary-foreground/20">
          <p className="text-sm opacity-70 font-serif text-lg">
            DERISA o.z. & Čarožica
          </p>
          <p className="text-sm opacity-50 mt-2">
            Drahožická dolina, pohorie Tribeč
          </p>
        </div>
      </div>
    </section>
  );
}
