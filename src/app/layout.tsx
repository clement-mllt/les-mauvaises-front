// src/app/layout.tsx
import localFont from "next/font/local";
import "./styles/globals.scss";
import style from "./styles/components/Layout.module.scss";
import Navbar from "../components/Navbar/Navbar.server";

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="fr">
      <body>
        <Navbar />
        <div className={style.container}>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
