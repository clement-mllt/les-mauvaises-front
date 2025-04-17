import React from "react";
import gsap from "gsap";
import {SplitText} from "gsap/all";
// Assurez-vous d'importer votre fonction de mise à jour des couleurs
import {updateChosenColorsForElements} from "@/utils/animationMenuHandler";

export const openCard = ({
  selectedCardForm,
  cardWrapperRef,
  cardAnimationTL,
}: {
  selectedCardForm: string | null;
  cardWrapperRef: React.RefObject<HTMLDivElement>;
  cardAnimationTL: React.MutableRefObject<gsap.core.Timeline | null>;
}) => {
  // Création de la timeline GSAP
  const tl = gsap.timeline();
  if (selectedCardForm && cardWrapperRef.current) {
    cardAnimationTL.current = gsap.timeline();
    cardAnimationTL.current
      .fromTo(
        cardWrapperRef.current?.firstChild as HTMLElement,
        {
          rotateX: 25,
          scale: 1.5,
        },
        {
          scale: 1,
          rotateX: 0,
          duration: 0.5,
          ease: "back",
        }
      )
      .to(
        cardWrapperRef.current?.firstChild,
        {
          top: "calc(50% - 380px)",
          duration: 0.5,
          ease: "power4.inOut",
          onComplete: () => {
            cardAnimationTL.current
              ?.to(
                cardWrapperRef.current?.firstChild?.firstChild as HTMLElement,
                {
                  rotateY: 540,
                  duration: 1.3,
                  ease: "back.inOut",
                },
                "sync"
              )
              .to(
                cardWrapperRef.current?.firstChild as HTMLElement,
                {
                  rotate: -3,
                  duration: 1.3,
                },
                "sync"
              );
          },
        },
        0
      );
  }

  return tl;
};
