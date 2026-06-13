import { useEffect, lazy, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ServiceCard, { ServiceProps } from "@/components/ServiceCard";
import GalleryCarousel from "@/components/GalleryCarousel";
import { Scissors, Coffee, ParkingCircle } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const TestimonialsSection = lazy(() => import("@/components/TestimonialsSection"));
const ChatBox = lazy(() =>
  import("@/components/ChatBox").then((m) => ({ default: m.ChatBox }))
);
const ScrollToTop = lazy(() => import("@/components/ScrollToTop"));

const services: ServiceProps[] = [
  { id: "1", name: "Coupe Homme", description: "Coupe classique masculine adaptée à votre style et morphologie.", price: 18, duration: "30 min" },
  { id: "2", name: "Coupe + Barbe", description: "Service complet associant coupe moderne et taille de barbe professionnelle.", price: 23, duration: "45 min" },
  { id: "3", name: "Taille de barbe classique", description: "Service spécialisé de taille et mise en forme de la barbe.", price: 10, duration: "15 min" },
  { id: "4", name: "Double ancienne", description: "Formule premium avec techniques traditionnelles et soins complets.", price: 32, duration: "50 min" },
  { id: "5", name: "Coupe enfant", description: "Coupe spécialement adaptée aux enfants dans une ambiance détendue.", price: 16, duration: "30 min" },
  { id: "6", name: "Taille de barbe à l'ancienne", description: "Service traditionnel de rasage à l'ancienne avec techniques authentiques.", price: 15, duration: "25 min" },
];

const features = [
  { icon: <Scissors className="h-6 w-6" />, title: "Expertise Reconnue", description: "Des barbiers expérimentés et passionnés par leur métier." },
  { icon: <Coffee className="h-6 w-6" />, title: "Ambiance Conviviale", description: "Un accueil chaleureux dans une atmosphère détendue." },
  { icon: <ParkingCircle className="h-6 w-6" />, title: "Parking Facile", description: "Stationnement aisé à proximité du salon." },
];

const recentPhotos = [
  { src: "/gallery/coupe-recent-1.jpg", alt: "Coupe brushed up dégradé fade, profil" },
  { src: "/gallery/coupe-recent-2.jpg", alt: "Fade serré avec design ligne rasée, arrière" },
  { src: "/gallery/coupe-recent-3.jpg", alt: "Blond cendré décoloration, mi-long sur le dessus, fade sec" },
  { src: "/gallery/coupe-recent-4.jpg", alt: "Coupe française châtain claire, mid-fade" },
];

const gallery = [
  ...recentPhotos.filter((p) => {
    try {
      const req = new XMLHttpRequest();
      req.open("HEAD", p.src, false);
      req.send();
      return req.status >= 200 && req.status < 300;
    } catch {
      return false;
    }
  }),
  { src: "/lovable-uploads/ed8f100e-1c03-44d7-b811-f0fce045d875.png", alt: "Coupe dégradée classique" },
  { src: "/lovable-uploads/1a99e796-3589-4843-a0bd-9fb830318a14.png", alt: "Coupe moderne avec dégradé" },
  { src: "/lovable-uploads/8ca30b87-12b4-487c-8020-a9a2ba8489bb.png", alt: "Coupe avec barbe taillée" },
  { src: "/lovable-uploads/bdb68e6b-1596-4638-8a4e-0fd01454d7f6.png", alt: "Dégradé progressif avec barbe" },
  { src: "/lovable-uploads/51c99a7e-454a-4acb-a0fc-73b5b1f86b08.png", alt: "Coupe précise avec finitions" },
];

export default function Index() {
  useScrollAnimation();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "La Barbe à Papa - Coiffeur Homme & Barbier à Jemeppe-sur-Meuse";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "Salon de coiffure homme et barbier professionnel à Jemeppe-sur-Meuse. Coupe moderne, taille de barbe, rasage traditionnel. Sans rendez-vous."
      );
    }
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col bg-background"
      itemScope
      itemType="https://schema.org/HairSalon"
    >
      <Navbar />

      <main className="flex-1">
        <HeroSection />

        {/* SERVICES — menu barbier */}
        <section id="services-section" className="section bg-card">
          <div className="container">
            <div className="sec-head scroll-reveal">
              <span className="eyebrow">Nos Prestations</span>
              <h2>Nos Services</h2>
              <p>
                Découvrez notre gamme complète de services pour hommes, alliant tradition barbière
                et modernité.
              </p>
            </div>

            <div className="menu-card">
              {services.map((s, i) => (
                <ServiceCard key={s.id} service={s} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* GALERIE */}
        <section id="galerie" className="section">
          <div className="container">
            <div className="sec-head scroll-reveal">
              <span className="eyebrow">Le Travail Parle</span>
              <h2>Galerie</h2>
            </div>

            <div className="scroll-reveal">
              <GalleryCarousel images={gallery} />
            </div>
          </div>
        </section>

        {/* AVIS */}
        <Suspense
          fallback={
            <div className="h-96 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          <TestimonialsSection />
        </Suspense>

        {/* ATOUTS */}
        <section id="features" className="section">
          <div className="container">
            <div className="sec-head scroll-reveal">
              <span className="eyebrow">Nos Atouts</span>
              <h2>L'Excellence à Votre Service</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto text-center">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="scroll-reveal"
                  style={{ transitionDelay: `${i * 120}ms` }}
                >
                  <div className="w-16 h-16 mx-auto mb-5 border border-primary rounded-full flex items-center justify-center text-primary">
                    {f.icon}
                  </div>
                  <h3 className="text-2xl mb-2">{f.title}</h3>
                  <p className="text-muted-foreground text-[0.92rem] max-w-[260px] mx-auto">
                    {f.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section
          id="contact"
          className="section relative text-center"
          style={{
            backgroundImage:
              "linear-gradient(rgba(14,13,11,.82), rgba(14,13,11,.92)), url('/lovable-uploads/74522104-fe6f-4229-8965-fa14fc763836.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        >
          <div className="container scroll-reveal">
            <span className="eyebrow">Sans Rendez-Vous</span>
            <h2
              className="mt-4"
              style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.4rem)" }}
            >
              Prêt pour un{" "}
              <em className="italic" style={{ color: "hsl(var(--accent))" }}>
                Nouveau Look
              </em>{" "}
              ?
            </h2>
            <div
              className="mt-6"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.5rem",
                color: "hsl(var(--accent))",
              }}
            >
              Mardi – Samedi : 10h – 19h
            </div>
            <div
              className="text-muted-foreground uppercase text-[0.78rem] mt-2"
              style={{ letterSpacing: "0.25em" }}
            >
              Jemeppe-sur-Meuse
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <Suspense fallback={null}>
        <ScrollToTop />
      </Suspense>
      <Suspense fallback={null}>
        <ChatBox />
      </Suspense>
    </div>
  );
}
