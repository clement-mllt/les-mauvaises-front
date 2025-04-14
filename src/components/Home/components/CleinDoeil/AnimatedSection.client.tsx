'use client'

import React, { useEffect, useRef, useState } from "react";
import style from "@/app/styles/components/Homepage.module.scss";
import Explosion from "@/components/Icons/Explosion";
import Favicon from "@/components/Icons/Favicon";
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
  const tvSectionRef = useRef<HTMLDivElement>(null)
  let isTvStart = useState(false)

  useEffect(() => {
    if (!LongSvg.current) return;

    // Sélection des chemins dans le SVG LongSvg
    const LongLinePaths = LongSvg.current.querySelectorAll("path");
    const shortLinePaths = ShortSvg.current?.querySelectorAll("path");

    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    // Animation des papiers
    tl.fromTo(paper1.current, { x: -600 }, { x: 0, duration: 1 })
      .fromTo(paper2.current, { x: 900 }, { x: 0, duration: 1 }, "<");

    // Animation drawSVG sur le FullScreenline
    tl.from(LongLinePaths, {
      drawSVG: "0%",
      duration: 8,
    }, "sync+=0.3")
      .to(LongLinePaths, {
        drawSVG: "0%",
        duration: 45,
        ease: "none",
      }, "textStart");

    // Animation d'apparition du clign d'œil
    tl.fromTo(cleinOeil.current, {
      x: 500,
      opacity: 0,
    }, {
      x: 0,
      opacity: 1,
      duration: 3,
      ease: "power1.inOut",
    }, "textStart")
      .to(cleinOeil1.current, {
        opacity: 0,
        duration: 0,
        ease: "power1.inOut",
      }, "textStart+=10");

    // Animation du ShortSVG et de l'explosion
    tl.from(shortLinePaths, {
      drawSVG: "0%",
      duration: 5,
     }, "sync+=0.3")
     .to(shortLinePaths, {
        drawSVG: "100%",
        duration: 5,
        ease: "power1.inOut",
     }, "textStart")
      .to(explosion.current, {
        opacity: 1,
        duration: 2,
        ease: "power1.inOut",
      }, "textStart+=0.5");
    
    //animation de texte
    const textContainer = container.current ? container.current.querySelector(`.${style.splitText}`) : null;
    if (textContainer) {
      const splitInstance = new SplitText(textContainer, {
        type: "chars",
        position: "relative",
      });
      tl.from(splitInstance.chars, {
        duration: 0.5,
        opacity: 0,
        y: 20,
        x: -30,
        ease: "power2.out",
        stagger: 0.5,
      }, "textStart"); 
    }

    tl.fromTo(
      tvSectionRef.current,
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 10,
        onStart: () => {
          if (textContainer) {
            gsap.to(textContainer, { mixBlendMode: "none" });
          }
        },
        onComplete: () => {
          // if (isTvStart) {
          //   document.body.style.overflow = "hidden";
          // }
        }
      },
      "textStart+=50"
    )
    .to(tvSectionRef.current, {
      scale: 2,
      y: -300,
      zIndex: 300
    })
    .to(tvSectionRef.current, {

    }) 
    
    console.log(tvSectionRef.current?.children);
    let test = tvSectionRef.current?.children[0]
    if(test) {
      console.log(test);
    }
    
    
    

    return () => {
      tl.kill();
      ScrollTrigger.kill();
    };
  }, []);

  return (
    <div ref={container} className={`${style.content}`}>
      <div className={`${style.papers}`}>
        <Image ref={paper1} className={`${style.paper1}`} src={"/cleinOeilAssets/PAPIER_NOIR.png"} width={1200} height={1000} quality={100} alt="paper1" />
        <Image ref={paper2} className={`${style.paper2}`} src={"/cleinOeilAssets/PAPIER_NOIR.png"} width={1500} height={1000} quality={100} alt="paper1" />
      </div>

      <div ref={cleinOeil} className={`${style.cleinOeil}`}>
        <Image ref={cleinOeil1} className={`${style.oeil1}`} src={"/cleinOeilAssets/oeil.png"} width={800} height={550} quality={100} alt="cleinOeil1" />
        <Image ref={cleinOeil2} className={`${style.oeil2}`} src={"/cleinOeilAssets/cleindoeil.png"} width={800} height={550} quality={100} alt="cleinOeil2" />
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
          <span className={`${style.span1} span1`}>on</span> <span className={`${style.span1} span2`}>s'est déjà</span> <span className={`${style.span1}`}>vu</span>
        </div>
        <div className={`${style.splitText2}`}>
          <span className="span4">quelque</span>
        </div>
        <div className={`${style.splitText3}`}>
          <span className="span5">part</span> <span className="span6">N</span> <span className="span7">😊</span> <span className="span8">N</span>
        </div>
      </div>

      <div ref={tvSectionRef}>
        <TvSection data={data}/>
      </div>
    </div>
  );
};

export default AnimatedSection;
