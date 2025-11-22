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
        className="absolute inset-0 bg-cover bg-center opacity-60" 
        style={{
          backgroundImage: "url('/lovable-uploads/74522104-fe6f-4229-8965-fa14fc763836.png')"
        }} 
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
      
      {/* Content */}
      <div className="relative h-full flex flex-col justify-center items-start px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <div className="max-w-2xl space-y-6">
          {/* Main title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-none">
            <div className="mb-3">CRAFT.</div>
            <div className="mb-3">STYLE.</div>
            <div>LEGACY.</div>
          </h1>
          
          {/* Subtitle */}
          <p className="text-base md:text-lg text-white/90 font-normal tracking-wide max-w-lg">
            VOTRE BARBIER PROFESSIONNEL À LIÈGE ET JEMEPPE SUR MEUSE.
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
              className="bg-primary text-black hover:bg-primary/90 rounded-none px-8 py-6 text-sm md:text-base uppercase font-bold tracking-wider"
            >
              RÉSERVER VOTRE TRANSFORMATION
            </Button>
          </div>
        </div>
      </div>
    </section>;
}