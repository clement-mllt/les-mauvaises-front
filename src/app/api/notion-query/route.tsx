// src/app/api/notion-query/route.ts
import {NextResponse} from "next/server";
import {Client} from "@notionhq/client";

// Fonction utilitaire pour convertir le nom du mois en numéro (format à deux chiffres)
function getMonthNumber(monthName: string): string {
  const months = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];
  const monthIndex = months.findIndex(
    (m) => m.toLowerCase() === monthName.toLowerCase()
  );
  if (monthIndex === -1) {
    throw new Error("Mois invalide : " + monthName);
  }
  return (monthIndex + 1).toString().padStart(2, "0");
}

// Instanciation du client Notion avec la clé API
const notion = new Client({auth: process.env.NOTION_API_KEY});

export async function POST(request: Request) {
  try {
    // Récupérer le corps de la requête au format JSON
    const body = await request.json();
    const {date} = body;
    if (!date || !date.day || !date.month) {
      return NextResponse.json(
        {error: "Paramètres de date manquants"},
        {status: 400}
      );
    }

    // Générer la targetDate au format "2025-MM-DD"
    const monthNumber = getMonthNumber(date.month);
    const targetDate = `2025-${monthNumber}-${date.day}`;

    const database_id = process.env.NOTION_DATABASE_ID;
    if (!database_id) {
      throw new Error("Variable d'environnement NOTION_DATABASE_ID manquante");
    }

    // Interroger Notion pour récupérer les pages filtrées par la propriété "Date"
    const notionResponse = await notion.databases.query({
      database_id: database_id,
      filter: {
        property: "Date de l'évènement", // ← celui-ci est bon
        date: {
          equals: targetDate,
        },
      },
    });

    if (!notionResponse) {
      throw new Error("La réponse de Notion est vide");
    }

    return NextResponse.json(notionResponse);
  } catch (error: any) {
    console.error("Erreur dans /api/notion-query:", error);
    return NextResponse.json({error: error.message}, {status: 500});
  }
}
