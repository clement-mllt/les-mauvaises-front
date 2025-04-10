// src/components/CustomHead.tsx
import Head from "next/head";

const CustomHead = () => {
  return (
    <Head>
      {/* Encodage et informations de langue */}
      <meta charSet="UTF-8" />
      <meta httpEquiv="Content-Language" content="fr" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Balises principales de titre et description */}
      <title>Accueil | Nom du Site</title>
      <meta name="title" content="Accueil | Nom du Site" />
      <meta
        name="description"
        content="Description optimisée pour le SEO de la page d'accueil avec des mots-clés pertinents."
      />

      {/* Open Graph (pour Facebook et autres réseaux sociaux) */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://monsite.fr" />
      <meta property="og:title" content="Accueil | Nom du Site" />
      <meta
        property="og:description"
        content="Une description optimisée pour le partage sur les réseaux sociaux."
      />
      <meta
        property="og:image"
        content="https://monsite.fr/images/og-image.jpg"
      />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content="https://monsite.fr" />
      <meta name="twitter:title" content="Accueil | Nom du Site" />
      <meta name="twitter:description" content="Description pour Twitter." />
      <meta
        name="twitter:image"
        content="https://monsite.fr/images/og-image.jpg"
      />
      <meta name="twitter:creator" content="@votreCompte" />

      {/* Directives pour les robots */}
      <meta name="robots" content="index, follow" />
      <meta
        name="googlebot"
        content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
      />

      {/* Autres informations utiles */}
      <meta name="author" content="Nom de l'auteur" />
      <meta name="keywords" content="mot-clé1, mot-clé2, mot-clé3" />

      {/* Favicon et icônes */}
      <link rel="icon" href="/favicon.ico" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link rel="manifest" href="/site.webmanifest" />

      {/* URL canonique */}
      <link rel="canonical" href="https://monsite.fr" />
    </Head>
  );
};

export default CustomHead;
