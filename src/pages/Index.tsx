import { useEffect, useRef } from "react";
import atelierBody from "@/atelier/atelier-body.html?raw";
import atelierCss from "@/atelier/atelier-reference.css?raw";
import atelierScene from "@/atelier/atelier-scene.js?raw";
import atelierSite from "@/atelier/atelier-site.js?raw";

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
    referenceStyle.textContent = atelierCss;
    document.head.appendChild(referenceStyle);

    const sceneScript = document.createElement("script");
    sceneScript.dataset.atelierScript = "scene";
    sceneScript.textContent = atelierScene;
    document.body.appendChild(sceneScript);

    const siteScript = document.createElement("script");
    siteScript.dataset.atelierScript = "site";
    siteScript.textContent = atelierSite;
    document.body.appendChild(siteScript);

    const anchorFrame = window.requestAnimationFrame(() => {
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

    return () => {
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

  return <div ref={rootRef} dangerouslySetInnerHTML={{ __html: atelierBody }} />;
}
