"use client";

import React, { useEffect, useRef } from "react";
import style from "@/app/styles/components/Homepage.module.scss";
import { MadeSoulmaze } from "@/utils/fonts";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const HomeMotsCroise = () => {
  const motCroiseRef = useRef<HTMLDivElement>(null);

  const grid = [
    ["R", "B", "v", "I", "M", "P", "Z", "C", "S", "G"],
    ["Q", "O", "L", null, null, "A", null, "Y", "V", "D"],
    ["A", "F", null, "H", "D", "G", null, "X", "U", "K"],
    ["V", "U", null, "C", "U", "T", null, "A", null, "I"],
    ["J", "I", null, "K", "S", "D", null, "Y", null, "H"],
    ["G", null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, "M"],
    ["N", "E", "W", "U", "B", "D", null, "Z", "I", "C"],
    [null, null, null, null, null, null, null, null, "E", "S"],
    ["E", "Z", "C", "O", "R", "A", "M", "D", "P", "T"],
  ];

  const highLightGrid = [
    "U",
    "X",
    "C",
    "S",
    "R",
    "I",
    "E",
    "S",
    "T",
    "A",
    "E",
    "R",
    "E",
    "D",
    "A",
    "C",
    "T",
    "I",
    "O",
    "N",
    "A",
    "N",
    "I",
    "M",
    "A",
    "T",
    "I",
    "O",
    "N",
    "O",
    "B",
    "R",
    "A",
    "N",
    "D",
    "I",
    "N",
    "G",
  ];

  useEffect(() => {
    const sectionMotCroise = document.querySelector(
      `.${style.sectionMotCroise}`
    );
    const letters = gsap.utils.toArray<HTMLElement>(
    `.${style.motCroise} .${style.letter}`
    );

    console.log(letters, "letters");
    

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionMotCroise,
        start: "top-=100 top",
        end: "+=700px",
        scrub: true,
      },
    });

    tl.to(letters, {
      opacity: 1,
      duration: 0.5,
      stagger: (index, target) => {
        const row = parseInt(target.getAttribute("data-row") || "0");
        const col = parseInt(target.getAttribute("data-col") || "0");
        return (row + col) * 0.1;
      },
    });

    const blankLetters = document.querySelectorAll(
      `.${style.motCroise} .blank`
    );
    blankLetters.forEach((letter, index) => {
      letter.textContent = highLightGrid[index] || "";
    });
;

    tl.to(`.${style.motCroise} .blank`, {
      color: "#C62468",
      duration: 0.5,
      stagger: (index, target) => {
        const row = parseInt(target.getAttribute("data-row") || "0");
        const col = parseInt(target.getAttribute("data-col") || "0");
        return (row + col) * 0.1;
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className={`${style.HomeMotsCroise} navStop`}>
      <div className={`${style.texteMotsCroise} ${MadeSoulmaze.className}`}>
        <p className={style.title1}>parce que</p>
        <p className={style.title2}>trop</p>
        <p className={style.titlt3}>c'est jamais assez,</p>
        <p className={style.titlt3}>on a décidé de te</p>
        <p className={style.title4}>proposer</p>
      </div>

      <div className={style.sectionMotCroise}>
        <div className={style.motCroise} ref={motCroiseRef}>
          {grid.map((row, rowIndex) => (
            <div className={style.row} key={`row-${rowIndex}`}>
              {row.map((cell, colIndex) => {
                const baseClass = `${style.letter} ${MadeSoulmaze.className}`;
                if (cell === null) {
                  return (
                    <span
                      key={`cell-${rowIndex}-${colIndex}`}
                      className={`${baseClass} blank`}
                      data-row={rowIndex}
                      data-col={colIndex}
                    />
                  );
                }
                return (
                  <span
                    key={`cell-${rowIndex}-${colIndex}`}
                    className={baseClass}
                    data-row={rowIndex}
                    data-col={colIndex}
                  >
                    {cell.toUpperCase()}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
