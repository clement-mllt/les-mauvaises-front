// src/app/layout.tsx
import "./styles/globals.scss";
import style from "./styles/components/Layout.module.scss";
import Navbar from "../components/Navbar/Navbar.server";
import Footer from "../components/Footer/Footer.server";
import CustomHead from "../components/Seo/CustomHead";
import StructuredData from "../components/Seo/StructuredData";

export const metadata = {
  title: "Accueil | Nom du Site",
  description:
    "Description optimisée pour le SEO de la page d'accueil avec des mots-clés pertinents.",
  alternates: {
    canonical: "https://monsite.fr",
  },
  openGraph: {
    title: "Accueil | Nom du Site",
    description:
      "Une description optimisée pour le partage sur les réseaux sociaux.",
    url: "https://monsite.fr",
    siteName: "Nom du Site",
    images: [
      {
        url: "https://monsite.fr/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Image de prévisualisation",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Accueil | Nom du Site",
    description: "Description pour Twitter.",
    creator: "@votreCompte",
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: [
    {name: "author", content: "Nom de l'auteur"},
    {name: "keywords", content: "mot-clé1, mot-clé2, mot-clé3"},
  ],
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="fr">
      <head>
        <CustomHead />
        <StructuredData />
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
