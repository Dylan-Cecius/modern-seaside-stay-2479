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
      
      {/* Content with pricing */}
      <div className="p-6 space-y-4">
        
        {/* Pricing */}
        <div className="pt-4 border-t border-border/30">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-2xl font-bold text-foreground">{apartment.price}€</span>
              
            </div>
            
          </div>
        </div>
      </div>
    </div>;
}