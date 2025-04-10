// src/components/ScrollPinSections.tsx
"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const ScrollPinSections = () => {
  useEffect(() => {
    const sections = gsap.utils.toArray(".navStop");

    sections.forEach((section) => {
      ScrollTrigger.create({
        trigger: section as HTMLElement,
        start: "top top",
        end: "bottom+=500px top",
        pin: true,
        markers: true,
      });
    });

    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return null;
};
