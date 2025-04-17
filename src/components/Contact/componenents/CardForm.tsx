"use client";
import React, {useEffect, useState} from "react";
import {gsap} from "gsap";
import style from "@/app/styles/components/Pages/Contact/CardForm.module.scss";
import Image from "next/image";
import amoureux from "../../../../public/tarot/amoureux.png";
import etoile from "../../../../public/tarot/etoile.png";
import roueDeLaFortune from "../../../../public/tarot/roue-de-la-fortune.png";
import {MadeSoulmaze, LesMauvaises, Quicksand} from "@/utils/fonts";
import Form from "next/form";

import Button from "@/components/Button/MultiLayerButton";
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
import {notionHandler} from "../utils/notionHandler";

const images = {
  amoureux,
  etoile,
  roueDeLaFortune,
} as const;

type ImageKeys = keyof typeof images;
const getRandomImage = () => {
  const keys = Object.keys(images) as ImageKeys[];
  return images[keys[Math.floor(Math.random() * keys.length)]];
};

export type FormCardProps = {
  setSelectedCardForm: React.Dispatch<React.SetStateAction<string | null>>;
  cardAnimationTL: gsap.core.Timeline | null;
  variant: string;
};

const FormCard: React.FC<FormCardProps> = ({
  setSelectedCardForm,
  cardAnimationTL,
  variant,
}) => {
  const currentColorIndex = getCurrentColorIndex();
  const textErrorRef = React.useRef<HTMLParagraphElement>(null);
  const cardContentRef = React.useRef<HTMLDivElement>(null);
  const cardMeetRef = React.useRef<HTMLDivElement>(null);
  const cardContactRef = React.useRef<HTMLDivElement>(null);
  const currentDateRef = React.useRef<HTMLDivElement>(null);

  // État et handlers pour le formulaire
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    detail: "",
    entreprise: "",
    secteur: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {name, value} = e.target;
    setFormData((prev) => ({...prev, [name]: value}));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          recipientEmail: formData.email, // on n’envoie plus name/message ici
        }),
      });
      const result = await res.json();
      if (result.success) {
        if (cardAnimationTL && cardAnimationTL.current) {
          cardAnimationTL.current.reverse();
          cardAnimationTL.current.eventCallback("onReverseComplete", () => {
            setSelectedCardForm(null);
          });
        }

        // ICI ON ENVOIE SUR NOTION L'INFORMATION DU FORMULAIRE

        setFormData({name: "", email: "", phone: "", detail: ""});

        // Send form data and selected slot to Notion
        await notionHandler.createEventInNotion({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          detail: formData.detail,
          slot: notionHandler.selectedSlot,
        });

        // createEventInNotion()
      } else {
        console.error("Erreur lors de l'envoi", result.error);
      }
    } catch (err) {
      console.error("Erreur réseau :", err);
    }
  };

  // Fonction de réservation de créneau (inchangée)
  function isCurrentTimeInOrAfterSlot(selectedSlot: any) {
    const now = new Date();
    const day = selectedSlot.date.day;
    const month = notionHandler.getMonthNumber(selectedSlot.date.month);
    const year = now.getFullYear();
    const slotStart = new Date(`${year}-${month}-${day}`);
    const slotEnd = new Date(slotStart);
    const [start, end] = selectedSlot.hour.split(" - ");
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    slotStart.setHours(sh, sm, 0, 0);
    slotEnd.setHours(eh, em, 0, 0);
    const oneHourBefore = new Date(slotStart);
    oneHourBefore.setHours(slotStart.getHours() - 1);

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const slotDay = new Date(
      slotStart.getFullYear(),
      slotStart.getMonth(),
      slotStart.getDate()
    );
    if (today.getTime() === slotDay.getTime()) {
      return {message: "Indisponible le jour même.", canMeet: false};
    }
    if (now >= slotStart && now <= slotEnd) {
      return {message: "Le créneau est déjà passé.", canMeet: false};
    }
    if (now > slotEnd) {
      return {message: "Le créneau est déjà passé.", canMeet: false};
    }
    if (now >= oneHourBefore && now < slotStart) {
      return {message: "Trop tard pour prendre le créneau.", canMeet: false};
    }
    return {message: "Le créneau est disponible.", canMeet: true};
  }

  type SelectedSlot = {
    date: {
      day: number;
      month: string;
    };
    hour: string;
  };

  const ButtonActiveData = () => {
    const slots = document.querySelectorAll(`.${style.slot}`);
    const hasActive = Array.from(slots).some(
      (s) => (s as HTMLElement).dataset.state === "active"
    );
    const tl = gsap.timeline();
    if (!hasActive) {
      textErrorRef.current!.innerText = "Veuillez sélectionner un créneau";
      gsap.from(textErrorRef.current, {opacity: 0, y: 20, duration: 0.3});
      return;
    }
    Array.from(slots).forEach((slot) => {
      if ((slot as HTMLElement).dataset.state === "active") {
        const selectedSlot = notionHandler.selectedSlot as SelectedSlot;
        const slotInfo = isCurrentTimeInOrAfterSlot(selectedSlot);
        if (slotInfo.canMeet) {
          currentDateRef.current!.innerText = `${selectedSlot.date.day} ${selectedSlot.date.month} 2025 à ${selectedSlot.hour}`;
          tl.set(currentDateRef.current, {color: colors[currentColorIndex]})
            .to(cardContentRef.current, {
              rotateY: 180,
              duration: 1.2,
              ease: "back.inOut",
            })
            .to(
              cardContactRef.current,
              {opacity: 1, zIndex: 1, duration: 0.05},
              "-=0.6"
            )
            .to(
              cardMeetRef.current,
              {opacity: 0, zIndex: 0, duration: 0.05},
              "-=0.6"
            );
        } else {
          textErrorRef.current!.innerText = slotInfo.message;
          gsap.from(textErrorRef.current, {opacity: 0, y: 20, duration: 0.3});
        }
      }
    });
  };
  return (
    <>
      {variant === "reservedMeet" && (
        <div className={style.card}>
          <div ref={cardContentRef} className={style.cardContent}>
            <div className={style.front}>
              <Image
                src={getRandomImage()}
                alt="Tarot Card"
                width={1000}
                height={1000}
                className={style.image}
              />
            </div>
            <div ref={cardMeetRef} className={style.back}>
              <div>
                <h3 className={MadeSoulmaze.className}>Réserve ton créneau</h3>
                <p className={Quicksand.className}>
                  Et si on se faisait une petite visio pour parler de ton projet
                  ? Tu verras, on est sympas. Pas de blabla ni de chichi ici. On
                  prend le temps de comprendre ton idée, de discuter de tes
                  besoins, et de te guider avec transparence. Si tu y crois, on
                  y croit aussi. Ton projet ? On l’aborde comme si c’était le
                  nôtre.
                </p>
              </div>
              <div className={style.dateWrapper}>
                <div className={style.dateContainer}>
                  <div className={style.daysContainer}>
                    <div>01</div>
                    <div>02</div>
                    <div>03</div>
                    <div>04</div>
                    <div>07</div>
                    <div>08</div>
                    <div>09</div>
                    <div>10</div>
                    <div>11</div>
                    <div>14</div>
                    <div>15</div>
                    <div>16</div>
                    <div>17</div>
                    <div>18</div>
                    <div>21</div>
                    <div>22</div>
                    <div>23</div>
                    <div>24</div>
                    <div>25</div>
                    <div>28</div>
                    <div>29</div>
                    <div>30</div>
                  </div>
                </div>
                <div className={style.dateContainer}>
                  <div className={style.monthsContainer}>
                    <div>Janvier</div>
                    <div>Février</div>
                    <div>Mars</div>
                    <div>Avril</div>
                    <div>Mai</div>
                    <div>Juin</div>
                    <div>Juillet</div>
                    <div>Août</div>
                    <div>Septembre</div>
                    <div>Octobre</div>
                    <div>Novembre</div>
                    <div>Décembre</div>
                  </div>
                </div>
                <div className={style.dateContainer}>
                  <div className={style.yearContainer}>
                    <div>{new Date().getFullYear()}</div>
                  </div>
                </div>
              </div>
              <div className={style.timeContainer}>
                <div className={style.errorMessage}>
                  <p ref={textErrorRef}></p>
                </div>
                <div className={style.calendar}>
                  <div className={style.actualSlots}></div>
                </div>
              </div>
              <Button
                text="Let's go"
                outerBgColor={colors[currentColorIndex]}
                innerBgColor="#28282d"
                outerHoverBgColor="#FF8C66"
                innerHoverBgColor="#D1415C"
                textColor="#FFFFFF"
                textHoverColor="#FFFFFF"
                showArrow={true}
                onClick={() => ButtonActiveData()}
              />
            </div>
            <div ref={cardContactRef} className={style.back2}>
              <div>
                <h3 className={MadeSoulmaze.className}>Réserve ton créneau</h3>
                <p className={Quicksand.className}>
                  On aimerait quelques détails avant de te rencontrer
                </p>
              </div>
              <div className={style.dateWrapper}>
                <span ref={currentDateRef}></span>
              </div>

              <Form
                className={style.formContact}
                action="/api/send-email"
                onSubmit={handleSubmit}
              >
                <div>
                  <div>
                    <label className={MadeSoulmaze.className} htmlFor="name">
                      Ton prénom
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      placeholder="Le grand patron"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label className={MadeSoulmaze.className} htmlFor="email">
                      Ton Mail
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      placeholder="tesqui@mail.com"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label className={MadeSoulmaze.className} htmlFor="phone">
                      Ton numéro
                    </label>
                    <input
                      type="text"
                      name="phone"
                      id="phone"
                      placeholder="06 00 00 00 00"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label className={MadeSoulmaze.className} htmlFor="detail">
                      Un détail en plus
                    </label>
                    <textarea
                      name="detail"
                      id="detail"
                      placeholder="J'aimerais discuter de mon projet"
                      required
                      value={formData.detail}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <Button
                  text="Envoyer"
                  outerBgColor={colors[currentColorIndex]}
                  innerBgColor="#28282d"
                  outerHoverBgColor="#FF8C66"
                  innerHoverBgColor="#D1415C"
                  textColor="#FFFFFF"
                  textHoverColor="#FFFFFF"
                  showArrow={true}
                  type="submit"
                />
              </Form>
            </div>
          </div>
        </div>
      )}
      {variant === "contactMail" && (
        <div className={style.card}>
          <div ref={cardContentRef} className={style.cardContent}>
            <div className={style.front}>
              <Image
                src={getRandomImage()}
                alt="Tarot Card"
                width={1000}
                height={1000}
                className={style.image}
              />
            </div>
            <div ref={cardMeetRef} className={style.back}>
              <div>
                <h3 className={MadeSoulmaze.className}>On te raconte</h3>
                <p className={Quicksand.className}>
                  Parle nous de toi, on adore ça.
                </p>
              </div>
              <Form
                className={style.formContact}
                action="/api/send-email"
                onSubmit={handleSubmit}
              >
                <div className={style.contactCard}>
                  <div>
                    <label className={MadeSoulmaze.className} htmlFor="name">
                      Ton prénom
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      placeholder="Le grand patron"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label className={MadeSoulmaze.className} htmlFor="email">
                      Ton Mail
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      placeholder="tesqui@mail.com"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label className={MadeSoulmaze.className} htmlFor="phone">
                      Ton numéro
                    </label>
                    <input
                      type="text"
                      name="phone"
                      id="phone"
                      placeholder="06 00 00 00 00"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label
                      className={MadeSoulmaze.className}
                      htmlFor="entreprise"
                    >
                      Ton entreprise
                    </label>
                    <input
                      type="text"
                      name="entreprise"
                      id="entreprise"
                      placeholder="Best boite du monde"
                      value={formData.entreprise}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className={MadeSoulmaze.className} htmlFor="secteur">
                      Ton secteur
                    </label>
                    <input
                      type="text"
                      name="secteur"
                      id="secteur"
                      placeholder="Le monde de la musique"
                      value={formData.secteur}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className={MadeSoulmaze.className} htmlFor="what">
                      Ce que tu veux
                    </label>
                    <select name="what" id="what" aria-required="true">
                      <option value="Être riche et célèbre">
                        Être riche et célèbre
                      </option>
                      <option value="Création de site">Création de site</option>
                      <option value="Refonte de site">Refonte de site</option>
                      <option value="UI / UX">UI / UX</option>
                      <option value="Community Management">
                        Community Management
                      </option>
                      <option value="Identité graphique">
                        Identité graphique
                      </option>
                      <option value="Rédaction article de blog">
                        Rédaction article de blog
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className={MadeSoulmaze.className} htmlFor="detail">
                      Dit nous tout
                    </label>
                    <textarea
                      name="detail"
                      id="detail"
                      placeholder="On doit le nom de l'agence à la chanson de Werenoi. Elle est mauvaise, mauvaise.."
                      required
                      value={formData.detail}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <Button
                  text="Let's go"
                  outerBgColor={colors[currentColorIndex]}
                  innerBgColor="#28282d"
                  outerHoverBgColor="#FF8C66"
                  innerHoverBgColor="#D1415C"
                  textColor="#FFFFFF"
                  textHoverColor="#FFFFFF"
                  showArrow={true}
                  type="submit"
                />
              </Form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormCard;
