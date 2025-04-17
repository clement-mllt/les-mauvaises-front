import React from "react";
import styles from "@/app/styles/components/Button.module.scss";
import ArrowRight from "@/components/Icons/ArrowRight";
import {
  colors,
  getCurrentColorIndex,
  setCurrentColorIndex,
} from "@/utils/animationColors";

import {MadeSoulmaze, LesMauvaises, Quicksand} from "@/utils/fonts";

interface MultiLayerButtonProps {
  /**
   * Le texte à afficher dans le bouton
   */
  text?: string;

  /**
   * Couleur de fond (bloc extérieur) pour l'état normal
   */
  outerBgColor?: string;

  /**
   * Couleur de fond (bloc intérieur) pour l'état normal
   */
  innerBgColor?: string;

  /**
   * Couleur de fond (bloc extérieur) au survol (hover)
   */
  outerHoverBgColor?: string;

  /**
   * Couleur de fond (bloc intérieur) au survol (hover)
   */
  innerHoverBgColor?: string;

  /**
   * Couleur du texte au repos
   */
  textColor?: string;

  /**
   * Couleur du texte au survol (hover)
   */
  textHoverColor?: string;

  /**
   * Afficher la flèche ou non
   */
  showArrow?: boolean;

  /**
   * Fonction à appeler au clic
   */
  onClick?: () => void;

  /**
   * Classe(s) additionnelle(s) si besoin
   */
  className?: string;
  /**
   * Type de bouton (submit ou button)
   */
  type?: "submit" | "button";
}

const MultiLayerButton: React.FC<MultiLayerButtonProps> = ({
  text = "ON S'ATTRAPE",
  outerBgColor = "#3c3c3c",
  innerBgColor = "#202020",
  outerHoverBgColor = "#505050",
  innerHoverBgColor = "#2d2d2d",
  textColor = "#ffffff",
  textHoverColor = "#ffffff",
  showArrow = true,
  onClick,
  className = "",
  type = "button",
}) => {
  /**
   * On passe nos variables CSS via un objet `style`,
   * afin d'injecter dynamiquement les couleurs choisies.
   */
  const customStyle = {
    // Couleurs pour l'état "normal"
    "--outer-bg-color": outerBgColor,
    "--inner-bg-color": innerBgColor,

    // Couleurs pour l'état "hover"
    "--outer-bg-hover-color": outerHoverBgColor,
    "--inner-bg-hover-color": innerHoverBgColor,

    // Couleurs du texte
    "--text-color": textColor,
    "--text-hover-color": textHoverColor,
  } as React.CSSProperties;

  return (
    <button
      type="submit"
      className={`${styles.buttonOuter} ${className}`}
      style={customStyle}
      onClick={onClick}
    >
      <span className={`${MadeSoulmaze.className} ${styles.buttonInner}`}>
        {text}
        {showArrow && (
          <div className={styles.arrowSvg}>
            <ArrowRight />
          </div>
        )}
      </span>
    </button>
  );
};

export default MultiLayerButton;
