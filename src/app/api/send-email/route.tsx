// /app/api/send-email/route.ts
export const runtime = "nodejs"; // Force l’usage de Node.js plutôt que l’Edge Runtime

import {NextResponse} from "next/server";
import {Resend} from "resend";
import {render} from "@react-email/render";
import MailContact from "../../../../react-email-starter/emails/contact-meet";

const resend = new Resend(process.env.RESEND_API_KEY!);

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  const {recipientEmail} = await req.json();

  // 1) Validation du payload
  if (!recipientEmail) {
    return NextResponse.json(
      {success: false, error: "Le champ recipientEmail est requis."},
      {status: 400}
    );
  }
  if (!validateEmail(recipientEmail)) {
    return NextResponse.json(
      {success: false, error: "Adresse email invalide."},
      {status: 400}
    );
  }

  try {
    // 2) Génération du HTML depuis votre composant React‑Email
    const html = await render(<MailContact />);

    // 3) Envoi via Resend et destructuration de la réponse
    const {data: sendResult, error} = await resend.emails.send({
      from: `${process.env.FROM_NAME!} <${process.env.FROM_EMAIL!}>`,
      to: recipientEmail,
      subject: "Vous êtes prêt·e pour Stripe en live ! 💳",
      html, // doit être une string
    });

    // 4) Gestion d’une erreur renvoyée par le SDK Resend
    if (error) {
      console.error("⚠ Erreur Resend :", error);
      return NextResponse.json(
        {
          success: false,
          error: error.message ?? "Une erreur est survenue chez Resend.",
        },
        {status: 500}
      );
    }

    // 5) Vérification que l’ID existe bien dans sendResult
    if (!sendResult?.id) {
      console.error("⚠ Pas d’ID retourné :", sendResult);
      return NextResponse.json(
        {success: false, error: "Aucun message ID reçu de Resend."},
        {status: 500}
      );
    }

    // 6) Succès : on renvoie l’ID généré
    return NextResponse.json(
      {success: true, messageId: sendResult.id},
      {status: 200}
    );
  } catch (err) {
    console.error("✖ Erreur lors de l’envoi :", err);
    const msg = err instanceof Error ? err.message : "Erreur serveur inconnue.";
    return NextResponse.json({success: false, error: msg}, {status: 500});
  }
}
