import React from 'react'
import style from "@/app/styles/components/Homepage.module.scss";
import {MadeSoulmaze, LesMauvaises, Quicksand} from "@/utils/fonts";

export const HomeMotsCroise = () => {

    // const sectionMotCroise = document.querySelector(".sectionMotCroise");
    // const motCroiseContainer = document.querySelector(".motCroise");

    // const tl = gsap.timeline({
    //   scrollTrigger: {
    //     trigger: sectionMotCroise,
    //     start: "top+=100 top",
    //     end: "+=800px",
    //     scrub: true,
    //   },
    // });

    // const grid = [
    //   ["R", "B", "v", "I", "M", "P", "Z", "C", "S", "G"],
    //   ["Q", "O", "L", null, null, "A", null, "Y", "V", "D"],
    //   ["A", "F", null, "H", "D", "G", null, "X", "U", "K"],
    //   ["V", "U", null, "C", "U", "T", null, "A", null, "I"],
    //   ["J", "I", null, "K", "S", "D", null, "Y", null, "H"],
    //   ["G", null, null, null, null, null, null, null, null, null],
    //   [null, null, null, null, null, null, null, null, null, "M"],
    //   ["N", "E", "W", "U", "B", "D", null, "Z", "I", "C"],
    //   [null, null, null, null, null, null, null, null, "E", "S"],
    //   ["E", "Z", "C", "O", "R", "A", "M", "D", "P", "T"],
    // ];

    // const highLightGrid = [
    //   "U",
    //   "X",
    //   "C",
    //   "S",
    //   "R",
    //   "I",
    //   "E",
    //   "S",
    //   "T",
    //   "A",
    //   "E",
    //   "R",
    //   "E",
    //   "D",
    //   "A",
    //   "C",
    //   "T",
    //   "I",
    //   "O",
    //   "N",
    //   "A",
    //   "N",
    //   "I",
    //   "M",
    //   "A",
    //   "T",
    //   "I",
    //   "O",
    //   "N",
    //   "O",
    //   "B",
    //   "R",
    //   "A",
    //   "N",
    //   "D",
    //   "I",
    //   "N",
    //   "G",
    // ];

    // let html = "";
    // grid.forEach((row, i) => {
    //   html += '<div class="row">';
    //   row.forEach((cell, j) => {
    //     if (cell === null) {
    //       html += `<span class="letter blank" data-row="${i}" data-col="${j}"></span>`;
    //     } else {
    //       html += `<span class="letter" data-row="${i}" data-col="${j}">${cell}</span>`;
    //     }
    //   });
    //   html += "</div>";
    // });
    // motCroiseContainer.innerHTML = html;

    // tl.from(".letter", {
    //   opacity: 0,
    //   duration: 0.5,
    //   stagger: (index, target) => {
    //     const row = parseInt(target.getAttribute("data-row"));
    //     const col = parseInt(target.getAttribute("data-col"));
    //     return (row + col) * 0.1;
    //   },
    // });

    // const blankLetters = document.querySelectorAll(".blank");
    // blankLetters.forEach((letter, index) => {
    //   letter.innerText = highLightGrid[index];
    // });

    // tl.to(".letter.blank", {
    //   color: "#C62468",
    //   duration: 0.5,
    //   stagger: (index, target) => {
    //     const row = parseInt(target.getAttribute("data-row"));
    //     const col = parseInt(target.getAttribute("data-col"));
    //     return (row + col) * 0.1;
    //   },
    // });



  return (
    <div className={`${style.HomeMotsCroise}  navStop`}>
        <div className={`${style.texteMotsCroise} ${MadeSoulmaze.className}`}>
            <p className={`${style.title1} `}>parce que</p>
            <p className={`${style.title2} `}>trop</p>
            <p className={`${style.titlt3} `}>c'est jamais assez,</p>
            <p className={`${style.titlt3} `}>on a décidé de te</p>
            <p className={`${style.title4} `}>proposer</p>
        </div>

        <div className={`${style.sectionMotCroise}`}>
            <div className={`${style.motCroise}`}>
            </div>
        </div>
    </div>
  )
}
