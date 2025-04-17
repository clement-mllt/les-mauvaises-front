// src/components/pages/Contact.tsx
import React from "react";
import {ContactContent} from "@/components/Contact/_sections/ContactContent";

interface ContactProps {
  data: {
    Title: string;
    // Ajoute d'autres champs si nécessaire
  };
}

export default function Contact({data}: ContactProps) {
  return <ContactContent />;
}
