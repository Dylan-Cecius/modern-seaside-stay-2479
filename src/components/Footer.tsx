
import { Link } from "react-router-dom";
import { Facebook, Instagram, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-black text-white pt-16 pb-8 border-t border-primary/20">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
          <div className="text-center">
            <h4 className="text-xl font-bold mb-4 text-primary">Nos réseaux</h4>
            <div className="flex space-x-4 justify-center">
              <a href="https://www.facebook.com/profile.php?id=100082968710739&locale=fr_FR" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-primary transition-colors">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="https://www.instagram.com/salon_labarbeapapa/" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-primary transition-colors">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>
          
          <div className="text-center">
            <h4 className="text-xl font-bold mb-4 text-primary">{t.footer.contact}</h4>
            <div className="text-white/70">
              Rue de jace 189<br />
              4101 Jemeppe-sur-Meuse<br />
              Belgique
            </div>
          </div>
          
          <div className="text-center">
            <h4 className="text-xl font-bold mb-4 text-primary">Horaires</h4>
            <div className="text-white/70 space-y-1">
              <p>Mardi - Samedi</p>
              <p className="font-semibold text-white">10h - 19h</p>
              <p className="text-sm mt-2">
                Fermé dimanche & lundi<br />
                Fermé les jours fériés
              </p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-primary/20 pt-8 mt-8 text-center text-white/70">
          <p>&copy; 2022 La Barbe à Papa. {t.footer.allRights}</p>
        </div>
      </div>
    </footer>
  );
}
