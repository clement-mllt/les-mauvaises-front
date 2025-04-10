// utils/animationHandler.js
import gsap from "gsap";
import {DrawSVGPlugin} from "gsap/DrawSVGPlugin";
import {SplitText} from "gsap/SplitText";
import {MorphSVGPlugin} from "gsap/MorphSVGPlugin"; // Assurez-vous d'importer MorphSVGPlugin si nécessaire
import {
  colors,
  getCurrentColorIndex,
  setCurrentColorIndex,
} from "./animationColors";

// Enregistrer les plugins (à faire une seule fois)
gsap.registerPlugin(DrawSVGPlugin, SplitText, MorphSVGPlugin);

/**
 * Change la couleur de l’icône, du burger et de la ligne du logo.
 * Les éléments (ou leurs refs) sont passés en paramètre.
 */
interface IconElement extends HTMLElement {
  querySelector: (selectors: string) => HTMLElement | null;
  querySelectorAll: (selectors: string) => NodeListOf<HTMLElement>;
}

interface FaviconElement extends HTMLElement {
  querySelector: (selectors: string) => HTMLElement | null;
  querySelectorAll: (selectors: string) => NodeListOf<HTMLElement>;
}

interface LogoElement extends HTMLElement {}

export function switchColor(
  favicon: FaviconElement,
  logo: LogoElement,
  active: boolean
): void {
  const currentColorIndex: number = getCurrentColorIndex();
  const nextIndex: number = (currentColorIndex + 1) % colors.length;

  setCurrentColorIndex(nextIndex);
  console.log(logo);

  const iconTimeline: gsap.core.Timeline = animationColor(
    favicon,
    nextIndex,
    active
  );

  //   const burgerTimeline: gsap.core.Timeline = changeBurgerColor(currentColorIndex, active);
  const lineLogoTimeline: gsap.core.Timeline = changeLineMorph(
    nextIndex,
    logo,
    active
  );

  iconTimeline.play();
  // burgerTimeline.play();
  lineLogoTimeline.play();
}

/**
 * Animation de changement de couleur pour l’icône.
 */
interface AnimationColorIcon extends HTMLElement {
  querySelector: (selectors: string) => HTMLElement | null;
  querySelectorAll: (selectors: string) => NodeListOf<HTMLElement>;
}

export function animationColor(
  icon: AnimationColorIcon,
  currentColorIndex: number,
  active: boolean
): gsap.core.Timeline {
  const tl: gsap.core.Timeline = gsap.timeline({paused: true});
  console.log(currentColorIndex);

  if (active) {
    tl.to(icon, {
      x: "-80px",
      rotate: -180,
      duration: 0.7,
      onComplete: () => {
        gsap.to(icon.querySelector("circle"), {
          fill: colors[currentColorIndex],
          duration: 0,
        });
        gsap.set(icon.querySelectorAll("path"), {
          fill: currentColorIndex === 0 ? "black" : "white",
        });
        gsap.to(icon.querySelector("svg"), {
          fill: currentColorIndex === 0 ? "black" : "white",
          duration: 0,
        });
      },
    }).to(icon, {
      x: 0,
      rotate: -360,
      duration: 0.7,
    });
  } else {
    gsap.set(icon.querySelector("circle"), {fill: colors[currentColorIndex]});
    gsap.set(icon.querySelectorAll("path"), {
      fill: currentColorIndex === 0 ? "black" : "white",
    });
    gsap.set(icon.querySelector("svg"), {
      fill: currentColorIndex === 0 ? "black" : "white",
    });
  }
  return tl;
}

/**
 * Animation pour modifier la forme de la ligne du logo.
 * Pour simplifier, ici nous utilisons document.querySelector pour récupérer certains éléments.
 * Selon vos besoins, vous pouvez modifier pour recevoir ces éléments via des refs.
 */

// Étendre l'interface Window pour inclure menuHandler
declare global {
  interface Window {
    menuHandler?: {isOpen: boolean};
  }
}

