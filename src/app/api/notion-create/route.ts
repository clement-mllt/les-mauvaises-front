

// src/app/api/notion-create/route.ts
import { NextResponse } from "next/server";
import { Client } from "@notionhq/client";

// Instanciation du client Notion avec la clé API
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const database_id = process.env.NOTION_DATABASE_ID;

if (!database_id) {
  throw new Error("Variable d'environnement NOTION_DATABASE_ID manquante");
}

export async function POST(request: Request) {
  try {
    // Récupérer le corps de la requête au format JSON
    const body = await request.json();
    const {
      name,
      description,
      email,
      phone,
      start_date: startDate,
      end_date: endDate,
    } = body;

    if (!name || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Paramètres manquants: name, start_date ou end_date" },
        { status: 400 }
      );
    }

    // Générer un lien Google Meet via Google Calendar
    const googleMeetLink = [
      "https://calendar.google.com/calendar/u/0/r/eventedit?dates=",
      encodeURIComponent(startDate.replace(/[-:]/g, "")),
      "/",
      encodeURIComponent(endDate.replace(/[-:]/g, "")),
      "&text=",
      encodeURIComponent(name),
      "&details=",
      encodeURIComponent(description || ""),
    ].join("");

    // Préparer les propriétés pour Notion
    const pageProperties = {
      title: {
        title: [
          {
            text: { content: name },
          },
        ],
      },
      "Nom": {
        rich_text: [
          {
            text: { content: name },
          },
        ],
      },
      "Description": {
        rich_text: [
          {
            text: { content: description || "" },
          },
        ],
      },
      "Email de contact": {
        email: email || null,
      },
      "Téléphone de contact": {
        phone_number: phone || null,
      },
      "Date de l'évènement": {
        date: {
          start: startDate,
          end: endDate,
        },
      },
      "URL": {
        url: googleMeetLink,
      },
    };

    // Appel à l'API Notion pour créer la page
    const response = await notion.pages.create({
      parent: { database_id: database_id as string },
      properties: pageProperties,
    });

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Erreur dans /api/notion-create:", error);
    return NextResponse.json(
      { error: error.message || "Erreur interne" },
      { status: 500 }
    );
  }
}