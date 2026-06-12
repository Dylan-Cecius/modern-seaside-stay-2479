import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const links = [
    { id: "services-section", label: "Services" },
    { id: "galerie", label: "Galerie" },
    { id: "testimonials", label: "Avis" },
    { id: "features", label: "Atouts" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 backdrop-blur-lg border-b",
        scrolled ? "bg-background/80" : "bg-background/60"
      )}
      style={{ borderColor: "hsl(var(--primary) / 0.25)" }}
    >
      <div className="container flex items-center justify-between h-[72px]">
        <button onClick={() => scrollTo("hero-top")} aria-label="Accueil" className="text-foreground serif text-lg tracking-wide">
          La Barbe à Papa
        </button>

        <nav className="hidden md:flex items-center gap-9">
          {links.map((l) => (
            <button key={l.id} onClick={() => scrollTo(l.id)} className="nav-link">
              {l.label}
            </button>
          ))}
        </nav>

        <button
          onClick={() => scrollTo("contact")}
          className="hidden md:inline-flex border border-primary text-primary px-5 py-2.5 text-[0.72rem] uppercase transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
          style={{ letterSpacing: "0.22em" }}
        >
          Sans rendez-vous
        </button>

        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menu"
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-background/98 backdrop-blur-lg md:hidden transition-all duration-500",
          mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-8 pt-20">
          <img src={logo} alt="La Barbe à Papa" className="h-16 invert mb-6" />
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              className="text-xl uppercase tracking-[0.25em] text-foreground hover:text-primary transition-colors"
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
