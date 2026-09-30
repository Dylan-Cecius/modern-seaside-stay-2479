import { useEffect, useRef } from "react";
import atelierBody from "@/atelier/atelier-body.html?raw";
import atelierScene from "@/atelier/atelier-scene.js?raw";
import atelierSite from "@/atelier/atelier-site.js?raw";
import "@/atelier/atelier-reference.css";

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
  }
}

export default function Index() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || root.dataset.initialized === "true") return;
    root.dataset.initialized = "true";
    window.scrollTo(0, 0);

    const sceneScript = document.createElement("script");
    sceneScript.dataset.atelierScript = "scene";
    sceneScript.textContent = atelierScene;
    document.body.appendChild(sceneScript);

    const siteScript = document.createElement("script");
    siteScript.dataset.atelierScript = "site";
    siteScript.textContent = atelierSite;
    document.body.appendChild(siteScript);

    return () => {
      window.atelierScene?.destroy();
      window.atelierScene = undefined;
      sceneScript.remove();
      siteScript.remove();
      document.body.classList.remove("locked");
      document.documentElement.classList.remove("page-paused");
    };
  }, []);

  return <div ref={rootRef} dangerouslySetInnerHTML={{ __html: atelierBody }} />;
}
