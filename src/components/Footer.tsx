import { Facebook, Instagram, MapPin, Clock, Phone } from "lucide-react";
import logo from "@/assets/logo.png";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-card border-t border-border/30">
      {/* Main footer content */}
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {/* Logo and social */}
          <div className="flex flex-col items-center text-center">
            <img src={logo} alt="La Barbe à Papa" className="h-20 invert mb-6" />
            <p className="text-muted-foreground text-sm mb-6">
              Votre barbier de confiance depuis 2022
            </p>
            <div className="flex space-x-6">
              <a 
                href="https://www.facebook.com/profile.php?id=100082968710739&locale=fr_FR" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-link"
              >
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </a>
              <a 
                href="https://www.instagram.com/salon_labarbeapapa/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-link"
              >
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>

          {/* Address */}
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-2 text-primary mb-4">
              <MapPin className="h-5 w-5" />
              <h4 className="text-lg font-semibold uppercase tracking-wider">Adresse</h4>
            </div>
            <div className="text-muted-foreground">
              <p>Rue de Jace 189</p>
              <p>4101 Jemeppe-sur-Meuse</p>
              <p className="mt-2">Belgique</p>
            </div>
          </div>

          {/* Hours */}
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-2 text-primary mb-4">
              <Clock className="h-5 w-5" />
              <h4 className="text-lg font-semibold uppercase tracking-wider">Horaires</h4>
            </div>
            <div className="text-muted-foreground space-y-1">
              <p>Mardi - Samedi</p>
              <p className="text-foreground font-semibold text-lg">10h - 19h</p>
              <p className="text-sm mt-3">
                Fermé dimanche & lundi
              </p>
              <p className="text-sm">
                Fermé les jours fériés
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border/30">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">
              © {currentYear} La Barbe à Papa. Tous droits réservés.
            </p>
            <p className="text-muted-foreground text-sm">
              Sans rendez-vous • Parking facile
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
