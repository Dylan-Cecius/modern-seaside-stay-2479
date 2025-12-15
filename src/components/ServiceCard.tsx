import { Clock } from "lucide-react";

export interface ServiceProps {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
}

interface ServiceCardProps {
  service: ServiceProps;
  index: number;
}

export default function ServiceCard({ service, index }: ServiceCardProps) {
  return (
    <div 
      className="service-card scroll-reveal cursor-pointer"
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Service number */}
      <div className="text-primary/30 text-6xl font-light mb-4">
        {String(index + 1).padStart(2, '0')}
      </div>
      
      {/* Service name */}
      <h3 className="text-2xl md:text-3xl font-light mb-3 text-foreground group-hover:text-primary transition-colors">
        {service.name}
      </h3>
      
      {/* Description */}
      <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
        {service.description}
      </p>
      
      {/* Duration and Price */}
      <div className="flex items-center justify-between pt-4 border-t border-sky/30">
        <div className="flex items-center gap-2 text-sky text-sm">
          <Clock className="h-4 w-4" />
          <span>{service.duration}</span>
        </div>
        <div className="text-sky text-2xl font-light">
          {service.price}€
        </div>
      </div>
    </div>
  );
}
