// utils/animationColors.js
export const colors = ["#CBD62B", "#C72468", "#9B9AB1"];

/**
 * Récupère l’index de la couleur active depuis le localStorage.
 * Retourne 0 par défaut si aucune valeur n’est trouvée.
 */
export function getCurrentColorIndex() {
  if (typeof window === "undefined") {
    return 0;
  }
  try {
    let index = localStorage.getItem("currentColorIndex");
    if (index === null) {
      localStorage.setItem("currentColorIndex", "0");
      index = "0";
    }
    return parseInt(index, 10);
  } catch (error) {
    console.error("Error accessing localStorage:", error);
    return 0;
  }
}

/**
 * Met à jour l’index de la couleur active dans le localStorage.
 * @param {number} index L’index de couleur à sauvegarder.
 */
export function setCurrentColorIndex(index: number): void {
  localStorage.setItem("currentColorIndex", index.toString());
}
