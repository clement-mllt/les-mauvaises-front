"use client";

import React, { useEffect, useRef, useState } from "react";
import style from "@/app/styles/components/Homepage.module.scss";
import Explosion from "@/components/Icons/Explosion";
import Smiley from "@/components/Icons/Smiley";
import FullScreenline from "@/components/Icons/FullScreenline";
import ShortCleinDoeil from "@/components/Icons/ShortCleinDoeil";
import Image from "next/image";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";
import DrawSVGPlugin from "gsap/DrawSVGPlugin";
import { MadeSoulmaze, LesMauvaises, Quicksand } from "@/utils/fonts";
import TvSection from "./TvSection.client";

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);

export const AnimatedSection = (data: any) => {
  const container = useRef<HTMLDivElement>(null);
  const paper1 = useRef<HTMLImageElement>(null);
  const paper2 = useRef<HTMLImageElement>(null);
  const LongSvg = useRef<HTMLDivElement>(null);
  const ShortSvg = useRef<HTMLDivElement>(null);
  const cleinOeil = useRef<HTMLDivElement>(null);
  const cleinOeil1 = useRef<HTMLImageElement>(null);
  const cleinOeil2 = useRef<HTMLImageElement>(null);
  const explosion = useRef<HTMLDivElement>(null);
  const tvSectionRef = useRef<HTMLDivElement>(null);
  const SmileySVG = useRef<HTMLDivElement>(null);
  const InterroRef = useRef<HTMLImageElement>(null);
  const [isTvStart, setIsTvStart] = useState(false);

  
  useEffect(() => {
    if (!LongSvg.current) return;
    
    // Sélection des chemins dans le SVG LongSvg
    const LongLinePaths = LongSvg.current.querySelectorAll("path");
    const shortLinePaths = ShortSvg.current?.querySelectorAll("path");
    const SmileyPaths = SmileySVG.current?.querySelectorAll("path");
    const textContainer = container.current
      ? container.current.querySelector(`.${style.splitText}`)
      : null;

    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    // Animation des papiers
    tl.fromTo(paper1.current, { x: -600 }, { x: 0, duration: 1 }).fromTo(
      paper2.current,
      { x: 900 },
      { x: 0, duration: 1 },
      "<"
    );

    // Animation drawSVG sur le FullScreenline
    tl.from(
      LongLinePaths,
      {
        drawSVG: "0%",
        duration: 8,
      },
      "sync+=0.3"
    ).to(
      LongLinePaths,
      {
        drawSVG: "0%",
        duration: 45,
        ease: "none",
      },
      "textStart"
    );

    // Animation d'apparition du clign d'œil
    tl.fromTo(
      cleinOeil.current,
      {
        x: 500,
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        duration: 3,
        ease: "power1.inOut",
      },
      "textStart"
    ).to(
      cleinOeil1.current,
      {
        opacity: 0,
        duration: 0,
        ease: "power1.inOut",
      },
      "textStart+=10"
    );

    // Animation du ShortSVG et de l'explosion
    tl.from(
      shortLinePaths,
      {
        drawSVG: "0%",
        duration: 5,
      },
      "sync+=0.3"
    )
      .to(
        shortLinePaths,
        {
          drawSVG: "100%",
          duration: 5,
          ease: "power1.inOut",
        },
        "textStart"
      )
      .to(
        explosion.current,
        {
          opacity: 1,
          duration: 2,
          ease: "power1.inOut",
        },
        "textStart+=0.5"
      );

    const splitInstance = new SplitText(textContainer, {
      type: "chars",
      position: "relative",
    });
    //animation de texte
    tl.from(
      splitInstance.chars,
      {
        duration: 3,
        opacity: 0,
        y: 200,
        x: -100,
        ease: "power2.out",
        stagger: 1.5,
      },
      "textStart"
    );

    if (SmileyPaths && SmileyPaths.length > 0) {
      tl.fromTo(
        SmileyPaths,
        { drawSVG: "0%" },
        {
          drawSVG: "100%",
          stroke: "#cbd62b",
          fill: "#cbd62b",
          duration: 3,
        },
        "textStart+=38"
      );
    }
    tl.to(
      InterroRef.current,
      {
        opacity: 1,
        duration: 1,
      },
      "textStart+=40"
    );

    tl.to(
      splitInstance.chars.reverse(),
      {
        duration: 3,
        opacity: 0,
        y: 200,
        x: -100,
        stagger: 1.5,
      },
      "textStart+=50"
    )
      .to(
        InterroRef.current,
        {
          opacity: 0,
          duration: 1,
        },
        "textStart+=45"
      )
      .to(
        SmileyPaths,
        {
          drawSVG: "0% 0%",
          fill: "none",
          stroke: "none",
          duration: 4,
        },
        "textStart+=45"
      );

    // TL FOR TV SECTION
    tl.fromTo(
      tvSectionRef.current,
      { y: 1500 },
      {
        y: 0,
        duration: 10,
        onComplete: () => {
          // if (isTvStart) {
          //   document.body.style.overflow = "hidden";
          // }
        },
      },
      "textStart+=90"
    )
    .to(tvSectionRef.current, {
      scale: 2,
      y: -150,
      zIndex: 300,
      duration: 10,
      onComplete: () => {
        setTimeout(() => {
          setIsTvStart(true)
        }, 1500);
      }
    },  "textStart+=100")

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div ref={container} className={`${style.content}`}>
      <div className={`${style.papers}`}>
        <Image ref={paper1} className={`${style.paper1}`} src={"/cleinOeilAssets/PAPIER_NOIR.png"} width={1200} height={1000} quality={100} alt="paper1"/>
        <Image ref={paper2} className={`${style.paper2}`} src={"/cleinOeilAssets/PAPIER_NOIR.png"} width={1500} height={1000} quality={100} alt="paper1"/>
      </div>

      <div ref={cleinOeil} className={`${style.cleinOeil}`}>
        <Image ref={cleinOeil1} className={`${style.oeil1}`} src={"/cleinOeilAssets/oeil.png"} width={800} height={550} quality={100} alt="cleinOeil1"/>
        <Image ref={cleinOeil2} className={`${style.oeil2}`} src={"/cleinOeilAssets/cleindoeil.png"} width={800} height={550} quality={100} alt="cleinOeil2"/>
      </div>

      <div ref={explosion} className={`${style.explosion}`}>
        <Explosion />
      </div>

      <div ref={ShortSvg} className={`${style.ShortSVG}`}>
        <ShortCleinDoeil />
      </div>

      <div ref={LongSvg} className={`${style.longSVG}`}>
        <FullScreenline />
      </div>

      <div className={`${style.splitText} ${MadeSoulmaze.className}`}>
        <div className={`${style.splitText1}`}>
          <span className={`${style.span1}`}>ON</span>{" "}
          <span className={`${style.span2}`}>S'EST DéJà</span>{" "}
          <span className={`${style.span3}`}>VU</span>
        </div>
        <div className={`${style.splitText2}`}>
          <span className={`${style.span4}`}>QUELQUE</span>
        </div>
        <div className={`${style.splitText3}`}>
          <div>
            <span className={`${style.span5}`}>PART</span>
          </div>
          <div className="WordSmiley">
            <span className={`${style.span6}`}>N</span>
            <span ref={SmileySVG} className={`${style.span7}`}>
              <Smiley />
            </span>
            <span className={`${style.span8}`}>N</span>
          </div>
        </div>

        <Image
          ref={InterroRef}
          src={"/cleinOeilAssets/POINT VERT.png"}
          height={1000}
          width={1000}
          alt="point interogation"
        />
      </div>

      <div ref={tvSectionRef}>
        <TvSection data={data} isTvStart={isTvStart}/>
      </div>
    </div>
  );
};

export default AnimatedSection;
