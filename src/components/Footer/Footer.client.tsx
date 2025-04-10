"use client";
import Link from "next/link";
import React, {LinkHTMLAttributes, useEffect, useRef, useState} from "react";
import styles from "@/app/styles/components/Footer.module.scss";
import Favicon from "@/components/Icons/Favicon";
import Logo from "@/components/Icons/Logo";
import LineLogo from "@/components/Icons/LineLogo";
import OpenMenu from "@/components/Icons/OpenMenu";
import gsap from "gsap";
import {DrawSVGPlugin} from "gsap/DrawSVGPlugin";
import {SplitText} from "gsap/SplitText";
import {MadeSoulmaze, LesMauvaises, Quicksand} from "@/utils/fonts";
import Form from "next/form";
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

interface FooterClientProps {
  menuItems: MenuItem[];
}

export default function FooterClient({menuItems}: FooterClientProps) {
  const FaviconRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const faviconElement = FaviconRef?.current?.children[0]
      .firstChild as SVGElement;
    const faviconElementPaths =
      FaviconRef?.current?.children[0].querySelectorAll(
        "path"
      ) as NodeListOf<SVGPathElement>;

    console.log(faviconElement);

    updateChosenColorsForElements(
      [faviconElement as unknown as HTMLElement],
      "fill",
      {blackWhite: false}
    );
    updateChosenColorsForElements(
      Array.from(faviconElementPaths).map(
        (path) => path as unknown as HTMLElement
      ),
      "fill",
      {blackWhite: true}
    );
  }, []);

  return (
    <footer className={`${styles.footer}`}>
      <div className={styles.containerTop}>
        <div ref={FaviconRef} className={styles.containerLogo}>
          <Favicon />
        </div>
        <div className={`${styles.containerSocial} ${MadeSoulmaze.className}`}>
          <div>
            <Link href="#">Instagram</Link>
          </div>
          <div>
            <Link href="#">Pinterest</Link>
          </div>
          <div>
            <Link href="#">Linkedin</Link>
          </div>
          <div>
            <Link href="#">Behance</Link>
          </div>
          <div>
            <Link href="#">Tiktok</Link>
          </div>
        </div>
      </div>
      <div className={styles.containerBottom}>
        <div className={styles.containerNewsletter}>
          <div className={styles.textContent}>
            <span className={MadeSoulmaze.className}>Newsletter</span>
            <p className={Quicksand.className}>
              Le rendez-vous des esprits curieux et créatifs. Entre dans le club
              !
            </p>
          </div>
          <div className={styles.formNewsletter}>
            <Form action="/search">
              <div>
                <input
                  className={Quicksand.className}
                  placeholder="Adresse Mail"
                  type="email"
                  name="email"
                />
                <div className={styles.separator}></div>
                <input
                  className={Quicksand.className}
                  placeholder="Prénom"
                  type="text"
                  name="name"
                />
              </div>
              <button type="submit">Envoyer</button>
            </Form>
          </div>
        </div>
        <div className={styles.containerCredentials}>
          <div className={styles.containerCopyright}>
            <p className={Quicksand.className}>
              ©{new Date().getFullYear()} Agence Les Mauvaises
            </p>
          </div>
          <div className={styles.containerLegal}>
            <ul>
              {[...menuItems].reverse().map((item, index) => (
                <li key={index}>
                  <Link className={Quicksand.className} href={`/${item.slug}`}>
                    {item.Title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
