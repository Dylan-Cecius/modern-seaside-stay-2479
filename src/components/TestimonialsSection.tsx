import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface Testimonial {
  id: number;
  name: string;
  title: string;
  content: string;
  rating: number;
  image: string;
  date: string;
  services?: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Boulanger Michaël",
    title: "Local Guide • 15 avis",
    content: "Barbier de quartier, sympathique et prend soin du client, travail soigné et impeccable",
    rating: 5,
    image: "/lovable-uploads/2944f95e-7a9d-4daf-8ab2-89fdbef4b61e.png",
    date: "il y a 2 ans"
  },
  {
    id: 2,
    name: "Nicolas Van Reeth",
    title: "1 avis",
    content: "Meilleur coiffeur de tout liège ! Grave propre et surtout jamais déçu du service",
    rating: 5,
    image: "/lovable-uploads/bcc49489-878e-418e-815a-517d163c1a9b.png",
    date: "il y a 2 ans"
  },
  {
    id: 3,
    name: "Julie Magagnoli",
    title: "Local Guide • 239 avis • 1250 photos",
    content: "Coiffeur très pro, d'une grande gentillesse. Sans rendez-vous, beaucoup de place dans la rue pour se garer. Salon très propre, très soigné.",
    services: "Taille de la barbe, Coupes enfants, Coupe au rasoir, Coupe aux ciseaux, Coupe rasée, Entretien de la barbe",
    rating: 5,
    image: "/lovable-uploads/54c3307a-f578-4052-8a65-69803bdabda2.png",
    date: "il y a un an"
  },
  {
    id: 4,
    name: "steve hennuy",
    title: "2 avis • 8 photos",
    content: "Salon super conviviale ou l'on sent que le patron aime son boulot et est à l'écoute du client, c'est assez rare de nos jours. Je lui souhaite de rester ouvert très longtemps car je ne voudrais plus aller ailleurs.",
    rating: 5,
    image: "/lovable-uploads/d3d18fa1-9575-4ec0-8804-30782e75c1d8.png",
    date: "Modifié il y a 10 mois"
  }
];

export default function TestimonialsSection() {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const nextTestimonial = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };
  
  const prevTestimonial = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };
  
  useEffect(() => {
    const interval = setInterval(nextTestimonial, 8000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <section className="section bg-muted py-20">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t.testimonials.title}
          </h2>
          <p className="text-muted-foreground">
            {t.testimonials.description}
          </p>
        </div>
        
        <div className="relative max-w-4xl mx-auto">
          <div className="relative h-auto">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={cn(
                  "absolute inset-0 transition-all duration-500",
                  activeIndex === index 
                    ? "opacity-100 translate-x-0 z-10"
                    : index < activeIndex 
                      ? "opacity-0 -translate-x-full z-0" 
                      : "opacity-0 translate-x-full z-0"
                )}
              >
                <div className="bg-white dark:bg-card rounded-xl p-8 shadow-lg min-h-[300px]">
                  {/* Google Review Style */}
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                      {testimonial.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                      <div className="flex items-center mt-1">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                        <span className="text-sm text-muted-foreground ml-2">{testimonial.date}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {testimonial.content}
                  </p>
                  
                  {testimonial.services && (
                    <div className="border-t pt-4 mt-4">
                      <p className="text-sm font-medium mb-2">Services :</p>
                      <p className="text-sm text-muted-foreground">{testimonial.services}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between mt-8">
            <button
              onClick={prevTestimonial}
              className="p-2 rounded-full bg-card hover:bg-muted border border-border transition-colors"
              disabled={isAnimating}
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Previous testimonial</span>
            </button>
            
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (isAnimating) return;
                    setIsAnimating(true);
                    setActiveIndex(index);
                    setTimeout(() => setIsAnimating(false), 500);
                  }}
                  className={`w-3 h-3 rounded-full transition-all ${
                    activeIndex === index 
                      ? "bg-primary w-6" 
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            
            <button
              onClick={nextTestimonial}
              className="p-2 rounded-full bg-card hover:bg-muted border border-border transition-colors"
              disabled={isAnimating}
            >
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Next testimonial</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
