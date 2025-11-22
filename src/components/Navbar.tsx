
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import ThemeToggle from "./ThemeToggle";
import LanguageSelector from "./LanguageSelector";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Navbar() {
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Navigation links - tous masqués pour le moment
  const navLinks: any[] = [
    // Navigation temporairement masquée - À réactiver quand les pages seront prêtes
    // { name: t.nav.home, path: "/" },
    // { name: t.nav.apartments, path: "/apartments" },
    // { name: t.nav.amenities, path: "/amenities" },
    // { name: t.nav.gallery, path: "/gallery" },
    // { name: t.nav.contact, path: "/contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);
  
  return <header className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-300", scrolled ? "bg-black/90 backdrop-blur-lg py-4 shadow-lg shadow-primary/10" : "bg-black/50 backdrop-blur-sm py-6")}>
      <nav className="container flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="text-2xl md:text-3xl font-bold tracking-tight">
            <span className="text-primary font-serif">LA BARBE À PAPA</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex items-center space-x-8 text-sm uppercase tracking-wider font-medium">
          <li>
            <Link to="/" className="text-foreground hover:text-primary transition-colors border-b-2 border-primary pb-1">
              HOME
            </Link>
          </li>
          <li>
            <button onClick={() => document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' })} className="text-foreground hover:text-primary transition-colors">
              SERVICES
            </button>
          </li>
          <li>
            <button onClick={() => document.getElementById('gallery-section')?.scrollIntoView({ behavior: 'smooth' })} className="text-foreground hover:text-primary transition-colors">
              GALLERY
            </button>
          </li>
          <li>
            <button onClick={() => document.getElementById('testimonials-section')?.scrollIntoView({ behavior: 'smooth' })} className="text-foreground hover:text-primary transition-colors">
              TESTIMONIALS
            </button>
          </li>
          <li>
            <button onClick={() => document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' })} className="text-foreground hover:text-primary transition-colors">
              CONTACT
            </button>
          </li>
          <li>
            <LanguageSelector />
          </li>
          <li>
            <ThemeToggle />
          </li>
          <li>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none px-6 py-2 uppercase text-sm font-bold">
              BOOK NOW
            </Button>
          </li>
        </ul>

        {/* Mobile Navigation */}
        <div className="lg:hidden flex items-center space-x-2">
          <LanguageSelector />
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-foreground">
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={cn("fixed inset-0 z-40 bg-black/90 backdrop-blur-sm lg:hidden transition-opacity duration-300", mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none")}>
        <div className={cn("fixed inset-y-0 right-0 w-3/4 max-w-sm bg-black border-l border-primary/20 shadow-xl p-6 transition-transform duration-300 ease-in-out", mobileMenuOpen ? "translate-x-0" : "translate-x-full")}>
          <div className="flex flex-col h-full">
            <div className="flex justify-between mb-8">
              <Link to="/" className="text-xl font-bold text-primary font-serif" onClick={() => setMobileMenuOpen(false)}>
                LA BARBE À PAPA
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)} className="text-foreground">
                <X className="h-6 w-6" />
              </Button>
            </div>
            
            <ul className="space-y-6 flex-1">
              <li>
                <Link to="/" className="text-lg font-medium text-foreground hover:text-primary transition-colors uppercase" onClick={() => setMobileMenuOpen(false)}>
                  HOME
                </Link>
              </li>
              <li>
                <button 
                  onClick={() => {
                    document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' });
                    setMobileMenuOpen(false);
                  }} 
                  className="text-lg font-medium text-foreground hover:text-primary transition-colors uppercase"
                >
                  SERVICES
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    document.getElementById('gallery-section')?.scrollIntoView({ behavior: 'smooth' });
                    setMobileMenuOpen(false);
                  }} 
                  className="text-lg font-medium text-foreground hover:text-primary transition-colors uppercase"
                >
                  GALLERY
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    document.getElementById('testimonials-section')?.scrollIntoView({ behavior: 'smooth' });
                    setMobileMenuOpen(false);
                  }} 
                  className="text-lg font-medium text-foreground hover:text-primary transition-colors uppercase"
                >
                  TESTIMONIALS
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' });
                    setMobileMenuOpen(false);
                  }} 
                  className="text-lg font-medium text-foreground hover:text-primary transition-colors uppercase"
                >
                  CONTACT
                </button>
              </li>
            </ul>
            
            <Button 
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-none px-6 py-3 uppercase text-sm font-bold mt-6"
              onClick={() => setMobileMenuOpen(false)}
            >
              BOOK NOW
            </Button>
          </div>
        </div>
      </div>
    </header>;
}
