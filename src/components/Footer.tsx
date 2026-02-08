export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background py-8">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-serif text-lg">DERISA o.z.</p>
          <p className="text-sm opacity-60">
            © {currentYear} DERISA o.z. Všetky práva vyhradené.
          </p>
        </div>
      </div>
    </footer>
  );
}
