// src/app/[slug]/page.tsx
import {fetchPageContent} from "@/lib/strapi/page";

// Importer les composants spécifiques
import Homepage from "./pages/Homepage";
import Contact from "./pages/Contact";
import DefaultPage from "@/app/not-found";

// Définir un mapping slug => composant
const componentMapping: Record<
  string,
  React.ComponentType<{data: {Title: string}}>
> = {
  homepage: Homepage,
  contact: Contact,
};

export default async function Page({params}: {params: {slug: string}}) {
  const {slug} = params;
  

  // Récupérer les données depuis Strapi pour le slug donné
  const pageData = await fetchPageContent(slug);
  if (!pageData) {
    return <div>Page introuvable</div>;
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