export function changeLineMorph(
  currentColorIndex: number,
  logo: any,
  active: boolean
): gsap.core.Timeline {
  const tl: gsap.core.Timeline = gsap.timeline({paused: true});
  // const logoElement: MainLogoElement | null = document.querySelector("#mainLogo");

  const {width, height}: DOMRect = logo.logoElement.getBoundingClientRect();

  if (logo.lineLogoElement) {
    logo.lineLogoElement.setAttribute("width", `${width + 50}`);
    logo.lineLogoElement.setAttribute("height", `${height}`);
  }

  if (active) {
    tl.to(
      logo.lineLogoPathElement,
      {
        drawSVG: window.menuHandler?.isOpen ? "0% 0%" : "0% 100%",
        opacity: 1,
        duration: 1,
        stroke: colors[currentColorIndex],
        ease: "power1.inOut",
      },
      "sync"
    )
      .to(
        logo.logoPathElement,
        {
          fill: (): string => {
            const index: number = getCurrentColorIndex();
            return window.menuHandler?.isOpen
              ? index === 0
                ? "white"
                : "#28282d"
              : colors[index];
          },
          duration: 0.5,
          ease: "power1.inOut",
        },
        "sync+=0.7"
      )
      .to(
        logo.lineLogoPathElement,
        {
          drawSVG: "0% 0%",
          duration: 0.5,
          opacity: 1,
          stroke: colors[currentColorIndex],

          ease: "power1.inOut",
          onComplete: (): void => {
            tl.to(logo.logoElement, {zIndex: -1, duration: 0});
          },
        },
        "sync+=1"
      );
  } else {
    tl.set(logo.logoPathElement, {
      fill: (): string => {
        const index: number = getCurrentColorIndex();
        return window.menuHandler?.isOpen
          ? index === 0
            ? "white"
            : "#28282d"
          : colors[index];
      },
      duration: 0,
      ease: "power1.inOut",
    });
  }
  return tl;
}

/**
 * Animation pour changer la couleur du burger.
 */
interface CirclePathElement extends SVGPathElement {
  morphSVG?: string;
}

interface CircleModelElement extends SVGCircleElement {}

export function changeBurgerColor(
  currentColorIndex: number,
  active: boolean
): gsap.core.Timeline {
  const tl: gsap.core.Timeline = gsap.timeline({paused: true});
  const circlePathElements = MorphSVGPlugin.convertToPath(
    "#circle-start"
  ) as SVGPathElement[];
  const circlePath: CirclePathElement =
    circlePathElements[0] as CirclePathElement;
  const circlePathEnd: CirclePathElement = MorphSVGPlugin.convertToPath(
    "#circle-end"
  )[0] as unknown as CirclePathElement;
  const circleModel: CircleModelElement | null = document.querySelector(
    ".circle-model svg circle"
  );

  if (active) {
    tl.set(circlePath, {
      fill: colors[currentColorIndex],
      morphSVG: circlePath,
    })
      .to(circlePath, {
        duration: 0.7,
        fill: colors[currentColorIndex],
        morphSVG: "#morph1",
      })
      .to(
        circlePath,
        {
          duration: 0.7,
          fill: colors[currentColorIndex],
          morphSVG: "#morph2",
        },
        "-=0.3"
      )
      .to(
        circlePath,
        {
          duration: 0.7,
          fill: colors[currentColorIndex],
          morphSVG: "#morph3",
        },
        "-=0.3"
      )
      .to(
        circlePath,
        {
          duration: 0.7,
          fill: colors[currentColorIndex],
          morphSVG: circlePathEnd,
        },
        "-=0.3"
      )
      .to(circleModel, {
        duration: 0.7,
        fill: colors[currentColorIndex],
      });
  } else {
    tl.set(circleModel, {fill: colors[currentColorIndex]});
  }
  return tl;
}
