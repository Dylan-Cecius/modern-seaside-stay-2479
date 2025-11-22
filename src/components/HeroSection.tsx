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
  return <section className="relative h-screen overflow-hidden bg-black">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-70" 
        style={{
          backgroundImage: "url('/lovable-uploads/74522104-fe6f-4229-8965-fa14fc763836.png')"
        }} 
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
      
      {/* Content */}
      <div className="relative h-full flex flex-col justify-center items-start px-6 md:px-12 lg:px-24">
        <div className="max-w-3xl space-y-8">
          {/* Main title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight">
            <div className="mb-2">CRAFT.</div>
            <div className="mb-2">STYLE.</div>
            <div>LEGACY.</div>
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/90 font-light tracking-wide max-w-2xl">
            {t.hero.description}
          </p>
          
          {/* CTA Button */}
          <div className="pt-4">
            <Button 
              onClick={() => {
                const servicesSection = document.getElementById('services-section');
                if (servicesSection) {
                  servicesSection.scrollIntoView({ behavior: 'smooth' });
                }
              }} 
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none px-8 py-6 text-base md:text-lg uppercase font-bold tracking-wider"
            >
              {t.hero.exploreApartments}
            </Button>
          </div>
        </div>
      </div>
    </section>;
}