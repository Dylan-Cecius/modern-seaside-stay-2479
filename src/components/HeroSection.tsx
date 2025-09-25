import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
export default function HeroSection() {
  const {
    t
  } = useLanguage();
  return <section className="relative h-screen overflow-hidden">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{
          backgroundImage: "url('/lovable-uploads/74522104-fe6f-4229-8965-fa14fc763836.png')"
        }} 
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />
      
      {/* Content */}
      <div 
        className="relative h-full flex flex-col justify-center items-center text-center px-4" 
      >
        
        {/* Glass morphism container */}
        <div className="relative max-w-4xl backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 p-8 md:p-12 shadow-2xl hero-glass">
          {/* Subtitle */}
          <div className="mb-6 overflow-hidden">
            <span className="inline-block text-white/90 text-lg md:text-xl font-medium tracking-wider">
              {t.hero.subtitle}
            </span>
          </div>
          
          {/* Main title with gradient and glow */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 hero-title">
            <span className="hero-text-gradient drop-shadow-2xl">
              {t.hero.title}
            </span>
          </h1>
          
          {/* Description */}
          <p className="text-lg md:text-xl text-white/95 mb-10 max-w-2xl mx-auto leading-relaxed font-light tracking-wide">
            {t.hero.description}
          </p>
          
          {/* CTA Button with special effects */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button onClick={() => {
            const servicesSection = document.getElementById('services-section');
            if (servicesSection) {
              servicesSection.scrollIntoView({
                behavior: 'smooth'
              });
            }
          }} variant="hero" size="lg" className="hero-cta-button">
              <span className="relative z-10">{t.hero.exploreApartments}</span>
            </Button>
          </div>
        </div>
      </div>
      
    </section>;
}