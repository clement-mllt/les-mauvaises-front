"use client"; // 🔥 IMPORTANT : Assure que ce hook s'exécute uniquement côté client

import {useEffect} from "react";
import Lenis from "@studio-freight/lenis";

export default function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2, // Contrôle la durée du scroll
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Animation fluide
      wheelMultiplier: 1, // Ajuste la sensibilité de la molette
      touchMultiplier: 2, // Ajuste la sensibilité tactile
      smoothWheel: true, // Active le scroll fluide avec la molette
      syncTouch: true, // Synchronise le scroll sur mobile
      orientation: "vertical", // Scroll uniquement en vertical
      gestureOrientation: "vertical", // Évite le scroll horizontal accidentel
      infinite: false, // Désactive le scroll infini
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);
}
