"use client";
import { useEffect } from 'react';

// Le hook accepte maintenant une référence en argument
const useScrollAnimation = (elementsRef: React.RefObject<(HTMLElement | null)[]>) => {
  useEffect(() => {
    // On attend que les éléments soient bien présents
    const elements = elementsRef.current;
    if (!elements || elements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            if (entry.target instanceof HTMLElement) {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
            }
          }, 100);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });

    elements.forEach(element => {
      if (element) {
        // On s'assure que l'élément est bien un HTMLElement avant de le manipuler
        if (element instanceof HTMLElement) {
          element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
          observer.observe(element);
        }
      }
    });

    // Nettoyage quand le composant est démonté
    return () => {
      elements.forEach(element => {
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [elementsRef]); // L'effet se redéclenchera si la référence change
};

export default useScrollAnimation;