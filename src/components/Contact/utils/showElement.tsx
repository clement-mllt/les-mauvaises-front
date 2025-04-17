import React from "react";
import gsap from "gsap";
import {SplitText} from "gsap/all";
// Assurez-vous d'importer votre fonction de mise à jour des couleurs
import {updateChosenColorsForElements} from "@/utils/animationMenuHandler";

export type ShowElementParams = {
  LineContentRef: React.RefObject<HTMLElement>;
  textContentRef: React.RefObject<HTMLElement>;
  specialTextRef: React.RefObject<HTMLElement>;
  buttonsRef: React.RefObject<HTMLElement>;
  colors: string[];
  currentColorIndex: number;
};

export const showElement = ({
  LineContentRef,
  textContentRef,
  specialTextRef,
  buttonsRef,
  colors,
  currentColorIndex,
}: ShowElementParams) => {
  // Création de la timeline GSAP
  const tl = gsap.timeline();

  if (LineContentRef.current) {
    // On récupère l'élément SVG enfant
    const svgElement = LineContentRef.current.childNodes[0] as SVGSVGElement;
    // Sélectionne tous les chemins du SVG
    const svgElementPaths = svgElement?.querySelectorAll("path");
    // Références aux éléments contenant le texte
    const title = textContentRef.current;
    const specialText = specialTextRef.current;
    // Création d'une instance SplitText pour découper le texte
    const splitTitle = new SplitText(title, {type: "chars, words"});
    const splitSpecialText = new SplitText(specialText, {type: "chars, words"});
    // Récupération des boutons (childNodes de buttonsRef)
    const buttons = buttonsRef.current?.childNodes;

    // Mise à jour des couleurs sur les éléments SVG et le texte spécial
    updateChosenColorsForElements(
      Array.from(svgElementPaths).map((path) => path as unknown as HTMLElement),
      "stroke",
      {blackWhite: false}
    );
    updateChosenColorsForElements(
      splitSpecialText.chars as HTMLElement[],
      "color",
      {blackWhite: false}
    );

    // Construction de la timeline avec GSAP
    tl.set(svgElementPaths, {
      drawSVG: "0% 0%",
      stroke: colors[currentColorIndex],
      ease: "power1.inOut",
    })
      .set(buttons ? Array.from(buttons) : [], {
        backgroundColor: colors[currentColorIndex],
      })
      .from(splitTitle.chars, {
        opacity: 0,
        y: 100,
        duration: 0.5,
        stagger: 0.05,
        ease: "expo.out",
      })
      .to(svgElementPaths, {
        drawSVG: "0% 100%",
        opacity: 1,
        duration: 0.5,
        stroke: colors[currentColorIndex],
        ease: "power1.inOut",
      })
      .from(
        splitSpecialText.chars,
        {
          opacity: 0,
          y: 100,
          duration: 0.3,
          stagger: 0.03,
          ease: "expo.out",
        },
        "-=0.5"
      )
      .to(
        splitSpecialText.chars,
        {
          rotate: "5deg",
          duration: 0.3,
          stagger: 0.02,
          ease: "expo.out",
        },
        "-=0.4"
      )
      .fromTo(
        buttons ? (Array.from(buttons) as HTMLElement[]) : [],
        {opacity: 0, y: 100, duration: 0.3, stagger: 0.03},
        {
          opacity: 1,
          y: 0,
          duration: 0.3,
          stagger: 0.03,
          ease: "expo.out",
        },
        "-=0.4"
      );
  }

  return tl;
};
