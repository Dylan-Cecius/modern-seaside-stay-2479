import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import logo from "@/assets/logo.png";

export default function HeroSection() {
  const { t } = useLanguage();
  
  const scrollToServices = () => {
    const servicesSection = document.getElementById('services-section');
    if (servicesSection) {
      servicesSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  // Generate random particles - more subtle and varied
  const particles = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 120,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 15 + 10,
    delay: Math.random() * 10,
    opacity: Math.random() * 0.4 + 0.1,
  }));

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
        style={{ backgroundImage: "url('/lovable-uploads/74522104-fe6f-4229-8965-fa14fc763836.png')" }} 
      />
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-background/85" />

      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-primary animate-float-particle"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`,
              opacity: particle.opacity,
            }}
          />
        ))}
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center px-4 pt-20">
        {/* Logo with hover glow effect */}
        <div className="-mb-16 md:-mb-24 lg:-mb-32 animate-fade-in group">
          <img 
            src={logo} 
            alt="La Barbe à Papa - Coiffeur Barbier" 
            className="h-[24rem] md:h-[36rem] lg:h-[48rem] w-auto invert drop-shadow-[0_0_20px_hsl(var(--primary)/0.3)] group-hover:drop-shadow-[0_0_80px_hsl(var(--primary))] group-hover:scale-[1.02] transition-all duration-700 ease-out cursor-pointer" 
          />
        </div>
        
        {/* Decorative line */}
        <div className="gold-separator mb-0" />
        
        {/* Subtitle */}
        <p className="text-muted-foreground text-sm md:text-base uppercase tracking-[0.3em] mb-1 text-center -mt-2">
          {t.hero.subtitle}
        </p>
        
        {/* Main title */}
        <h1 className="hero-title text-4xl md:text-5xl lg:text-6xl text-center mb-1 -mt-1">
          <span className="text-foreground">Votre </span>
          <span className="text-sky">Style</span>
          <span className="text-foreground">, Notre </span>
          <span className="text-sky">Passion</span>
        </h1>
        
        {/* Description */}
        <p className="text-muted-foreground text-center max-w-2xl mb-6 leading-relaxed px-4 -mt-1">
          {t.hero.description}
        </p>
        
        {/* CTA Button */}
        <button onClick={scrollToServices} className="hero-cta-button">
          Découvrir nos Services
        </button>
        
        {/* Contact info sidebar */}
        <div className="hidden lg:flex fixed right-8 top-1/2 -translate-y-1/2 flex-col items-end space-y-6 text-right">
          <div className="text-sm"></div>
          <div className="decorative-line" />
          <div className="flex space-x-4"></div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="relative z-10 pb-8 flex justify-center">
        <button 
          onClick={scrollToServices} 
          className="scroll-indicator text-primary hover:text-primary/80 transition-colors" 
          aria-label="Scroll to services"
        >
          <ChevronDown className="h-6 w-6" />
          <ChevronDown className="h-6 w-6 -mt-3" />
          <ChevronDown className="h-6 w-6 -mt-3" />
        </button>
      </div>
    </section>
  );
}