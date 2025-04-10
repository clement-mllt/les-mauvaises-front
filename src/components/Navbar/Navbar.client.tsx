"use client";
import Link from "next/link";
import React, {LinkHTMLAttributes, useEffect, useRef, useState} from "react";
import styles from "@/app/styles/components/Navbar.module.scss";
import Favicon from "@/components/Icons/Favicon";
import Logo from "@/components/Icons/Logo";
import LineLogo from "@/components/Icons/LineLogo";
import OpenMenu from "@/components/Icons/OpenMenu";
import gsap from "gsap";
import {DrawSVGPlugin} from "gsap/DrawSVGPlugin";
import {SplitText} from "gsap/SplitText";
import {MadeSoulmaze, LesMauvaises, Quicksand} from "@/utils/fonts";
import {
  switchColor,
  setupMenuAnimation,
  updateChosenColorsForElements,
} from "@/utils/animationMenuHandler";

gsap.registerPlugin(SplitText, DrawSVGPlugin);

interface MenuItem {
  Title: string;
  slug: string;
}

interface NavbarClientProps {
  menuItems: MenuItem[];
}

export default function NavbarClient({menuItems}: NavbarClientProps) {
  // Ref pour observer les dimensions du menu détail
  const detailMenuRef = useRef<HTMLDivElement>(null);
  const [menuDimensions, setMenuDimensions] = useState<DOMRect | null>(null);

  // Ref pour le conteneur de menu (invisibleMenu) et pour le bouton d'ouverture
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const backOpenRef = useRef<HTMLDivElement>(null);
  const faviconRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const listElement = useRef<HTMLUListElement>(null);
  const circleModelRef = useRef<HTMLDivElement>(null);
  const lineBurgerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (detailMenuRef.current) {
      const updateDimensions = () => {
        const rect = detailMenuRef.current!.getBoundingClientRect();
        setMenuDimensions(rect);
      };

      // Initialisation
      updateDimensions();

      // Observer les changements de dimensions du détail du menu
      const resizeObserver = new ResizeObserver(() => {
        updateDimensions();
      });
      resizeObserver.observe(detailMenuRef.current);
      return () => {
        resizeObserver.disconnect();
      };
    }
  }, []);

  useEffect(() => {
    const Favicon = faviconRef?.current;

    const Logo = logoRef?.current?.children[0].childNodes[0];
    const LogoPath = (Logo as Element)?.querySelectorAll("path");
    const LineLogo = logoRef?.current?.children[0].childNodes[1];
    const LineLogoPath = (LineLogo as Element)?.querySelectorAll("path");
    const linesBurger = lineBurgerRef?.current?.children;
    const backOpen = backOpenRef?.current;

    // SET COLOR CHECKER
    if (Favicon) {
      const circleElement = Favicon.querySelector("circle");
      const pathsElement = Favicon.querySelectorAll("path");

      if (circleModelRef.current) {
        updateChosenColorsForElements(
          [circleModelRef.current],
          "backgroundColor",
          {blackWhite: false}
        );

        updateChosenColorsForElements(
          Array.from(linesBurger || []).map((line) => line as HTMLElement),
          "backgroundColor",
          {blackWhite: true}
        );
      }
      updateChosenColorsForElements(
        [circleElement as unknown as HTMLElement],
        "fill",
        {blackWhite: false}
      );
      updateChosenColorsForElements(
        LogoPath as unknown as HTMLElement[],
        "fill",
        {blackWhite: false}
      );
      updateChosenColorsForElements(
        Array.from(pathsElement).map((path) => path as unknown as HTMLElement),
        "fill",
        {blackWhite: true}
      );
    }

    // Par exemple, quand on clique sur le bouton burger, on déclenche switchColor.
    // Le ref faviconRef va nous donner l'élément icône dont on a besoin.
    const handleClick = () => {
      if (Favicon) {
        // La fonction switchColor lira l'index actif dans le localStorage et utilisera le tableau global
        switchColor(
          Favicon,
          {
            logoElement: Logo as HTMLElement, // Adjusted to use a valid type
            logoPathElement: LogoPath as unknown as
              | SVGPathElement
              | SVGPathElement[],
            lineLogoElement: LineLogo as unknown as
              | SVGPathElement
              | SVGPathElement[],
            lineLogoPathElement: LineLogoPath as unknown as
              | SVGPathElement
              | SVGPathElement[],
            circleModelElement:
              circleModelRef.current as unknown as HTMLElement,
            linesBurgerElement: Array.from(linesBurger || []).map(
              (line) => line as HTMLElement
            ),
            lineBackOpenElement: backOpen as unknown as HTMLElement,
          },
          true
        );
      }
    };

    if (faviconRef.current) {
      faviconRef.current.addEventListener("click", handleClick);
    }
    return () => {
      if (faviconRef.current) {
        faviconRef.current.removeEventListener("click", handleClick);
      }
    };
  }, []);

  useEffect(() => {
    if (
      containerRef.current &&
      buttonRef.current &&
      backOpenRef.current &&
      detailMenuRef.current &&
      listElement.current &&
      faviconRef.current &&
      logoRef.current &&
      circleModelRef.current
    ) {
      const cleanup = setupMenuAnimation({
        container: containerRef.current,
        button: buttonRef.current,
        backOpen: backOpenRef.current,
        detailMenu: detailMenuRef.current,
        listElement: listElement.current,
        favicon: faviconRef.current,
        logo: logoRef.current,
        circleModel: circleModelRef.current,
        styles, // votre objet importé (styles from "@/app/styles/components/Navbar.module.scss")
      });
      return cleanup;
    }
  }, []);

  return (
    <nav className={`${styles.navbar}`}>
      <div className={styles.visibleMenu}>
        <div className={styles.favicon}>
          <div className={styles.circle}></div>
          <div ref={faviconRef} className={styles.icon}>
            <Favicon />
          </div>
        </div>
        <div ref={logoRef} className={styles.mainLogo}>
          <Link
            href="/"
            className={`${styles.logoLink}`}
            aria-label="Les Mauvaises"
            title="Les Mauvaises"
          >
            <Logo />
            <LineLogo />
          </Link>
        </div>
        <div ref={circleModelRef} className={styles.burger}>
          <div
            ref={buttonRef}
            id={styles.openBurger}
            className={styles.invisibleButton}
          ></div>
          <div ref={lineBurgerRef} className={styles.circle}>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>

      {/* MENU BURGER */}
      <div ref={containerRef} className={styles.invisibleMenu}>
        <div ref={detailMenuRef} className={styles.detailMenu}>
          <div className={styles.listMenu}>
            <ul ref={listElement}>
              {[...menuItems].reverse().map((item, index) => (
                <li key={index}>
                  <Link
                    className={MadeSoulmaze.className}
                    href={`/${item.slug}`}
                  >
                    {item.Title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.social}>
            <div>
              <span className={`${styles.textTrash} ${LesMauvaises.className}`}>
                Viens nous dire bonjour
              </span>
              <Link
                className={`${styles.linkAdresse} ${Quicksand.className}`}
                href="https://www.google.fr/maps/place/55+Bd+du+Havre,+95220+Herblay-sur-Seine/@49.0014912,2.1806569,3a,60y,227.94h,102.81t/data=!3m6!1e1!3m4!1sUhiUQDc-3A18Tbg9pbpJfQ!2e0!7i16384!8i8192!4m6!3m5!1s0x47e660bf682cae17:0x50a3e9b821244533!8m2!3d49.0013916!4d2.1804966!16s%2Fg%2F11c5mf1zm7?coh=205409&entry=ttu&g_ep=EgoyMDI0MTAwMi4xIKXMDSoASAFQAw%3D%3D"
              >
                55 Rue du Havre, 95220, Herblay
              </Link>
              <Link
                className={`${styles.linkTel} ${Quicksand.className}`}
                href="tel:0961230164"
              >
                09 61 23 01 64
              </Link>
            </div>
            <div className={Quicksand.className}>
              <p>Instagram</p>
              <p>Behance</p>
              <p>Pinterest</p>
              <p>Linkedin</p>
              <p>Contact</p>
            </div>
          </div>
        </div>
        <div ref={backOpenRef} className={styles.backOpen}>
          <OpenMenu menuDimensions={menuDimensions} />
        </div>
      </div>
    </nav>
  );
}
