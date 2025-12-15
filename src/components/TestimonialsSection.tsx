import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface Testimonial {
  id: number;
  name: string;
  title: string;
  content: string;
  rating: number;
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
    date: "il y a 2 ans"
  },
  {
    id: 2,
    name: "Nicolas Van Reeth",
    title: "1 avis",
    content: "Meilleur coiffeur de tout liège ! Grave propre et surtout jamais déçu du service",
    rating: 5,
    date: "il y a 2 ans"
  },
  {
    id: 3,
    name: "Julie Magagnoli",
    title: "Local Guide • 239 avis • 1250 photos",
    content: "Coiffeur très pro, d'une grande gentillesse. Sans rendez-vous, beaucoup de place dans la rue pour se garer. Salon très propre, très soigné.",
    services: "Taille de la barbe, Coupes enfants, Coupe au rasoir, Coupe aux ciseaux, Coupe rasée, Entretien de la barbe",
    rating: 5,
    date: "il y a un an"
  },
  {
    id: 4,
    name: "Steve Hennuy",
    title: "2 avis • 8 photos",
    content: "Salon super conviviale ou l'on sent que le patron aime son boulot et est à l'écoute du client, c'est assez rare de nos jours. Je lui souhaite de rester ouvert très longtemps car je ne voudrais plus aller ailleurs.",
    rating: 5,
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
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevTestimonial = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  useEffect(() => {
    const interval = setInterval(nextTestimonial, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="testimonials" className="section bg-secondary/30">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 fade-in-up">
          <span className="text-primary text-sm uppercase tracking-[0.3em] mb-4 block">
            Témoignages
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4 gradient-text">
            {t.testimonials.title}
          </h2>
          <div className="gold-separator mt-6" />
        </div>

        {/* Google rating banner */}
        <div className="flex justify-center items-center gap-2 mb-12">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-primary text-primary" />
            ))}
          </div>
          <span className="text-foreground font-medium">5/5 sur Google</span>
        </div>

        {/* Testimonials carousel */}
        <div className="relative max-w-4xl mx-auto">
          <div className="relative min-h-[350px]">
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
                <div className="glass-card p-8 md:p-12 text-center">
                  {/* Quote icon */}
                  <Quote className="h-12 w-12 text-primary/30 mx-auto mb-6" />

                  {/* Content */}
                  <p className="text-lg md:text-xl text-foreground leading-relaxed mb-8 italic">
                    "{testimonial.content}"
                  </p>

                  {testimonial.services && (
                    <p className="text-sm text-muted-foreground mb-6">
                      Services : {testimonial.services}
                    </p>
                  )}

                  {/* Rating */}
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>

                  {/* Author */}
                  <div className="decorative-line mx-auto mb-4" />
                  <h4 className="text-foreground font-semibold text-lg">{testimonial.name}</h4>
                  <p className="text-muted-foreground text-sm">{testimonial.title}</p>
                  <p className="text-muted-foreground text-xs mt-1">{testimonial.date}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-center items-center gap-8 mt-8">
            <button
              onClick={prevTestimonial}
              className="p-3 border border-border/50 hover:border-primary hover:text-primary transition-all"
              disabled={isAnimating}
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Précédent</span>
            </button>

            <div className="flex space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (isAnimating) return;
                    setIsAnimating(true);
                    setActiveIndex(index);
                    setTimeout(() => setIsAnimating(false), 500);
                  }}
                  className={cn(
                    "w-2 h-2 transition-all duration-300",
                    activeIndex === index
                      ? "bg-primary w-8"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  )}
                  aria-label={`Aller au témoignage ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="p-3 border border-border/50 hover:border-primary hover:text-primary transition-all"
              disabled={isAnimating}
            >
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Suivant</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
