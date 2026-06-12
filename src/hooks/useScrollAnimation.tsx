import { useEffect, useState } from 'react';

const SELECTOR = '.fade-in-up, .scale-in, .premium-reveal, .text-reveal, .scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale';

export const useScrollAnimation = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observed = new WeakSet<Element>();

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const observeAll = () => {
      document.querySelectorAll(SELECTOR).forEach((el) => {
        if (!observed.has(el)) {
          observed.add(el);
          io.observe(el);
        }
      });
    };

    observeAll();

    // Watch for lazy-loaded / Suspense-mounted elements
    const mo = new MutationObserver(() => observeAll());
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return { isVisible };
};
