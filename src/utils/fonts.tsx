// fonts.js
import localFont from "next/font/local";

// -- 1. Director (light) --
export const Director = localFont({
  src: [
    {
      path: "../../public/fonts/director-light.ttf",
      weight: "300",
      style: "normal",
    },
  ],
  variable: "--font-director", // CSS variable optionnelle
});

// -- 2. Gotham (book) --
export const GothamBook = localFont({
  src: [
    {
      path: "../../public/fonts/gotham-book.ttf",
      weight: "400", // "Book" est souvent un 400
      style: "normal",
    },
  ],
  variable: "--font-gotham-book",
});

// -- 3. Junicode --
export const Junicode = localFont({
  src: [
    {
      path: "../../public/fonts/junicode.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-junicode",
});

// -- 4. Les Mauvaises (woff2) --
export const LesMauvaises = localFont({
  src: [
    {
      path: "../../public/fonts/LesMauvaises.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-lesmauvaises",
});

// -- 5. Made Soulmaze (personal use) --
export const MadeSoulmaze = localFont({
  src: [
    {
      path: "../../public/fonts/made-soulmaze-personal-use-1.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-made-soulmaze",
});

// -- 6. Optimal T Std (regular & bold) --
export const OptimalTStd = localFont({
  src: [
    {
      path: "../../public/fonts/optimaltstd.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/optimaltstd-bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-optimaltstd",
});

// -- 7. Quicksand (light, regular, medium, semibold, bold) --
export const Quicksand = localFont({
  src: [
    {
      path: "../../public/fonts/quicksand-light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/quicksand-regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/quicksand-medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/quicksand-semibold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/quicksand-bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-quicksand",
});

// -- 8. Russo One (regular) --
export const RussoOne = localFont({
  src: [
    {
      path: "../../public/fonts/russoone-regular.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-russoone",
});

// -- 9. Source Sans Pro (regular) --
export const SourceSansPro = localFont({
  src: [
    {
      path: "../../public/fonts/sourcesanspro-regular.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-sourcesanspro",
});
