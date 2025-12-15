import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import logo from "@/assets/logo.png";
export default function HeroSection() {
  const {
    t
  } = useLanguage();
  const scrollToServices = () => {
    const servicesSection = document.getElementById('services-section');
    if (servicesSection) {
      servicesSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  return <section className="relative min-h-screen flex flex-col">
      {/* Background image with overlay */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
      backgroundImage: "url('/lovable-uploads/74522104-fe6f-4229-8965-fa14fc763836.png')"
    }} />
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-background/85" />
      
      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center px-4 pt-20">
        {/* Logo */}
        <div className="mb-8 animate-fade-in">
          <img src={logo} alt="La Barbe à Papa - Coiffeur Barbier" className="h-64 md:h-80 lg:h-96 w-auto invert" />
        </div>
        
        {/* Decorative line */}
        <div className="gold-separator mb-8" />
        
        {/* Subtitle */}
        <p className="text-muted-foreground text-sm md:text-base uppercase tracking-[0.3em] mb-6 text-center">
          {t.hero.subtitle}
        </p>
        
        {/* Main title */}
        <h1 className="hero-title text-4xl md:text-5xl lg:text-6xl text-center mb-6 gradient-text">
          Votre Style, Notre Passion
        </h1>
        
        {/* Description */}
        <p className="text-muted-foreground text-center max-w-2xl mb-12 leading-relaxed px-4">
          {t.hero.description}
        </p>
        
        {/* CTA Button */}
        <button onClick={scrollToServices} className="hero-cta-button">
          Découvrir nos Services
        </button>
        
        {/* Contact info sidebar */}
        <div className="hidden lg:flex fixed right-8 top-1/2 -translate-y-1/2 flex-col items-end space-y-6 text-right">
          <div className="text-sm">
            
            
            
          </div>
          <div className="decorative-line" />
          <div className="flex space-x-4">
            
            
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="relative z-10 pb-8 flex justify-center">
        <button onClick={scrollToServices} className="scroll-indicator text-primary hover:text-primary/80 transition-colors" aria-label="Scroll to services">
          <ChevronDown className="h-6 w-6" />
          <ChevronDown className="h-6 w-6 -mt-3" />
          <ChevronDown className="h-6 w-6 -mt-3" />
        </button>
      </div>
    </section>;
}