import { Star } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  title: string;
  content: string;
  date: string;
  services?: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Boulanger Michaël",
    title: "Local Guide • 15 avis",
    content:
      "Barbier de quartier, sympathique et prend soin du client, travail soigné et impeccable",
    date: "il y a 2 ans",
  },
  {
    id: 2,
    name: "Nicolas Van Reeth",
    title: "1 avis",
    content:
      "Meilleur coiffeur de tout liège ! Grave propre et surtout jamais déçu du service",
    date: "il y a 2 ans",
  },
  {
    id: 3,
    name: "Julie Magagnoli",
    title: "Local Guide • 239 avis • 1250 photos",
    content:
      "Coiffeur très pro, d'une grande gentillesse. Sans rendez-vous, beaucoup de place dans la rue pour se garer. Salon très propre, très soigné.",
    services:
      "Taille de la barbe, Coupes enfants, Coupe au rasoir, Coupe aux ciseaux, Coupe rasée, Entretien de la barbe",
    date: "il y a un an",
  },
  {
    id: 4,
    name: "Steve Hennuy",
    title: "2 avis • 8 photos",
    content:
      "Salon super conviviale ou l'on sent que le patron aime son boulot et est à l'écoute du client, c'est assez rare de nos jours. Je lui souhaite de rester ouvert très longtemps car je ne voudrais plus aller ailleurs.",
    date: "Modifié il y a 10 mois",
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="section bg-card">
      <div className="container">
        <div className="sec-head scroll-reveal">
          <span className="eyebrow">Témoignages</span>
          <h2>Ce que disent nos Clients</h2>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex gap-1 text-primary">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-primary" />
              ))}
            </div>
            <span className="text-foreground text-sm">5/5 sur Google</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <div
              key={t.id}
              className="avis-card scroll-reveal"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <blockquote
                className="italic pl-9"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.25rem",
                  lineHeight: 1.5,
                }}
              >
                {t.content}
              </blockquote>

              {t.services && (
                <div className="pl-9 mt-3 text-[0.82rem] text-muted-foreground">
                  Services : {t.services}
                </div>
              )}

              <div className="flex items-center gap-4 mt-5 pl-9">
                <span
                  className="w-10 h-10 rounded-full border border-primary text-primary flex items-center justify-center"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem" }}
                >
                  {t.name.charAt(0)}
                </span>
                <div>
                  <b className="block text-[0.92rem] font-medium text-foreground">{t.name}</b>
                  <span className="text-[0.75rem] text-muted-foreground">
                    {t.title} · {t.date}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
