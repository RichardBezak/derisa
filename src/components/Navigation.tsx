import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { DerisaLogo } from "./DerisaLogo";

const navItems = [
  { href: "#o-nas", label: "O nás" },
  { href: "#carozica", label: "Čarožica" },
  { href: "#pobyty", label: "Pobyty" },
  { href: "#dolina", label: "Dolina" },
  { href: "#kontakt", label: "Kontakt" },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-sm shadow-sm py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container-wide flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center">
          <DerisaLogo
            className={`transition-all ${
              isScrolled ? "h-8 md:h-10" : "h-10 md:h-12"
            }`}
            color={isScrolled ? "hsl(25, 45%, 55%)" : "white"}
          />
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`text-sm tracking-wide transition-colors hover:opacity-70 ${
                isScrolled ? "text-foreground" : "text-primary-foreground"
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`md:hidden p-2 ${
            isScrolled ? "text-foreground" : "text-primary-foreground"
          }`}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border">
          <div className="container-wide py-6 flex flex-col gap-4">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="text-foreground text-lg font-serif"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
