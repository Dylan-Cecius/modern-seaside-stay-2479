import { useEffect, useState, lazy, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ApartmentCard, { ApartmentProps } from "@/components/ApartmentCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Wifi, Utensils, Waves, LifeBuoy, MapPin, Coffee, Scissors, Zap, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

// Lazy load non-critical components
const TestimonialsSection = lazy(() => import("@/components/TestimonialsSection"));
const ChatBox = lazy(() => import("@/components/ChatBox").then(module => ({ default: module.ChatBox })));
const ScrollToTop = lazy(() => import("@/components/ScrollToTop"));

// Sample services data - adapted for barbershop
const featuredServices: ApartmentProps[] = [{
  id: "1",
  name: "Coupe Homme",
  description: "Coupe classique masculine adaptée à votre style et morphologie.",
  price: 18,
  capacity: 1,
  size: 30,
  image: "",
  location: "30 min",
  features: ["Coupe", "Lavage", "Séchage", "Produits inclus", "Conseil style"]
}, {
  id: "2",
  name: "Coupe + Barbe",
  description: "Service complet associant coupe moderne et taille de barbe professionnelle.",
  price: 23,
  capacity: 1,
  size: 45,
  image: "",
  location: "45 min",
  features: ["Coupe", "Taille barbe", "Produits premium", "Conseil style", "Finition"]
}, {
  id: "3",
  name: "Taille de barbe classique",
  description: "Service spécialisé de taille et mise en forme de la barbe.",
  price: 10,
  capacity: 1,
  size: 15,
  image: "",
  location: "15 min",
  features: ["Taille", "Mise en forme", "Produits premium", "Conseil entretien"]
}, {
  id: "4",
  name: "Double ancienne",
  description: "Formule premium avec techniques traditionnelles et soins complets.",
  price: 32,
  capacity: 1,
  size: 50,
  image: "",
  location: "50 min",
  features: ["Double prestation", "Techniques ancestrales", "Produits premium", "Service VIP"]
}, {
  id: "5",
  name: "Coupe enfant",
  description: "Coupe spécialement adaptée aux enfants dans une ambiance détendue.",
  price: 16,
  capacity: 1,
  size: 30,
  image: "",
  location: "30 min",
  features: ["Coupe adaptée", "Patience", "Ambiance ludique", "Produits doux"]
}, {
  id: "6",
  name: "Taille de barbe à l'ancienne",
  description: "Service traditionnel de rasage à l'ancienne avec techniques authentiques.",
  price: 15,
  capacity: 1,
  size: 25,
  image: "",
  location: "25 min",
  features: ["Rasage traditionnel", "Techniques ancestrales", "Produits naturels", "Finition soignée"]
}
// Service "soin visage" retiré car non proposé actuellement
];
export default function Index() {
  const {
    t
  } = useLanguage();
  useScrollAnimation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 5;
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Update page title and meta description dynamically
    document.title = "Barbier La Barbe à Papa - Salon de Coiffure Homme & Barber Shop";
    
    // Add meta description if not exists
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Salon de coiffure homme et barbier professionnel. Coupe moderne, taille de barbe, rasage traditionnel. Service de qualité dans une ambiance conviviale. Réservation en ligne.');
    }
  }, []);
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };
  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % totalSlides);
  };
  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + totalSlides) % totalSlides);
  };

  // Feature items
  const features = [{
    icon: <Scissors className="h-8 w-8 text-primary" />,
    title: "Expertise Reconnue",
    description: "Des barbiers expérimentés et passionnés."
  }, {
    icon: <Coffee className="h-8 w-8 text-primary" />,
    title: "Ambiance Conviviale",
    description: "Un accueil chaleureux dans une atmosphère détendue."
  }, {
    icon: <MapPin className="h-8 w-8 text-primary" />,
    title: "Parking Facile",
    description: "Stationnement aisé à proximité du salon."
  }];
  return <div className="min-h-screen flex flex-col relative overflow-hidden" itemScope itemType="https://schema.org/HairSalon">
      
      <Navbar />
      
      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Featured Services */}
        <section id="services-section" className="section bg-black relative" itemScope itemType="https://schema.org/ItemList">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Left column - Services */}
              <div>
                <div className="mb-12">
                  <h2 className="text-4xl md:text-5xl font-bold text-primary mb-2">
                    NOS SERVICES
                  </h2>
                  <div className="h-1 w-24 bg-primary"></div>
                </div>
                
                <div className="space-y-8">
                  {featuredServices.map((service, index) => (
                    <div 
                      key={service.id} 
                      className="group relative border-l-4 border-primary pl-6 py-2"
                      style={{ animationDelay: `${(index + 1) * 100}ms` }}
                    >
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                        {service.name}
                      </h3>
                      <p className="text-white/60 text-sm mb-3 leading-relaxed">
                        {service.description}
                      </p>
                      <div className="text-2xl md:text-3xl font-bold text-white mb-3">
                        {service.price}.00K
                      </div>
                      <Button 
                        className="bg-primary text-black hover:bg-primary/90 rounded-none px-6 py-2 text-xs uppercase font-bold tracking-wider"
                        onClick={() => {
                          const contactSection = document.getElementById('contact-section');
                          if (contactSection) {
                            contactSection.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                      >
                        VOIR DÉTAILS
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Right column - Testimonial and Gallery */}
              <div className="space-y-12">
                {/* Testimonial Card */}
                <div className="bg-card border border-border/20 p-8 rounded-lg">
                  <h3 className="text-2xl md:text-3xl font-bold text-primary mb-6">
                    TÉMOIGNAGE
                  </h3>
                  <p className="text-white/80 italic mb-6 leading-relaxed">
                    "Meilleur coiffeur de tout Liège ! Gravé propre et surtout jamais déçu de service."
                  </p>
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-primary text-xl">★</span>
                    ))}
                  </div>
                  <p className="text-white/60 text-sm">
                    Alexandre • 5 étoiles sur 5 ⭐⭐
                  </p>
                </div>
                
                {/* Gallery Section */}
                <div id="gallery-section">
                  <div className="mb-6">
                    <h3 className="text-3xl md:text-4xl font-bold text-primary mb-2">
                      GALLERIE
                    </h3>
                    <div className="h-1 w-24 bg-primary"></div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      '/lovable-uploads/1a99e796-3589-4843-a0bd-9fb830318a14.png',
                      '/lovable-uploads/2944f95e-7a9d-4daf-8ab2-89fdbef4b61e.png',
                      '/lovable-uploads/51c99a7e-454a-4acb-a0fc-73b5b1f86b08.png',
                      '/lovable-uploads/54c3307a-f578-4052-8a65-69803bdabda2.png',
                      '/lovable-uploads/8ca30b87-12b4-487c-8020-a9a2ba8489bb.png',
                      '/lovable-uploads/bcc49489-878e-418e-815a-517d163c1a9b.png'
                    ].map((image, index) => (
                      <div 
                        key={index} 
                        className="aspect-square overflow-hidden group cursor-pointer rounded-lg"
                      >
                        <img 
                          src={image} 
                          alt={`Galerie ${index + 1}`}
                          className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300 group-hover:scale-110"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="section bg-card">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="flex flex-col items-center text-center p-6"
                  style={{ animationDelay: `${(index + 1) * 100}ms` }}
                >
                  <div className="mb-4 p-3 rounded-full bg-primary/10">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section id="contact-section" className="relative py-24 bg-black/95">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                {t.home.cta.title}
              </h2>
              <p className="text-white/70 mb-8">
                {t.home.cta.description}
              </p>
              <Button 
                className="bg-primary text-black hover:bg-primary/90 rounded-none px-8 py-4 text-base uppercase font-bold tracking-wider"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                PRENDRE RENDEZ-VOUS
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      
      {/* Chat and scroll components - lazy loaded */}
      <Suspense fallback={null}>
        <ScrollToTop />
      </Suspense>
      <Suspense fallback={null}>
        <ChatBox />
      </Suspense>
    </div>;
}