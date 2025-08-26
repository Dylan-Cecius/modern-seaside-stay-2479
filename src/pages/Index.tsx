import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import BookingForm from "@/components/BookingForm";
import TestimonialsSection from "@/components/TestimonialsSection";
import ApartmentCard, { ApartmentProps } from "@/components/ApartmentCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Wifi, Utensils, Waves, LifeBuoy, MapPin, Coffee, Scissors } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import ScrollToTop from "@/components/ScrollToTop";

// Sample services data - adapted for barbershop
const featuredServices: ApartmentProps[] = [
  {
    id: "1",
    name: "Coupe Homme",
    description: "Coupe classique masculine adaptée à votre style et morphologie.",
    price: 18,
    capacity: 1,
    size: 30,
    image: "/src/assets/barber-service.jpg",
    location: "30 min",
    features: ["Coupe", "Lavage", "Séchage", "Produits inclus", "Conseil style"]
  },
  {
    id: "2",
    name: "Coupe + Barbe",
    description: "Service complet associant coupe moderne et taille de barbe professionnelle.",
    price: 23,
    capacity: 1,
    size: 45,
    image: "/src/assets/traditional-shaving.jpg",
    location: "45 min",
    features: ["Coupe", "Taille barbe", "Produits premium", "Conseil style", "Finition"]
  },
  {
    id: "3",
    name: "Taille de barbe classique",
    description: "Service spécialisé de taille et mise en forme de la barbe.",
    price: 10,
    capacity: 1,
    size: 15,
    image: "/src/assets/barber-service.jpg",
    location: "15 min",
    features: ["Taille", "Mise en forme", "Produits premium", "Conseil entretien"]
  },
  {
    id: "4",
    name: "Double ancienne",
    description: "Formule premium avec techniques traditionnelles et soins complets.",
    price: 32,
    capacity: 1,
    size: 50,
    image: "/src/assets/traditional-shaving.jpg",
    location: "50 min",
    features: ["Double prestation", "Techniques ancestrales", "Produits premium", "Service VIP"]
  },
  {
    id: "5",
    name: "Coupe enfant",
    description: "Coupe spécialement adaptée aux enfants dans une ambiance détendue.",
    price: 16,
    capacity: 1,
    size: 30,
    image: "/src/assets/barber-service.jpg",
    location: "30 min",
    features: ["Coupe adaptée", "Patience", "Ambiance ludique", "Produits doux"]
  },
  {
    id: "6",
    name: "Taille de barbe à l'ancienne",
    description: "Service traditionnel de rasage à l'ancienne avec techniques authentiques.",
    price: 15,
    capacity: 1,
    size: 25,
    image: "/src/assets/traditional-shaving.jpg",
    location: "25 min",
    features: ["Rasage traditionnel", "Techniques ancestrales", "Produits naturels", "Finition soignée"]
  }
  // Service "soin visage" retiré car non proposé actuellement
];

