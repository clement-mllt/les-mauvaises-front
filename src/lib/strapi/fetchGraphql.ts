const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_STRAPI_API_URL
  ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/graphql`
  : "http://127.0.0.1:1337/graphql"; // Fallback en local

const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN; // Token d'authentification

/**
 * Fonction générique pour exécuter des requêtes GraphQL sur Strapi
 * @param query La requête GraphQL sous forme de string
 * @param variables Les variables optionnelles pour la requête (par défaut vide)
 * @returns Les données extraites de la réponse GraphQL
 */
export async function fetchGraphQL<T>(
  query: string,
  variables: Record<string, any> = {}
): Promise<T | null> {
  try {

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (STRAPI_API_TOKEN) {
      headers["Authorization"] = `Bearer ${STRAPI_API_TOKEN}`;
    } else {
      console.warn(
        "⚠️ STRAPI_API_TOKEN n'est pas défini. Certaines requêtes peuvent échouer."
      );
    }

    const res = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify({query, variables}),
      next: {revalidate: 10}, // Revalidation every 10 seconds
    });

    if (!res.ok) {
      throw new Error(`Erreur API GraphQL: ${res.status} ${res.statusText}`);
    }

    const json = await res.json();

    console.log("🛰️ Requête envoyée à Strapi :", {
      query,
      variables,
      endpoint: GRAPHQL_ENDPOINT,
      headers,
    });

    const bodyPayload = JSON.stringify({query, variables});
    console.log("📦 Body JSON envoyé :", bodyPayload);

    if (json.errors) {
      console.error("GraphQL Errors:", json.errors);
      return null; // Retourne `null` au lieu de lever une erreur pour éviter de casser l’UI
    }

    if (!json.data) {
      throw new Error("Données manquantes dans la réponse GraphQL");
    }

    return json.data as T;
  } catch (error) {
    console.error("GraphQL Fetch Error:", error);
    return null;
  }
}
