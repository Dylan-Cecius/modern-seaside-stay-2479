import { useEffect, lazy, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ServiceCard, { ServiceProps } from "@/components/ServiceCard";
import { Scissors, Coffee, MapPin, Clock, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

// Lazy load components
const TestimonialsSection = lazy(() => import("@/components/TestimonialsSection"));
const ChatBox = lazy(() => import("@/components/ChatBox").then(module => ({
  default: module.ChatBox
})));
const ScrollToTop = lazy(() => import("@/components/ScrollToTop"));

// Services data
const services: ServiceProps[] = [{
  id: "1",
  name: "Coupe Homme",
  description: "Coupe classique masculine adaptée à votre style et morphologie.",
  price: 18,
  duration: "30 min"
}, {
  id: "2",
  name: "Coupe + Barbe",
  description: "Service complet associant coupe moderne et taille de barbe professionnelle.",
  price: 23,
  duration: "45 min"
}, {
  id: "3",
  name: "Taille de barbe classique",
  description: "Service spécialisé de taille et mise en forme de la barbe.",
  price: 10,
  duration: "15 min"
}, {
  id: "4",
  name: "Double ancienne",
  description: "Formule premium avec techniques traditionnelles et soins complets.",
  price: 32,
  duration: "50 min"
}, {
  id: "5",
  name: "Coupe enfant",
  description: "Coupe spécialement adaptée aux enfants dans une ambiance détendue.",
  price: 16,
  duration: "30 min"
}, {
  id: "6",
  name: "Taille de barbe à l'ancienne",
  description: "Service traditionnel de rasage à l'ancienne avec techniques authentiques.",
  price: 15,
  duration: "25 min"
}];

// Features data
const features = [{
  icon: <Scissors className="h-8 w-8" />,
  title: "Expertise Reconnue",
  description: "Des barbiers expérimentés et passionnés par leur métier."
}, {
  icon: <Coffee className="h-8 w-8" />,
  title: "Ambiance Conviviale",
  description: "Un accueil chaleureux dans une atmosphère détendue."
}, {
  icon: <MapPin className="h-8 w-8" />,
  title: "Parking Facile",
  description: "Stationnement aisé à proximité du salon."
}];
export default function Index() {
  const {
    t
  } = useLanguage();
  useScrollAnimation();
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "La Barbe à Papa - Coiffeur Homme & Barbier à Jemeppe-sur-Meuse";
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Salon de coiffure homme et barbier professionnel à Jemeppe-sur-Meuse. Coupe moderne, taille de barbe, rasage traditionnel. Sans rendez-vous.');
    }
  }, []);
  return <div className="min-h-screen flex flex-col bg-background" itemScope itemType="https://schema.org/HairSalon">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />

        {/* Gallery Section with parallax effect */}
        <section className="py-0 scroll-reveal">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-1">
            <div className="aspect-square overflow-hidden scroll-reveal-scale" style={{ transitionDelay: '0ms' }}>
              <img src="/lovable-uploads/ed8f100e-1c03-44d7-b811-f0fce045d875.png" alt="Coupe dégradée classique" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" loading="lazy" />
            </div>
            <div className="aspect-square overflow-hidden scroll-reveal-scale" style={{ transitionDelay: '100ms' }}>
              <img src="/lovable-uploads/1a99e796-3589-4843-a0bd-9fb830318a14.png" alt="Coupe moderne avec dégradé" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" loading="lazy" />
            </div>
            <div className="aspect-square overflow-hidden scroll-reveal-scale" style={{ transitionDelay: '200ms' }}>
              <img src="/lovable-uploads/8ca30b87-12b4-487c-8020-a9a2ba8489bb.png" alt="Coupe avec barbe taillée" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" loading="lazy" />
            </div>
            <div className="aspect-square overflow-hidden scroll-reveal-scale" style={{ transitionDelay: '300ms' }}>
              <img src="/lovable-uploads/bdb68e6b-1596-4638-8a4e-0fd01454d7f6.png" alt="Dégradé progressif avec barbe" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" loading="lazy" />
            </div>
            <div className="aspect-square overflow-hidden hidden md:block scroll-reveal-scale" style={{ transitionDelay: '400ms' }}>
              <img src="/lovable-uploads/51c99a7e-454a-4acb-a0fc-73b5b1f86b08.png" alt="Coupe précise avec finitions" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" loading="lazy" />
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services-section" className="section" itemScope itemType="https://schema.org/ItemList">
          <div className="container">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-16 scroll-reveal">
              <span className="text-primary text-sm uppercase tracking-[0.3em] mb-4 block">
                Nos Prestations
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4 gradient-text">
                {t.home.featuredApartments.title}
              </h2>
              <p className="text-muted-foreground mt-6">
                {t.home.featuredApartments.description}
              </p>
              <div className="gold-separator mt-8" />
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => <ServiceCard key={service.id} service={service} index={index} />)}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <Suspense fallback={<div className="h-96 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>}>
          <TestimonialsSection />
        </Suspense>

        {/* Features Section */}
        <section id="features" className="section bg-card">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-16 scroll-reveal">
              <span className="text-primary text-sm uppercase tracking-[0.3em] mb-4 block">
                {t.home.amenities.subtitle}
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4 gradient-text">
                {t.home.amenities.title}
              </h2>
              <div className="gold-separator mt-6" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {features.map((feature, index) => <div key={index} className="glass-card p-8 text-center scroll-reveal" style={{
              transitionDelay: `${index * 150}ms`
            }}>
                  <div className="inline-flex items-center justify-center w-16 h-16 border border-primary/30 text-primary mb-6 transition-all duration-500 group-hover:border-sky group-hover:text-sky">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </div>)}
            </div>
          </div>
        </section>

        {/* CTA Section with parallax */}
        <section className="section relative overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center opacity-20 parallax-bg" style={{
          backgroundImage: "url('/lovable-uploads/74522104-fe6f-4229-8965-fa14fc763836.png')"
        }} />
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center scroll-reveal">
              <span className="text-primary text-sm uppercase tracking-[0.3em] mb-4 block">
                Sans Rendez-vous
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl mb-6 gradient-text">
                {t.home.cta.title}
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                {t.home.cta.description}
              </p>
              <div className="gold-separator mb-8" />
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-2 scroll-reveal-left" style={{ transitionDelay: '200ms' }}>
                  <Clock className="h-5 w-5 text-primary" />
                  <span>Mardi - Samedi : 10h - 19h</span>
                </div>
                <div className="flex items-center gap-2 scroll-reveal-right" style={{ transitionDelay: '200ms' }}>
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>Jemeppe-sur-Meuse</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Lazy loaded components */}
      <Suspense fallback={null}>
        <ScrollToTop />
      </Suspense>
      <Suspense fallback={null}>
        <ChatBox />
      </Suspense>
    </div>;
}