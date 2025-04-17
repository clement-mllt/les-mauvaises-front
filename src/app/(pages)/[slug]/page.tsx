// src/app/[slug]/page.tsx
import {fetchPageContent} from "@/lib/strapi/page";
import {Metadata} from "next";
import NotFoundPage from "@/app/not-found";

// Exporter la fonction generateMetadata pour générer des métadonnées dynamiques
export async function generateMetadata({
  params,
}: {
  params: {slug: string} | Promise<{slug: string}>;
}): Promise<Metadata> {
  // Attendre que params soit résolu
  const {slug} = await params;

  // Récupérer le domaine depuis une variable d'environnement ou utiliser une valeur par défaut
  const siteUrl = process.env.NEXTAUTH_URL || "https://les-mauvaises.fr";

  // Récupérer les données spécifiques à la page en fonction du slug
  const pageData = await fetchPageContent(slug);

  if (!pageData) {
    return {
      title: "Page introuvable",
      description: "La page demandée n'existe pas.",
    };
  }

  // Construire l'objet de métadonnées en se basant sur les données récupérées
  return {
    title: pageData.SEO.Title || "Agence Les Mauvaises",
    description:
      pageData.SEO.Description[0].children[0].text ||
      "Description par défaut de la page.",
    alternates: {
      canonical: `${siteUrl}/${slug}`,
    },
    openGraph: {
      title: pageData.SEO.Title || "Agence Les Mauvaises",
      description:
        pageData.SEO.Description[0].children[0].text ||
        "Description par défaut de la page.",
      url: `${siteUrl}/${slug}`,
      siteName: "AGENCE LES MAUVAISES",
      images: [
        {
          url: pageData.SEO.CoverImage.url,
          width: 1920,
          height: 1080,
          alt: pageData.SEO.Title || "Agence Les Mauvaises",
        },
      ],
      locale: "fr_FR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: pageData.SEO.Title || "Agence Les Mauvaises",
      description:
        pageData.SEO.Description[0].children[0].text ||
        "Description par défaut de la page.",
    },
  };
}

// Importer vos composants spécifiques
import Homepage from "./pages/Homepage";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import DefaultPage from "@/app/not-found";

// Définir un mapping slug => composant
const componentMapping: Record<
  string,
  React.ComponentType<{data: {Title: string}}>
> = {
  homepage: Homepage as React.ComponentType<{data: {Title: string}}>,
  contact: Contact as React.ComponentType<{data: {Title: string}}>,
  services: Services as React.ComponentType<{data: {Title: string}}>,
};
export default async function Page({
  params,
}: {
  params: {slug: string} | Promise<{slug: string}>;
}) {
  // Attendre que params soit résolu
  const {slug} = await params;

  // Récupérer les données depuis Strapi pour le slug donné
  const pageData = await fetchPageContent(slug);
  console.log("Page Data:", pageData);
  
  if (!pageData) {    
    return <NotFoundPage />;
  }

  // Sélectionner le composant en fonction du slug, ou utiliser le composant par défaut
  const PageComponent = componentMapping[slug.toLowerCase()] || DefaultPage;

  return (
    <section>
      {/* Le composant choisi reçoit les données en props */}
      <PageComponent data={pageData} />
    </section>
  );
}
