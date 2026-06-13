import { useEffect, useRef, useState, useCallback } from "react";
import { Scissors, X, ChevronLeft, ChevronRight } from "lucide-react";

export type GalleryImage = {
  src: string;
  alt: string;
  placeholder?: boolean;
};

interface Props {
  images: GalleryImage[];
}

const SPEED_PX_PER_SEC = 40; // slow, smooth

export default function GalleryCarousel({ images }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const lastTsRef = useRef<number | null>(null);
  const pausedRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  // Duplicate list for seamless loop
  const loopImages = [...images, ...images];

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const track = trackRef.current;
    if (!track) return;

    const step = (ts: number) => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;

      if (!pausedRef.current && lightboxIndex === null) {
        offsetRef.current += SPEED_PX_PER_SEC * dt;
        const halfWidth = track.scrollWidth / 2;
        if (halfWidth > 0 && offsetRef.current >= halfWidth) {
          offsetRef.current -= halfWidth;
        }
        track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTsRef.current = null;
    };
  }, [reducedMotion, lightboxIndex, images.length]);

  const onMouseEnter = () => {
    pausedRef.current = true;
  };
  const onMouseLeave = () => {
    pausedRef.current = false;
  };

  const openLightbox = (idx: number) => setLightboxIndex(idx % images.length);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const next = useCallback(
    () => setLightboxIndex((i) => (i === null ? null : (i + 1) % images.length)),
    [images.length]
  );
  const prev = useCallback(
    () =>
      setLightboxIndex((i) =>
        i === null ? null : (i - 1 + images.length) % images.length
      ),
    [images.length]
  );

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, closeLightbox, next, prev]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) {
      if (dx < 0) next();
      else prev();
    }
    touchStartX.current = null;
  };

  return (
    <>
      <div
        ref={containerRef}
        role="region"
        aria-label="Galerie des coupes"
        className="overflow-hidden"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div
          ref={trackRef}
          className="flex gap-3 md:gap-4 will-change-transform"
          style={{ width: "max-content" }}
        >
          {loopImages.map((img, i) => {
            const realIdx = i % images.length;
            return (
              <button
                key={i}
                type="button"
                onClick={() => openLightbox(realIdx)}
                className="group relative shrink-0 overflow-hidden rounded-xl shadow-md transition-all duration-300 hover:shadow-xl md:hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary"
                style={{
                  width: "min(82vw, 280px)",
                  aspectRatio: "3/4",
                }}
                aria-label={`Ouvrir ${img.alt}`}
              >
                {img.placeholder ? (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-muted text-muted-foreground">
                    <Scissors className="h-8 w-8 text-primary" />
                    <span className="text-xs uppercase tracking-widest">
                      Photo à uploader
                    </span>
                  </div>
                ) : (
                  <img
                    src={img.src}
                    alt={img.alt}
                    loading="lazy"
                    className="w-full h-full object-cover"
                    style={{ objectPosition: "top" }}
                    onError={(e) => {
                      const t = e.currentTarget;
                      t.style.display = "none";
                      const p = t.parentElement;
                      if (p && !p.querySelector(".fallback")) {
                        const div = document.createElement("div");
                        div.className =
                          "fallback w-full h-full flex flex-col items-center justify-center gap-2 bg-muted text-muted-foreground";
                        div.innerHTML =
                          '<span class="text-xs uppercase tracking-widest">Photo à uploader</span>';
                        p.appendChild(div);
                      }
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Manual arrows for reduced motion users */}
      {reducedMotion && (
        <div className="flex justify-center gap-3 mt-4">
          <button
            type="button"
            onClick={() => {
              const t = trackRef.current;
              if (!t) return;
              offsetRef.current = Math.max(0, offsetRef.current - 300);
              t.style.transform = `translate3d(${-offsetRef.current}px,0,0)`;
            }}
            className="p-2 border border-primary/40 rounded-full text-primary hover:bg-primary/10"
            aria-label="Précédent"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => {
              const t = trackRef.current;
              if (!t) return;
              offsetRef.current += 300;
              const halfWidth = t.scrollWidth / 2;
              if (offsetRef.current >= halfWidth) offsetRef.current -= halfWidth;
              t.style.transform = `translate3d(${-offsetRef.current}px,0,0)`;
            }}
            className="p-2 border border-primary/40 rounded-full text-primary hover:bg-primary/10"
            aria-label="Suivant"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center animate-fade-in"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Visionneuse photo"
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Fermer"
          >
            <X className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-2 md:left-6 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Précédent"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-2 md:right-6 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Suivant"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div
            className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {images[lightboxIndex].placeholder ? (
              <div className="w-[60vw] h-[70vh] max-w-[600px] flex flex-col items-center justify-center gap-3 bg-muted text-muted-foreground rounded-xl">
                <Scissors className="h-12 w-12 text-primary" />
                <span className="text-sm uppercase tracking-widest">
                  Photo à uploader
                </span>
              </div>
            ) : (
              <img
                src={images[lightboxIndex].src}
                alt={images[lightboxIndex].alt}
                className="max-h-[90vh] max-w-[90vw] object-contain"
              />
            )}
          </div>

          <div className="absolute bottom-4 left-0 right-0 text-center text-white/90 text-sm tracking-widest">
            {lightboxIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
