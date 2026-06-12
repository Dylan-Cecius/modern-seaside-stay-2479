import { Facebook, Instagram } from "lucide-react";
import logo from "@/assets/logo.png";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      className="bg-background pt-16 pb-8 border-t"
      style={{ borderColor: "hsl(var(--primary) / 0.25)" }}
    >
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr] gap-10 text-center md:text-left">
          <div>
            <img src={logo} alt="La Barbe à Papa" className="h-16 invert mb-5 mx-auto md:mx-0" />
            <p className="text-muted-foreground text-[0.88rem]">
              Votre barbier de confiance depuis 2022
            </p>
            <div className="flex gap-4 mt-5 justify-center md:justify-start">
              <a
                href="https://www.facebook.com/profile.php?id=100082968710739&locale=fr_FR"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border flex items-center justify-center text-foreground/80 hover:text-primary hover:border-primary transition-all"
                style={{ borderColor: "hsl(var(--primary) / 0.25)" }}
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </a>
              <a
                href="https://www.instagram.com/salon_labarbeapapa/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border flex items-center justify-center text-foreground/80 hover:text-primary hover:border-primary transition-all"
                style={{ borderColor: "hsl(var(--primary) / 0.25)" }}
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
            </div>
          </div>

          <div>
            <h4
              className="text-primary text-[0.72rem] uppercase mb-4 font-medium"
              style={{ fontFamily: "Inter, sans-serif", letterSpacing: "0.3em" }}
            >
              Adresse
            </h4>
            <ul className="text-muted-foreground text-[0.88rem] space-y-1">
              <li>Rue de Jace 189</li>
              <li>4101 Jemeppe-sur-Meuse</li>
              <li>Belgique</li>
            </ul>
          </div>

          <div>
            <h4
              className="text-primary text-[0.72rem] uppercase mb-4 font-medium"
              style={{ fontFamily: "Inter, sans-serif", letterSpacing: "0.3em" }}
            >
              Horaires
            </h4>
            <ul className="text-muted-foreground text-[0.88rem] space-y-1">
              <li>Mardi – Samedi</li>
              <li>10h – 19h</li>
              <li>Fermé dimanche &amp; lundi</li>
              <li>Fermé les jours fériés</li>
            </ul>
          </div>
        </div>

        <div
          className="text-center text-muted-foreground text-[0.75rem] mt-14 pt-6 border-t"
          style={{ borderColor: "hsl(var(--muted-foreground) / 0.12)" }}
        >
          © {year} La Barbe à Papa. Tous droits réservés. · Sans rendez-vous • Parking facile
        </div>
      </div>
    </footer>
  );
}
