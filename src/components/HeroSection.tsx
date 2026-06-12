import logo from "@/assets/logo.png";

export default function HeroSection() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      id="hero-top"
      className="relative min-h-screen flex items-center"
      style={{
        backgroundImage:
          "linear-gradient(rgba(14,13,11,.55), rgba(14,13,11,.78) 70%, hsl(var(--background))), url('/lovable-uploads/74522104-fe6f-4229-8965-fa14fc763836.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container w-full text-center">


        <span className="eyebrow mb-6">Coiffeur Homme · Barbier à Liège</span>


        <h1
          className="hero-title mt-6"
          style={{ fontSize: "clamp(2.6rem, 6vw, 4.6rem)" }}
        >
          Votre Style,
          <br />
          <em className="italic font-medium" style={{ color: "hsl(var(--accent))" }}>
            Notre Passion
          </em>
        </h1>

        <p className="max-w-xl mx-auto mt-7 text-[1.02rem]" style={{ color: "hsl(var(--ivoire2))" }}>
          Votre coiffeur homme et barbier à Jemeppe-sur-Meuse. Barber shop moderne et chaleureux où
          tradition et modernité se rencontrent pour sublimer votre style.
        </p>

        <div className="mt-11 flex flex-wrap items-center justify-center gap-4">
          <button onClick={() => scrollTo("services-section")} className="btn-or">
            Découvrir nos services
          </button>
          <button onClick={() => scrollTo("contact")} className="btn-ghost">
            Nous trouver
          </button>
        </div>
      </div>

      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[0.7rem] uppercase text-muted-foreground"
        style={{ letterSpacing: "0.3em" }}
      >
        Mardi – Samedi · 10h – 19h
      </div>
    </header>
  );
}
