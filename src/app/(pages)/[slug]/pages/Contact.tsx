// src/components/pages/Contact.tsx
import React from "react";

interface ContactProps {
  data: {
    Title: string;
    // Ajoute d'autres champs si nécessaire
  };
}

export default function Contact({data}: ContactProps) {
  console.log(data.Title);

  return (
    <div>
      <h2>{data.Title}</h2>
    </div>
  );
}
