import { useState } from "react";
import { Link } from "react-router-dom";
import { Users, Maximize, MapPin, Bath, Coffee, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
export interface ApartmentProps {
  id: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  size: number;
  image: string;
  location: string;
  features: string[];
}
export default function ApartmentCard({
  apartment
}: {
  apartment: ApartmentProps;
}) {
  const {
    t,
    language
  } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

  // Use translated name and description if available
  const translatedName = language !== 'en' && t.apartmentDescriptions[apartment.id]?.name ? t.apartmentDescriptions[apartment.id].name : apartment.name;
  const translatedDescription = language !== 'en' && t.apartmentDescriptions[apartment.id]?.description ? t.apartmentDescriptions[apartment.id].description : apartment.description;
  return <div className="rounded-xl overflow-hidden shadow-lg transition-all duration-500 hover:shadow-xl bg-card group border border-border/50 hover:border-primary/30" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      {/* Header with service name and duration */}
      <div className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 p-6 border-b border-border/30">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-foreground">{translatedName}</h3>
          <div className="flex items-center text-primary font-medium bg-primary/10 px-3 py-1 rounded-full">
            <span className="text-sm">{apartment.location}</span>
          </div>
        </div>
        <p className="text-muted-foreground">{translatedDescription}</p>
      </div>
      
      {/* Content with features and pricing */}
      <div className="p-6 space-y-4">
        {/* Features list */}
        {apartment.features && apartment.features.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-foreground text-sm uppercase tracking-wider">Inclus dans le service</h4>
            <div className="grid grid-cols-2 gap-2">
              {apartment.features.map((feature, index) => (
                <div key={index} className="flex items-center text-sm text-muted-foreground">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></div>
                  {feature}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Pricing */}
        <div className="pt-4 border-t border-border/30">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-2xl font-bold text-foreground">{apartment.price}€</span>
              <span className="text-muted-foreground text-sm"> / {t.booking.summary.night}</span>
            </div>
            <div className="bg-gradient-to-r from-primary/20 to-accent/20 px-4 py-2 rounded-lg">
              <span className="text-sm font-medium text-primary">Réserver</span>
            </div>
          </div>
        </div>
      </div>
    </div>;
}