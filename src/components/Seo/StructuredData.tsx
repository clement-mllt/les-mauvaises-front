// src/components/StructuredData.tsx
import React from "react";

export default function StructuredData() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: "http://localhost:3000",
    name: "Nom du Site",
    inLanguage: "fr",
    potentialAction: {
      "@type": "SearchAction",
      target: "http://localhost:3000/recherche?query={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{__html: JSON.stringify(schemaData)}}
    />
  );
}
