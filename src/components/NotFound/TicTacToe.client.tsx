"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { LesMauvaises } from "@/utils/fonts";
import style from "@/app/styles/components/Not-found.module.scss";
import Line404 from "@/components/Icons/Line404";

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);

interface TicTacToeProps {
  userScore: number;
  botScore: number;
  setUserScore: React.Dispatch<React.SetStateAction<number>>;
  setBotScore: React.Dispatch<React.SetStateAction<number>>;
}

function TicTacToe({ userScore, botScore, setUserScore, setBotScore }: TicTacToeProps) {
  const [board, setBoard] = useState(Array(9).fill(""));
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [winner, setWinner] = useState<string | null>(null);

  // Référence pour animer le texte de statut
  const statusRef = useRef<HTMLDivElement>(null);

  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const checkWinner = (newBoard: string[]): string | null => {
    for (let combo of winningCombinations) {
      const [a, b, c] = combo;
      if (
        newBoard[a] &&
        newBoard[a] === newBoard[b] &&
        newBoard[a] === newBoard[c]
      ) {
        return newBoard[a];
      }
    }
    if (newBoard.every((cell) => cell !== "")) {
      return "Draw";
    }
    return null;
  };

  const handleClick = (index: number): void => {
    if (board[index] !== "" || winner || currentPlayer !== "X") return;
    const newBoard = [...board];
    newBoard[index] = "X";
    const result = checkWinner(newBoard);
    setBoard(newBoard);
    if (result) {
      setWinner(result);
    } else {
      setCurrentPlayer("O");
    }
  };

  // Tour du bot : joue après 500ms si c'est son tour
  useEffect(() => {
    if (currentPlayer === "O" && !winner) {
      const botTimeout = setTimeout(() => {
        const availableMoves = board
          .map((cell, index) => (cell === "" ? index : null))
          .filter((index) => index !== null) as number[];
        if (availableMoves.length > 0) {
          const randomIndex =
            availableMoves[Math.floor(Math.random() * availableMoves.length)];
          const newBoard = [...board];
          newBoard[randomIndex] = "O";
          const result = checkWinner(newBoard);
          setBoard(newBoard);
          if (result) {
            setWinner(result);
          } else {
            setCurrentPlayer("X");
          }
        }
      }, 500);
      return () => clearTimeout(botTimeout);
    }
  }, [board, currentPlayer, winner]);

  const resetGame = () => {
    setBoard(Array(9).fill(""));
    setCurrentPlayer("X");
    setWinner(null);
  };

  // (Optionnel) Animation GSAP simple sur les cellules
  useEffect(() => {
   
  }, [board]);

  // Lorsqu'une partie se termine, on anime le texte via SplitText, met à jour le score et réinitialise le jeu après 2 secondes
  useEffect(() => {
    if (winner && statusRef.current) {
      let message = "";
      if (winner === "X") {
        message = "Bien vu chef !";
        setUserScore((prev) => prev + 1);
      } else if (winner === "O") {
        message = "Boooh le looser !";
        setBotScore((prev) => prev + 1);
      } else {
        message = "Here we go again !";
      }

      statusRef.current.innerText = message;

      const split = new SplitText(statusRef.current, { type: "chars" });
      gsap.from(split.chars, {
        opacity: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: "power2.out",
      });

      const timeout = setTimeout(() => {
        resetGame();
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [winner, setUserScore, setBotScore]);

  return (
    <div className={style.ticTacToeContainer}>
      <div className={style.ticTacToeBoard}>
        <div className={style.Line404}>
          <Line404 />
          <Line404 />
          <Line404 />
          <Line404 />
        </div>
        {board.map((cell, index) => (
          <div
            key={index}
            className={`${style.cell} ${LesMauvaises.className} cell`}
            onClick={() => handleClick(index)}
          >
            {cell && <span className={style.cellMark}>{cell}</span>}
          </div>
        ))}
      </div>
      <div
        ref={statusRef}
        className={`${style.gameStatus} ${LesMauvaises.className}`}
      >
        {winner
          ? winner === "X"
            ? "Bien vu chef !"
            : winner === "O"
            ? "Boooh le looser !"
            : "Here we go again !"
          : ""}
      </div>
    </div>
  );
}

export default TicTacToe;
