import { useState, useEffect } from "react";
import { Menu, X, Scissors, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import ThemeToggle from "./ThemeToggle";
import LanguageSelector from "./LanguageSelector";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
    setMobileMenuOpen(false);
  };
  return <header className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-500", scrolled ? "bg-background/95 backdrop-blur-md py-3 border-b border-border/30" : "bg-transparent py-6")}>
      <nav className="container flex justify-between items-center">
        {/* Left side - Language & Navigation */}
        <div className="flex items-center space-x-8">
          <LanguageSelector />
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('services-section')} className="nav-link flex items-center gap-2">
              <Scissors className="h-4 w-4" />
              Services
            </button>
            <button onClick={() => scrollToSection('testimonials')} className="nav-link">
              Avis
            </button>
          </div>
        </div>

        {/* Center - Logo */}
        <div className="absolute left-1/2 -translate-x-1/2">
          
        </div>

        {/* Right side - Navigation & Theme */}
        <div className="flex items-center space-x-8">
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('features')} className="nav-link">
              Atouts
            </button>
            <button onClick={() => scrollToSection('contact')} className="nav-link flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Contact
            </button>
          </div>
          <ThemeToggle />
          
          {/* Mobile menu button */}
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden">
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={cn("fixed inset-0 z-40 bg-background/98 backdrop-blur-lg md:hidden transition-all duration-500", mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible")}>
        <div className="flex flex-col items-center justify-center h-full space-y-8 pt-20">
          <img src={logo} alt="La Barbe à Papa" className="h-20 invert mb-8" />
          
          <button onClick={() => scrollToSection('services-section')} className="text-2xl font-light uppercase tracking-widest text-foreground hover:text-primary transition-colors">
            Services
          </button>
          <button onClick={() => scrollToSection('testimonials')} className="text-2xl font-light uppercase tracking-widest text-foreground hover:text-primary transition-colors">
            Avis Clients
          </button>
          <button onClick={() => scrollToSection('features')} className="text-2xl font-light uppercase tracking-widest text-foreground hover:text-primary transition-colors">
            Nos Atouts
          </button>
          <button onClick={() => scrollToSection('contact')} className="text-2xl font-light uppercase tracking-widest text-foreground hover:text-primary transition-colors">
            Contact
          </button>
          
          <div className="flex space-x-6 mt-8">
            <a href="https://www.facebook.com/profile.php?id=100082968710739&locale=fr_FR" target="_blank" rel="noopener noreferrer" className="social-link uppercase text-xs tracking-widest">
              Facebook
            </a>
            <a href="https://www.instagram.com/salon_labarbeapapa/" target="_blank" rel="noopener noreferrer" className="social-link uppercase text-xs tracking-widest">
              Instagram
            </a>
          </div>
        </div>
      </div>
    </header>;
}