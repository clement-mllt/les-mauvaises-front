'use client'

import React from "react";
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
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);


export const AnimatedSection = () => {

  const container = React.useRef<HTMLDivElement>(null);
  const paper1 = React.useRef<HTMLImageElement>(null);
  const paper2 = React.useRef<HTMLImageElement>(null);
  const LongSvg = React.useRef<HTMLDivElement>(null);
  const ShortSvg = React.useRef<HTMLDivElement>(null);
  const cleinOeil = React.useRef<HTMLDivElement>(null);
  const cleinOeil1 = React.useRef<HTMLImageElement>(null);
  const cleinOeil2 = React.useRef<HTMLImageElement>(null);
  const explosion = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!LongSvg.current) return;
  
    const LongLinePaths = LongSvg.current.querySelectorAll("path");
    const ExplosionPaths = explosion.current?.querySelectorAll("path");

  
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  
    // Animation sur les papiers
    tl.fromTo(paper1.current, { x: -600 }, { x: 0, duration: 1 })
      .fromTo(paper2.current, { x: 900 }, { x: 0, duration: 1 }, "<");
  
    // Effet drawSVG sur les paths de FullScreenline
    tl.from(LongLinePaths, {
      drawSVG: "0%",
      duration: 8,
    }, "sync+=0.3")
      .to(LongLinePaths, {
        drawSVG: "0%",
        duration: 45,
        ease: "none",
      }, "textStart");
      
    // Clein d'oeil apparition
    tl.fromTo(cleinOeil.current, {
      x: 500,
      opacity: 0,
    }, {
      x: 0,
      opacity: 1,
      duration: 3,
      ease: "power1.inOut",
    }, "textStart")  

    // Clein doeil animation
    tl.to(cleinOeil1.current, {
      opacity: 0,
      duration: 0,
      ease: "power1.inOut",
    }, "textStart+=10")

    // ShortSVG animation
    tl.to(ShortSvg.current, {
      opacity: 1,
      duration: 2,
      ease: "power1.inOut",
    }, "textStart")

    tl.to(explosion.current, {
      opacity: 1,
      duration: 2,
      ease: "power1.inOut",
    }, "textStart+=0.5")
    


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
    </div>
  );
};
