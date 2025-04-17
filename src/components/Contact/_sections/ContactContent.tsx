"use client";
import style from "@/app/styles/components/Pages/Contact/Contact.module.scss"; // SCSS facultatif
import React, {useEffect, useRef, useState} from "react";
import {MadeSoulmaze, LesMauvaises, Quicksand} from "@/utils/fonts";
import CardForm from "@/components/Contact/componenents/CardForm";
import {showElement} from "../utils/showElement";
import {animateDatePicker} from "@/components/Contact/utils/animateDatePicker";
import {calendarHandler} from "@/components/Contact/utils/calendarHandler";
import {notionHandler} from "../utils/notionHandler";
import {openCard} from "@/components/Contact/utils/openCard";
import LineErase from "@/components/Icons/LineErase";
import gsap from "gsap";
import {Draggable, DrawSVGPlugin, SplitText} from "gsap/all";
import {
  colors,
  getCurrentColorIndex,
  setCurrentColorIndex,
} from "@/utils/animationColors";
import {
  switchColor,
  setupMenuAnimation,
  updateChosenColorsForElements,
} from "@/utils/animationMenuHandler";
import Button from "@/components/Button/MultiLayerButton";

export const ContactContent = () => {
  const LineContentRef = useRef<HTMLElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const textContentRef = useRef<HTMLHeadingElement>(null);
  const specialTextRef = useRef<HTMLSpanElement>(null);
  const currentColorIndex: number = getCurrentColorIndex();
  const [selectedCardForm, setSelectedCardForm] = useState<string | null>(null);

  // Nouveau ref pour le conteneur de la card form
  const cardWrapperRef = useRef<HTMLDivElement>(null);
  const cardAnimationTL = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    // COLOR CHECKER
    const tl = showElement({
      LineContentRef: LineContentRef as React.RefObject<HTMLElement>,
      textContentRef: textContentRef as React.RefObject<HTMLElement>,
      specialTextRef: specialTextRef as React.RefObject<HTMLElement>,
      buttonsRef: buttonsRef as React.RefObject<HTMLElement>,
      colors,
      currentColorIndex,
    });

    return () => {
      tl.kill();
    };
  }, []);

  // Animation d'apparition quand la carte est affichée
  useEffect(() => {
    if (selectedCardForm) {
      if (cardWrapperRef.current) {
        openCard({
          selectedCardForm,
          cardWrapperRef: cardWrapperRef as React.RefObject<HTMLDivElement>,
          cardAnimationTL,
        });

        if (selectedCardForm === "reservedMeet") {
          const dayContainer = cardWrapperRef.current?.firstChild?.firstChild
            ?.childNodes[1].childNodes[1].childNodes[0]
            .firstChild as HTMLElement;
          const monthContainer = cardWrapperRef.current?.firstChild?.firstChild
            ?.childNodes[1].childNodes[1].childNodes[1]
            .firstChild as HTMLElement;
          const yearContainer = cardWrapperRef.current?.firstChild?.firstChild
            ?.childNodes[1].childNodes[1].childNodes[2]
            .firstChild as HTMLElement;

          if (dayContainer && monthContainer) {
            animateDatePicker(
              {
                daysContainer: dayContainer as HTMLElement,
                monthsContainer: monthContainer as HTMLElement,
                yearsContainer: yearContainer as HTMLElement,
              },
              (selectedDate: {day?: string; month?: string}) => {
                notionHandler.initNotionClient(
                  {day: selectedDate.day, month: selectedDate.month},
                  cardWrapperRef as React.RefObject<HTMLDivElement>
                );
                // calendarHandler(
                //   {day: selectedDate.day, month: selectedDate.month},
                //   cardWrapperRef as React.RefObject<HTMLDivElement>
                // );
              }
            );
          }
        }
      }
    }
  }, [selectedCardForm]);

  // Fonction pour fermer la carte via une animation inversée
  const handleOverlayClick = () => {
    if (cardAnimationTL.current) {
      cardAnimationTL.current.reverse();
      cardAnimationTL.current.eventCallback("onReverseComplete", () => {
        setSelectedCardForm(null);
      });
    } else {
      setSelectedCardForm(null);
    }
  };

  return (
    <div className={style.container}>
      <div className={style.containerTitle}>
        <h1 ref={textContentRef} className={MadeSoulmaze.className}>
          Tu veux{" "}
          <b ref={LineContentRef}>
            <LineErase />
            notre num ?
          </b>
        </h1>
      </div>
      <div className={style.containerSpecialText}>
        <span ref={specialTextRef} className={LesMauvaises.className}>
          Nous Pécho ?
        </span>
      </div>
      <div ref={buttonsRef} className={style.containerButton}>
        <Button
          text="On s'attrape"
          outerBgColor={colors[currentColorIndex]}
          innerBgColor="#28282d"
          outerHoverBgColor="#FF8C66"
          innerHoverBgColor="#D1415C"
          textColor="#FFFFFF"
          textHoverColor="#FFFFFF"
          showArrow={true}
          onClick={() => setSelectedCardForm("contactMail")}
        />
        <Button
          text="Meet"
          outerBgColor={colors[currentColorIndex]}
          innerBgColor="#28282d"
          outerHoverBgColor="#FF8C66"
          innerHoverBgColor="#D1415C"
          textColor="#FFFFFF"
          textHoverColor="#FFFFFF"
          showArrow={true}
          onClick={() => setSelectedCardForm("reservedMeet")}
        />
      </div>
      {selectedCardForm && (
        // Overlay qui couvre tout l'écran et qui, au clic, ferme la carte
        <div className={style.cardOverlay} onClick={handleOverlayClick}>
          <div className={style.overlay}></div>
          {/* On arrête la propagation pour empêcher la fermeture en cliquant sur la carte */}
          <div ref={cardWrapperRef} onClick={(e) => e.stopPropagation()}>
            <CardForm
              setSelectedCardForm={setSelectedCardForm}
              cardAnimationTL={cardAnimationTL}
              variant={selectedCardForm}
            />
          </div>
        </div>
      )}
    </div>
  );
};
