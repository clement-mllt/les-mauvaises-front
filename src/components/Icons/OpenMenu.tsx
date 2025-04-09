"use client";
import React, {useEffect} from "react";
import gsap from "gsap";
import styles from "@/app/styles/components/Logo.module.scss"; // SCSS facultatif

// Vous pouvez définir le type de vos props pour plus de clarté
type OpenMenuProps = {
  menuDimensions: DOMRect | null;
  className?: string;
};

export default function OpenMenu({
  menuDimensions,
  className = "",
}: OpenMenuProps) {
  const lineLogoRef = React.useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (lineLogoRef.current) {
      gsap.set(lineLogoRef.current, {
        attr: {
          width: window.innerWidth,
          height: menuDimensions?.height ?? 700,
          viewBox: `0 0 ${window.innerWidth} ${menuDimensions?.height}`,
        },
      });
    }
  }, [menuDimensions]);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1358"
      height="695"
      viewBox="0 0 1358 695"
      aria-hidden="true"
      fill="none"
      ref={lineLogoRef}
    >
      <path
        id={styles.burgerDraw}
        className={styles.burgerDraw}
        d="M-1.5 6H2580.5L-1.5 75H2580.5L-1.5 140.5H2580.5L-1.5 206.5H2580.5L-1.5 268.5H2580.5L-1.5 334.5H2580.5L-1.5 400H2580.5L-1.5 462.5H2580.5L-1.5 528H2580.5L-1.5 593.5H2580.5L-1.5 662.5H2580.5L-1.5 731.5H2580.5L-1.5 800.5"
        stroke="black"
        strokeWidth="70"
      ></path>
    </svg>
  );
}
