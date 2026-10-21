import { useEffect, useRef } from "react";
import atelierBody from "@/atelier/atelier-body.html?raw";
import atelierCss from "@/atelier/atelier-reference.css?raw";
import atelierScene from "@/atelier/atelier-scene.js?raw";
import atelierSite from "@/atelier/atelier-site.js?raw";
import bookingCtaCss from "@/atelier/booking-cta.css?raw";

declare global {
  interface Window {
    AtelierScene?: new (canvas: HTMLCanvasElement, container: HTMLElement) => {
      destroy: () => void;
      setMotion: (enabled: boolean) => void;
    };
    atelierScene?: {
      destroy: () => void;
      setMotion: (enabled: boolean) => void;
      debug?: { renderer?: string; triangles?: number; draws?: number };
    };
    atelierSiteDestroy?: () => void;
  }
}

export default function Index() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || root.dataset.initialized === "true") return;
    root.dataset.initialized = "true";

    const referenceStyle = document.createElement("style");
    referenceStyle.dataset.atelierStyle = "reference";
    referenceStyle.textContent = atelierCss + '\n' + bookingCtaCss;
    document.head.appendChild(referenceStyle);

    const sceneScript = document.createElement("script");
    sceneScript.dataset.atelierScript = "scene";
    sceneScript.textContent = atelierScene;
    document.body.appendChild(sceneScript);

    const siteScript = document.createElement("script");
    siteScript.dataset.atelierScript = "site";
    siteScript.textContent = atelierSite;
    document.body.appendChild(siteScript);

    let anchorFrame = 0;
    const anchorOuterFrame = window.requestAnimationFrame(() => {
      anchorFrame = window.requestAnimationFrame(() => {
      const hash = window.location.hash;
      if (!hash) {
        window.scrollTo(0, 0);
        return;
      }
      try {
        document.querySelector(hash)?.scrollIntoView();
      } catch {
        // Ignore malformed URL fragments.
      }
      });
    });

    return () => {
      window.cancelAnimationFrame(anchorOuterFrame);
      window.cancelAnimationFrame(anchorFrame);
      window.atelierSiteDestroy?.();
      window.atelierSiteDestroy = undefined;
      window.atelierScene?.destroy();
      window.atelierScene = undefined;
      window.AtelierScene = undefined;
      sceneScript.remove();
      siteScript.remove();
      referenceStyle.remove();
      document.body.classList.remove("locked");
      document.documentElement.classList.remove("page-paused");
      delete document.documentElement.dataset.motion;
      delete root.dataset.initialized;
    };
  }, []);

  const body = atelierBody.replace('</div>\n    </div>\n    <div class="hero-scene"', '</div><a class="booking-preview-cta" href="/reservation">Réserver un rendez-vous <svg aria-hidden="true"><use href="#arrow-ne"/></svg></a>\n    </div>\n    <div class="hero-scene"');
  return <div ref={rootRef} dangerouslySetInnerHTML={{ __html: body }} />;
}
