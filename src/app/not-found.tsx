"use client";

import React, { useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { MadeSoulmaze, LesMauvaises } from "@/utils/fonts";
import style from "@/app/styles/components/Not-found.module.scss";
import Line404 from "@/components/Icons/Line404";
import TicTacToe from "@/components/NotFound/TicTacToe.client"; // Assurez-vous du chemin

export default function NotFoundPage() {
  // Déclaration des états des scores dans le parent
  const [userScore, setUserScore] = useState(0);
  const [botScore, setBotScore] = useState(0);

  return (
    <>
      <div className={style.notFoundContainer}>
        <div className={style.notFoundMessage}>
          <div className={style.notFoundMessageText}>
            <div className={`${style.title} ${MadeSoulmaze.className}`}>
              PAGE INTROUVABLE
            </div>
            <div className={`${style.subtitle} ${LesMauvaises.className}`}>
              <p>oh purée,
              ça marche pô !</p>
            </div>
          </div>
          <div className={style.notFoundMessageScore}>
            <div className={`${style.notFoundMessageScorePlace} ${LesMauvaises.className}`}>
              <div>
                <p>toi : {userScore}</p>
                <p>nous : {botScore}</p>
              </div>
              <Line404 />
            </div>
          </div>
        </div>
        <div className={style.notFoundGame}>
          {/* Passage des états et des setters en props vers TicTacToe */}
          <TicTacToe 
            userScore={userScore} 
            botScore={botScore} 
            setUserScore={setUserScore} 
            setBotScore={setBotScore} 
          />
        </div>
      </div>
    </>
  );
}
