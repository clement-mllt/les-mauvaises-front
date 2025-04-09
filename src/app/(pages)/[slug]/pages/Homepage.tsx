// src/components/pages/Homepage.tsx
import React from "react";

interface HomepageProps {
  data: {
    Title: string;
    content: string;
    // Ajoute d'autres champs si nécessaire
  };
}

export default function Homepage({data}: HomepageProps) {
  return (
    <div>
      <p>news</p>
      <h2>{data.Title}</h2>
      <div>{data.content}</div>
    </div>
  );
}
