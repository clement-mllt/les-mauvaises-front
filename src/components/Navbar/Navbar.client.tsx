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
import {MadeSoulmaze, LesMauvaises} from "@/utils/fonts";

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
    const BackLine = backOpenRef?.current;
    const BackLinePath = (BackLine?.firstChild as Element)?.querySelector(
      "path"
    );
    const Favicon = faviconRef?.current?.firstChild;
    const Logo = logoRef?.current?.children[0].childNodes[0];
    const LogoPath = (Logo as Element)?.querySelectorAll("path");

    const LineLogo = logoRef?.current?.children[0].childNodes[1];
    const LineLogoPath = (LineLogo as Element)?.querySelectorAll("path");

    if (!containerRef.current || !buttonRef.current) return;

    // 1. Appelle showMenuItemsAnimation une fois
    const tlMenuItems = showMenuItemsAnimation();

    // Objet de handler pour centraliser l'état et les fonctions d'animation
    const prepareAnimationHandler = {
      isOpen: false,
      lastOpenTime: 0,
      currentColorIndex: 0,
      // Exemple : tableau de couleurs (à adapter)
      colors: ["#C72468", "#9B9AB1", "#CBD62B", "#28282D"],
      // Simulation d'une fonction showMenuItem retournant une timeline GSAP
      showMenuItem: () => tlMenuItems,
      // Simulation d'une animation sur les lettres (à adapter)
    };

    function showMenuItemsAnimation() {
      const tl = gsap.timeline({paused: true});

      listElement?.current?.childNodes.forEach((line, index) => {
        const uniqueMaskId = `mask0_3562_37614_2${index}`;
        const svgElement = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "svg"
        );

        svgElement.setAttribute("viewBox", "0 0 468 54");
        svgElement.setAttribute("fill", "none");
        svgElement.style.visibility = "hidden";
        svgElement.classList.add(styles.absolute);
        svgElement.style.width = "100%";
        svgElement.style.height = "auto";

        // Création des balises mask et path
        const mask = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "mask"
        );
        mask.setAttribute("id", uniqueMaskId);
        mask.setAttribute("maskUnits", "objectBoundingBox");
        mask.setAttribute("x", "0%");
        mask.setAttribute("y", "0%");
        mask.setAttribute("width", "100%");
        mask.setAttribute("height", "100%");

        const pathMask = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        pathMask.setAttribute(
          "d",
          "M339.542 2.47479C338.275 2.63604 337.008 2.79354 335.741 2.95479C335.793 3.21354 335.849 3.47604 335.901 3.73479C337.482 3.54354 339.64 3.76104 340.546 3.08604C344.048 0.479795 348.281 2.00604 352.149 1.66479C352.654 1.61979 353.215 2.55355 353.905 2.79355C354.616 3.0373 355.522 2.98855 356.341 3.06355V1.11354C358.01 1.47354 359.617 1.81854 361.373 2.19729C361.409 2.12979 361.635 1.69854 361.986 1.03479C362.892 1.57104 363.726 2.05854 364.586 2.56854C365.951 1.48854 367.321 -0.476462 368.871 2.79729C372.322 -1.33146 375.69 2.24229 379.31 2.89854C379.192 1.98354 379.109 1.33479 379.027 0.686036L379.537 0.566045C379.985 1.27479 380.438 1.97979 381.221 3.21354C381.767 2.05479 382.081 1.37979 382.441 0.611043C385.897 2.13354 389.311 3.08979 393.056 0.806039C393.334 1.18854 393.844 1.90479 394.353 2.61729C394.704 2.42229 395.054 2.22729 395.404 2.02854C395.461 1.49229 395.517 0.959793 395.553 0.599793C397.5 1.10604 399.189 1.54479 400.878 1.97979C401.043 -0.637709 403.366 0.731046 404.885 0.907296C405.678 1.00105 406.379 1.52604 407.264 1.92354C407.754 1.45479 408.346 0.884789 408.933 0.31479C409.015 0.55479 409.098 0.791041 409.185 1.03104C410.298 0.952291 411.405 0.832289 412.517 0.806039C413.553 0.783539 414.593 0.911043 415.628 0.881043C422.998 0.671043 430.367 0.416046 437.742 0.251046C438.587 0.232296 439.452 0.689788 440.914 1.09854C443.062 1.09854 446.095 0.933536 449.072 1.15479C451.287 1.31979 453.455 1.93854 455.607 2.43729C456.746 2.69979 458.481 2.97729 458.739 3.53979C459.053 4.22979 458.193 5.25354 457.683 6.08604C457.276 6.75729 456.56 7.32729 456.122 7.99104C453.3 12.2698 448.82 13.6423 441.965 13.0348C439.194 12.791 436.249 13.9198 433.344 14.0735C429.548 14.276 425.717 14.066 421.911 14.171C420.783 14.201 419.702 14.8835 418.564 14.9548C408.197 15.6223 397.814 16.1473 387.458 16.8673C378.043 17.5198 368.655 18.3748 359.256 19.121C355.538 19.4173 351.819 19.7623 348.086 19.9123C342.658 20.1298 337.194 20.0098 331.786 20.3623C325.287 20.7823 318.823 21.5285 312.35 22.1773C311.84 22.2298 311.397 22.6385 311.037 23.366C316.537 22.166 321.919 23.5085 327.403 23.1035C332.409 22.736 337.564 23.4485 342.822 23.6735C343.966 23.7185 345.109 23.8198 346.252 23.801C348.869 23.7485 351.485 23.5423 354.096 23.5723C358.777 23.6248 363.459 23.9173 368.135 23.8985C371.92 23.8835 375.716 23.3473 379.49 23.426C384.053 23.5198 388.616 23.9473 393.159 24.3635C397.809 24.791 402.434 25.376 407.682 25.961C406.616 28.1398 405.709 29.9885 404.617 32.2123C404.921 32.516 405.673 33.2585 406.42 34.0048L406.667 33.1423C410.102 33.3523 413.542 33.5548 416.977 33.7723C417.616 33.8135 418.27 34.0085 418.883 33.9485C422.256 33.626 425.604 33.1798 428.987 32.9323C429.677 32.8835 430.424 33.5698 431.207 33.8098C431.768 33.9823 432.541 34.1623 433.035 34.016C437.006 32.8198 436.995 32.7973 440.24 34.016C443.139 30.3223 446.24 35.3173 449.407 33.7873C449.134 33.5435 448.809 33.251 448.217 32.7223C454.026 33.2173 459.578 33.506 464.991 34.3048C466.108 34.4698 467.411 36.5585 467.319 37.7023C467.236 38.666 465.243 39.5398 463.884 40.6235C465.485 42.596 465.114 43.1735 460.907 43.0685C453.702 42.8923 446.502 42.3785 439.303 42.3485C434.487 42.3298 429.672 43.031 424.841 43.1735C419.454 43.3348 414.052 43.2185 408.655 43.2373C402.393 43.2598 396.13 43.316 389.868 43.3198C381.607 43.3273 373.347 43.1735 365.091 43.3198C359.302 43.421 353.534 44.0398 347.746 44.1748C343.085 44.2835 338.414 43.9498 333.743 43.9385C331.101 43.931 328.459 44.186 325.817 44.3173C314.307 44.8948 302.807 45.6223 291.286 46.001C282.562 46.286 273.807 46.0423 265.068 46.1923C261.283 46.2598 257.523 46.8448 253.738 46.991C245.58 47.3023 237.412 47.4785 229.244 47.7073C226.716 47.7785 224.177 47.7935 221.653 47.9098C213.82 48.2735 205.992 48.6635 198.159 49.0573C186.726 49.6273 175.298 50.2498 163.865 50.7598C160.301 50.9173 156.707 50.786 153.133 50.786C153.102 50.4898 153.066 50.1898 153.035 49.8935C160.116 49.5523 167.197 49.2073 175.283 48.8173C173.897 48.1273 173.032 47.3323 172.285 47.3848C162.969 48.0485 153.663 48.8323 144.455 50.2723C146.772 50.111 149.09 49.9535 151.407 49.7923C151.464 50.0773 151.526 50.3623 151.582 50.6473C146.638 52.196 141.118 51.3448 135.942 51.911C130.483 52.511 124.947 52.7885 119.441 53.1298C113.9 53.471 108.348 53.7185 103.466 53.9735C102.554 50.8685 101.766 48.1798 100.917 45.2773C102.652 45.5885 103.631 45.7648 104.609 45.941C104.831 45.2248 105.057 44.5085 105.227 43.9535C119.019 42.8998 133.109 41.8198 147.2 40.7435C147.215 40.2935 147.236 39.8473 147.251 39.3973C142.755 40.0273 138.553 38.9885 134.247 38.8798C129.195 38.7523 124.123 39.0035 119.065 39.2135C114.039 39.4235 109.028 39.7835 104.017 40.0798C104.213 37.961 104.372 36.1723 104.532 34.4398C99.1142 34.541 102.827 31.001 100.494 29.801C103.857 29.3548 106.726 28.976 109.847 28.5635C109.651 28.9273 109.404 29.3885 109.157 29.8498C109.368 30.011 109.579 30.1723 109.785 30.3298C110.702 29.6998 111.613 29.066 112.473 28.4735C114.508 30.5435 118.004 29.0548 121.089 28.856C128.366 28.3835 135.617 27.6898 142.874 27.0598C149.62 26.471 156.367 25.8523 163.108 25.241C171.255 24.4985 179.403 23.7485 187.55 23.006C195.749 22.256 203.942 21.4835 212.146 20.7823C215.664 20.4823 219.207 20.3248 222.74 20.1073C229.028 19.7135 235.321 19.346 241.604 18.8998C242.294 18.851 242.928 18.3785 244.674 17.651C242.629 17.3735 241.558 17.0698 240.523 17.1148C233.019 17.456 225.526 17.9023 218.023 18.2435C210.03 18.611 210.025 18.5773 208.304 19.6648C205.925 18.0185 201.81 18.1123 200.142 19.5785H192.648C192.654 19.6235 192.659 19.6648 192.664 19.7098C188.874 19.7098 185.068 19.5673 181.293 19.7435C176.199 19.9835 171.121 20.4748 166.038 20.846C161.125 21.206 156.212 21.5773 151.289 21.8848C147.869 22.0985 144.408 22.0685 141.009 22.3948C136.925 22.7848 132.903 23.5198 128.825 23.9473C126.069 24.236 123.263 24.2473 120.482 24.3898C118.586 24.4873 116.686 24.5285 114.806 24.7048C109.883 25.1698 104.98 25.7435 100.051 26.1785C95.3856 26.591 90.6991 26.8723 86.0177 27.2248C78.6069 27.7835 71.1857 28.2635 63.7955 28.946C55.8027 29.6848 47.8459 30.6298 39.8634 31.451C35.8928 31.8598 31.9015 32.141 27.9412 32.5873C23.1002 33.131 18.2901 33.8285 13.4491 34.3835C9.43722 34.8448 5.39962 35.1898 1.37747 35.591L0.826416 34.8298C3.12847 34.0648 5.43052 33.2998 7.73257 32.5348C7.62442 32.2198 7.51627 31.9048 7.40812 31.5898C4.42112 32.5085 1.98002 32.4298 2.67012 29.7185C2.92247 28.7248 4.76617 27.3823 6.13607 27.1948C13.5109 26.1973 20.9732 25.5485 28.3944 24.7123C35.7022 23.8873 42.9895 22.9798 50.4106 22.0948C50.2767 21.4798 50.1325 20.8423 49.9935 20.2048C51.0338 22.571 53.1504 21.7385 55.2259 21.4235C58.5785 20.9135 61.9672 20.4823 65.3714 20.2048C67.8279 20.006 70.3257 20.1298 72.808 20.096C75.0328 20.066 75.0122 20.0585 75.2233 18.101C75.2439 17.921 75.692 17.606 75.8928 17.6248C76.3718 17.6735 76.9074 17.8085 77.2576 18.041C77.8859 18.4573 78.3957 18.971 78.9571 19.4435C79.2609 18.7798 79.5648 18.116 79.6214 17.996C83.005 18.3785 86.4967 18.7723 90.2819 19.1998V16.376C90.5858 16.256 90.8845 16.1398 91.1883 16.0198C91.6467 16.6198 92.105 17.2198 93.0063 18.3935C94.4637 18.2435 96.7761 17.936 99.109 17.7748C105.16 17.3548 111.232 17.0698 117.263 16.5448C118.324 16.451 119.235 15.4535 120.219 14.8723C120.152 14.5085 120.08 14.141 120.013 13.7773C121.239 14.3285 122.459 14.8798 124.339 15.7273C124.509 15.6148 125.379 15.0373 126.255 14.4598C126.316 14.6735 126.383 14.891 126.445 15.1048C127.424 14.9173 128.402 14.726 129.381 14.5385L129.087 13.9273C130.926 14.2723 132.764 14.6173 134.608 14.9585L134.948 14.5273C134.505 14.2573 134.057 13.9835 133.073 13.3835H135.586C135.2 15.4873 137.482 15.0185 138.713 14.7973C140.036 14.561 141.143 13.691 141.833 13.3535C144.372 13.6685 146.834 14.3285 149.213 14.2048C157.047 13.8035 164.859 13.1698 172.661 12.5098C174.52 12.3523 177.662 12.9373 176.601 9.89229C179.578 9.91104 182.596 9.05979 184.882 11.261C185.145 11.5123 186.149 11.426 186.798 11.381C200.27 10.4698 213.748 9.55104 227.21 8.57604C227.766 8.53479 228.25 7.92729 228.755 7.57104C229.11 7.31979 229.445 6.83604 229.785 6.83604C230.475 6.83604 231.397 6.95229 231.799 7.28604C232.947 8.24604 232.757 8.19728 233.9 7.52978C234.827 6.98979 236.063 6.72728 236.151 6.69728C238.571 7.13978 240.085 7.41729 241.599 7.69479C241.517 7.27104 241.434 6.85104 241.383 6.59229C243.386 6.84354 245.776 7.14354 248.16 7.44354C248.078 7.09479 248.001 6.74229 247.846 6.07854C249.072 6.70104 250.107 8.28729 251.621 6.15354C252.085 5.50104 256.148 6.18354 258.558 6.28479C259.588 6.32604 260.958 6.78729 261.592 6.46104C265.464 4.46229 270.892 4.25229 274.049 5.66229C277.134 5.26479 279.838 4.26354 281.198 4.86729C284.282 6.23979 286.44 4.45479 288.717 4.50354C294.67 4.63479 300.629 1.97979 306.592 4.34229C306.685 4.37979 309.754 5.60229 308.626 3.34854C309.409 3.17229 310.187 2.87229 310.98 2.83479C315.007 2.63979 319.045 2.51229 323.325 2.35104C323.603 2.97729 323.901 3.65979 324.143 4.20729C325.766 4.13979 327.218 4.08354 328.881 4.01604C328.799 3.51354 328.717 2.99604 328.516 1.78104C332.378 4.10604 335.824 1.88229 339.429 1.69104C339.475 1.94229 339.516 2.19354 339.563 2.44479L339.542 2.47479ZM169.952 18.2398C166.754 18.2698 163.551 18.2585 160.353 18.371C159.791 18.3898 159.266 18.9335 158.725 19.2335C159.117 19.5185 159.549 20.081 159.894 20.051C163.582 19.7435 167.254 19.346 170.931 18.9748C181.684 18.9298 184.46 18.5135 185.14 16.2598C179.882 16.946 174.917 17.5948 169.952 18.2398ZM208.212 16.1585C209.18 16.3198 210.169 16.6573 211.122 16.6123C218.687 16.256 226.252 15.8435 233.807 15.386C234.219 15.3598 234.575 14.7785 234.951 14.456C234.338 14.2498 233.715 13.856 233.107 13.8673C228.359 13.9648 223.6 14.0473 218.862 14.321C215.298 14.5273 211.765 15.0035 208.222 15.3598C202.739 15.4948 199.907 16.1535 199.725 17.336C202.624 16.9348 205.415 16.5485 208.207 16.1585H208.212ZM190.058 46.9648C190.182 47.3285 190.31 47.696 190.434 48.0598C202.083 47.5948 213.727 47.1335 225.439 46.6685C224.306 45.0335 221.875 44.7485 217.925 45.011C209.777 45.5585 201.599 45.8323 193.436 46.2748C192.293 46.3385 191.186 46.7248 190.063 46.961L190.058 46.9648ZM148.477 35.8835C148.549 36.2323 148.621 36.581 148.698 36.9298C160.827 36.3185 172.95 35.7073 185.078 35.096C185.202 34.8598 185.32 34.6235 185.438 34.3835C184.707 34.0948 183.955 33.5473 183.255 33.581C182.271 33.6298 181.339 34.3535 180.366 34.3723C173.954 34.4998 167.527 34.3723 161.12 34.6198C156.887 34.7848 152.69 35.4448 148.472 35.8798L148.477 35.8835ZM147.756 40.7173C157.083 39.956 165.369 39.281 174.088 38.5685C170.952 37.0873 150.393 38.4223 147.756 40.7173ZM448.696 41.066C444.798 38.6023 434.477 38.5873 430.517 41.066H448.696ZM225.964 33.131L225.861 32.0623C219.217 32.366 212.574 32.6735 205.93 32.9773C205.961 33.296 205.992 33.6148 206.028 33.9298C212.672 33.6635 219.32 33.3973 225.964 33.131ZM284.973 44.1973C281.764 41.9773 275.409 42.3298 273.993 44.1973H284.973ZM250.05 22.8335C250.066 23.2535 250.076 23.6735 250.092 24.0898C255.159 23.861 260.232 23.6323 265.299 23.4035C265.31 23.141 265.315 22.8748 265.32 22.6123C260.247 20.6248 255.123 24.3035 250.045 22.8298L250.05 22.8335ZM157.113 18.9823C156.944 18.746 156.779 18.5098 156.609 18.2698C153.308 18.7048 150.006 19.1435 146.705 19.5785C146.824 19.9573 146.942 20.3323 147.061 20.711C150.315 19.8335 154.343 21.3973 157.113 18.9785V18.9823ZM256.138 45.0298C258.98 44.4748 262.529 46.031 265.768 43.5373C261.602 43.2485 258.409 42.761 256.138 45.0298Z"
        );
        pathMask.setAttribute("fill", "#CBD62B");
        mask.appendChild(pathMask);
        svgElement.appendChild(mask);

        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.setAttribute("mask", `url(#${uniqueMaskId})`);

        const pathDraw = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        pathDraw.setAttribute(
          "d",
          "M4 31L210.5 13L452.5 5.5L105 31L402 27.5L105 49.5L465 38.5"
        );
        pathDraw.setAttribute("stroke", "#CBD62B");
        pathDraw.setAttribute("stroke-width", "20");
        g.appendChild(pathDraw);
        svgElement.appendChild(g);

        const containerDiv = document.createElement("div");
        containerDiv.classList.add(styles.invisibleContainer); // <-- ta classe SCSS scoped

        // Ajoute le SVG et la div dans le lien
        line?.firstChild?.appendChild(svgElement);
        line?.firstChild?.appendChild(containerDiv);

        // Animation GSAP
        const pathElement = svgElement.querySelectorAll("path");
        const target = containerDiv;

        if (line instanceof HTMLElement) {
          const widthElement = line.getBoundingClientRect().width;
          const heightElement = line.getBoundingClientRect().height;

          if (!svgElement || !pathElement || !target) return;
          tl.set(pathElement, {drawSVG: "0% 0%"});
          tl.set(svgElement, {
            autoAlpha: 1,
            visibility: "visible",
            left: -40,
            width: widthElement + 100,
            height: heightElement,
          });
          const chars = new SplitText(line, {type: "chars"}).chars;
          //     // Exemple custom d'espacement sur certaines lettres
          if (index === 1 || index === 2) {
            const targetLetter = chars.find(
              (char) =>
                char.textContent?.toLowerCase() === (index === 1 ? "s" : "e")
            );
            if (targetLetter) {
              gsap.set(targetLetter, {marginRight: 40});
            }
          }

          console.log(pathElement);

          //     // Animation ligne SVG
          const tlLineSvg = gsap.timeline({paused: true}).fromTo(
            pathElement,
            {drawSVG: "0% 0%"}, // SVG caché par défaut
            {drawSVG: "0% 100%", duration: 0.5, ease: "power2.inOut"} // SVG visible au survol
          );
          //     // Hover events
          target.addEventListener("mouseenter", () => tlLineSvg.play());
          target.addEventListener("mouseleave", () => tlLineSvg.reverse());
          //     // Animation d’apparition
          tl.from(
            chars,
            {
              y: 20,
              opacity: 0,
              duration: 0.1,
              stagger: 0.05,
              ease: "bounce.out",
            },
            index * 0.15
          );
        }
      });

      return tl;
    }

    // Fonction qui prépare la timeline d'ouverture du menu
    function animationMenuOpen(
      container: HTMLElement,
      currentColorIndex: number,
      handler: typeof prepareAnimationHandler
    ) {
      // Créer une timeline "paused"
      const tl = gsap.timeline({paused: true});
      // Une timeline pour animer l'apparition des items du menu
      const tlShowMenuItem = handler.showMenuItem();

      //   Quelques réglages initiaux :

      if (BackLine && LineLogoPath && LineLogoPath && BackLinePath) {
        tl.set(LineLogoPath, {stroke: "#28282D", zIndex: 10})
          .set(LineLogoPath, {opacity: "0", drawSVG: "0% 0%"})
          .set(BackLinePath, {drawSVG: "0% 0%"})
          .set(BackLine, {top: 0, duration: 0});
      }
      //   tl.set(".menu", {background: "transparent", duration: 0.5});

      //   // Animation sur certains éléments (exemple ; adaptez les sélecteurs et options)
      tl.to([BackLinePath, LineLogoPath], {
        drawSVG: "0% 100%",
        opacity: 1,
        duration: 1,
        ease: "power2.inOut",
      })
        .to(detailMenuRef.current, {top: 0, zIndex: 9998, duration: 0}, "-=0.5")
        .to(LineLogoPath, {
          drawSVG: "0% 0%",
          stroke: handler.colors[3],
          duration: 0.5,
          ease: "power2.inOut",
        })
        .to(
          LogoPath,
          {
            fill: handler.colors[3],
            duration: 0.5,
            ease: "power2.inOut",
          },
          "=-0.4"
        );

      // Stocker la timeline d'animation des items pour pouvoir l'inverser plus tard
      (tl as any).tlShowMenuItem = tlShowMenuItem;
      return tl;
    }

    // Créer la timeline d'animation avec le conteneur et la couleur actuelle
    const tlOpen = animationMenuOpen(
      containerRef.current,
      prepareAnimationHandler.currentColorIndex,
      prepareAnimationHandler
    );

    // Objet pour gérer l'état du menu, ici par exemple
    const menuHandler = {isOpen: false};

    // Écouteur de souris sur le conteneur (pour le mouseleave)
    // const handleMouseLeave = () => {
    //   const now = Date.now();
    //   const timeSinceOpen = now - (prepareAnimationHandler.lastOpenTime || 0);
    //   if (prepareAnimationHandler.isOpen && timeSinceOpen > 2000) {
    //     menuHandler.isOpen = false;
    //     // Inversion de l'animation
    //     (tlOpen as any).tlShowMenuItem.timeScale(1).reverse();
    //     tlOpen.reverse();
    //     // Inversion de l'état isOpen
    //     prepareAnimationHandler.isOpen = !prepareAnimationHandler.isOpen;
    //   }
    // };

    // Écouteur sur le bouton (pour le clic)
    const handleClick = () => {
      if (prepareAnimationHandler.isOpen) {
        menuHandler.isOpen = false;
        (tlOpen as any).tlShowMenuItem.timeScale(1).reverse();
        tlOpen.reverse();
      } else {
        menuHandler.isOpen = true;
        prepareAnimationHandler.lastOpenTime = Date.now();
        (tlOpen as any).tlShowMenuItem.timeScale(0.7).play();
        tlOpen.play();
      }
      // Inverser l'état isOpen
      prepareAnimationHandler.isOpen = !prepareAnimationHandler.isOpen;
    };

    // containerRef.current.addEventListener("mouseleave", handleMouseLeave);
    buttonRef.current.addEventListener("click", handleClick);

    // Nettoyage lors du démontage
    return () => {
      //   containerRef.current?.removeEventListener("mouseleave", handleMouseLeave);
      buttonRef.current?.removeEventListener("click", handleClick);
    };
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
        <div className={styles.burger}>
          <div
            ref={buttonRef}
            id={styles.openBurger}
            className={styles.invisibleButton}
          ></div>
          <div className={styles.circle}>
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
              <span></span>
              <Link href="https://www.google.fr/maps/place/55+Bd+du+Havre,+95220+Herblay-sur-Seine/@49.0014912,2.1806569,3a,60y,227.94h,102.81t/data=!3m6!1e1!3m4!1sUhiUQDc-3A18Tbg9pbpJfQ!2e0!7i16384!8i8192!4m6!3m5!1s0x47e660bf682cae17:0x50a3e9b821244533!8m2!3d49.0013916!4d2.1804966!16s%2Fg%2F11c5mf1zm7?coh=205409&entry=ttu&g_ep=EgoyMDI0MTAwMi4xIKXMDSoASAFQAw%3D%3D">
                55 Rue du Havre, 95220, Herblay
              </Link>
              <Link href="tel:0961230164">09 61 23 01 64</Link>
            </div>
            <div></div>
          </div>
        </div>
        <div ref={backOpenRef} className={styles.backOpen}>
          <OpenMenu menuDimensions={menuDimensions} />
        </div>
      </div>
    </nav>
  );
}