export default function Index() {
  const { t } = useLanguage();
  useScrollAnimation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 5;
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);
  
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };
  
  // Feature items
  const features = [
    {
      icon: <Scissors className="h-8 w-8 text-primary" />,
      title: "Expertise Reconnue",
      description: "Des barbiers expérimentés et passionnés."
    },
    {
      icon: <Coffee className="h-8 w-8 text-primary" />,
      title: "Ambiance Conviviale",
      description: "Un accueil chaleureux dans une atmosphère détendue."
    },
    {
      icon: <MapPin className="h-8 w-8 text-primary" />,
      title: "Parking Facile",
      description: "Stationnement aisé à proximité du salon."
    }
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />

        {/* Scrolling text banner inspired by Bayer & Bayer */}
        <section className="bg-primary text-primary-foreground py-4 overflow-hidden">
          <div className="scrolling-text">
            <span>COIFFURE</span>
            <span>BARBE</span>
            <span>STYLE</span>
            <span>TRADITION</span>
            <span>EXCELLENCE</span>
            <span>COIFFURE</span>
            <span>BARBE</span>
            <span>STYLE</span>
            <span>TRADITION</span>
            <span>EXCELLENCE</span>
          </div>
        </section>
        
        {/* Welcome Section */}
        <section id="welcome" className="section relative overflow-hidden bg-gradient-to-br from-background via-background/80 to-primary/5">
          <div className="container relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="fade-in-up premium-reveal relative z-10">
                <span className="text-sm text-primary font-medium uppercase tracking-wider">
                  {t.home.welcome.subtitle}
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6 text-reveal">
                  <span style={{"--delay": 1} as React.CSSProperties}>{t.home.welcome.title.split(' ')[0]}</span>{' '}
                  <span style={{"--delay": 2} as React.CSSProperties}>{t.home.welcome.title.split(' ').slice(1).join(' ')}</span>
                </h2>
                <p className="text-muted-foreground mb-6">
                  {t.home.welcome.description1}
                </p>
                <p className="text-muted-foreground mb-8">
                  {t.home.welcome.description2}
                </p>
                <Button asChild className="btn-primary elegant-hover">
                  <Link to="/about">
                    {t.home.welcome.learnMore} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              
              <div className="relative scale-in premium-reveal group">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden relative shadow-2xl shadow-primary/20 group-hover:shadow-3xl group-hover:shadow-primary/30 transition-all duration-500 transform group-hover:scale-[1.02] elegant-hover">
                  {/* Carousel with real salon photos */}
                  <div className="relative w-full h-full group">
                    <div 
                      className="flex transition-transform duration-500 ease-in-out h-full"
                      style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                    >
                      <div className="min-w-full h-full">
                        <img 
                          src="/lovable-uploads/ed8f100e-1c03-44d7-b811-f0fce045d875.png"
                          alt="Coupe dégradée classique" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-full h-full">
                        <img 
                          src="/lovable-uploads/1a99e796-3589-4843-a0bd-9fb830318a14.png"
                          alt="Coupe moderne avec dégradé" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-full h-full">
                        <img 
                          src="/lovable-uploads/8ca30b87-12b4-487c-8020-a9a2ba8489bb.png"
                          alt="Coupe avec barbe taillée" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-full h-full">
                        <img 
                          src="/lovable-uploads/bdb68e6b-1596-4638-8a4e-0fd01454d7f6.png"
                          alt="Dégradé progressif avec barbe" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-full h-full">
                        <img 
                          src="/lovable-uploads/51c99a7e-454a-4acb-a0fc-73b5b1f86b08.png"
                          alt="Coupe précise avec finitions" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    
                    {/* Navigation arrows */}
                    <button 
                      onClick={prevSlide}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70"
                    >
                      ‹
                    </button>
                    <button 
                      onClick={nextSlide}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70"
                    >
                      ›
                    </button>
                    
                    {/* Carousel dots */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {Array.from({ length: totalSlides }).map((_, index) => (
                        <div
                          key={index}
                          onClick={() => goToSlide(index)}
                          className={`w-2 h-2 rounded-full cursor-pointer transition-colors ${
                            currentSlide === index ? 'bg-white/80' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-10 left-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl opacity-60"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-accent/10 rounded-full blur-3xl opacity-40"></div>
          <div className="absolute top-1/2 left-0 w-1 h-32 bg-gradient-to-b from-transparent via-primary/30 to-transparent transform -translate-y-1/2"></div>
        </section>
        
        {/* Booking Form Section - TEMPORAIREMENT MASQUÉE */}
        {/* 
        <section className="relative py-20 bg-gradient-to-r from-sea-light to-white dark:from-sea-dark dark:to-background overflow-hidden">
          <div className="container relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in">
                <span className="text-sm text-primary font-medium uppercase tracking-wider">
                  {t.home.booking.subtitle}
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">
                  {t.home.booking.title}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {t.home.booking.description}
                </p>
                <ul className="space-y-3 mb-8">
                  {t.home.booking.benefits.map((item, index) => (
                    <li key={index} className="flex items-center">
                      <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3">
                        <ArrowRight className="h-3 w-3" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              
              <BookingForm />
            </div>
          </div>
          
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
            <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-primary/50 blur-3xl" />
            <div className="absolute bottom-10 right-40 w-48 h-48 rounded-full bg-sea-light blur-3xl" />
          </div>
        </section>
        */}
        
        {/* Featured Services */}
        <section id="services-section" className="section">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-12 fade-in-up premium-reveal">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text text-reveal">
                <span style={{"--delay": 1} as React.CSSProperties}>{t.home.featuredApartments.title.split(' ')[0]}</span>{' '}
                <span style={{"--delay": 2} as React.CSSProperties}>{t.home.featuredApartments.title.split(' ').slice(1).join(' ')}</span>
              </h2>
              <p className="text-muted-foreground">
                {t.home.featuredApartments.description}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredServices.map((service, index) => (
                <div key={service.id} className="fade-in-up premium-reveal elegant-hover" style={{ animationDelay: `${(index + 1) * 100}ms` }}>
                  <ApartmentCard apartment={service} />
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Button asChild className="btn-primary elegant-hover">
                <Link to="/apartments">
                  {t.home.featuredApartments.viewAll} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <TestimonialsSection />
        
        {/* Features Section */}
        <section className="section bg-card">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-12 fade-in-up">
              <span className="text-sm text-primary font-medium uppercase tracking-wider">
                {t.home.amenities.subtitle}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
                {t.home.amenities.title}
              </h2>
              <p className="text-muted-foreground">
                Découvrez nos atouts qui font la différence.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="glass-card p-6 rounded-xl scale-in flex flex-col items-center text-center"
                  style={{ animationDelay: `${(index + 1) * 100}ms` }}
                >
                  <div className="mb-4 p-3 rounded-full bg-primary/10">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="relative py-24 bg-primary/5">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center scale-in">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {t.home.cta.title}
              </h2>
              <p className="text-muted-foreground mb-8">
                {t.home.cta.description}
              </p>
              {/* RÉSERVATION TEMPORAIREMENT DÉSACTIVÉE */}
              {/* <Button asChild size="lg" className="btn-primary">
                <Link to="/booking">{t.home.cta.bookNow}</Link>
              </Button> */}
            </div>
          </div>
          
          {/* Decorative waves */}
          <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden">
            <svg 
              className="absolute bottom-0 w-full h-24 fill-background"
              preserveAspectRatio="none"
              viewBox="0 0 1440 74"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M0,37.1L40,34.5C80,32,160,27,240,29.6C320,32,400,42,480,42.9C560,44,640,35,720,32.1C800,30,880,34,960,40.8C1040,47,1120,56,1200,56.6C1280,57,1360,48,1400,43.3L1440,39.1L1440,74L1400,74C1360,74,1280,74,1200,74C1120,74,1040,74,960,74C880,74,800,74,720,74C640,74,560,74,480,74C400,74,320,74,240,74C160,74,80,74,40,74L0,74Z"
                className="animate-wave opacity-50"
              />
              <path 
                d="M0,37.1L40,34.5C80,32,160,27,240,29.6C320,32,400,42,480,42.9C560,44,640,35,720,32.1C800,30,880,34,960,40.8C1040,47,1120,56,1200,56.6C1280,57,1360,48,1400,43.3L1440,39.1L1440,74L1400,74C1360,74,1280,74,1200,74C1120,74,1040,74,960,74C880,74,800,74,720,74C640,74,560,74,480,74C400,74,320,74,240,74C160,74,80,74,40,74L0,74Z"
                className="animate-wave opacity-100 [animation-delay:-4s]"
              />
            </svg>
          </div>
        </section>
      </main>
      
      <Footer />
      <ScrollToTop />
    </div>
  );
}
