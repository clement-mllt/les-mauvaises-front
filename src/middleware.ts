import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";

export function middleware(request: NextRequest) {
  // Vérifiez si le chemin est exactement "/"
  if (request.nextUrl.pathname === "/") {
    // Créez une nouvelle URL basée sur la requête et changez le pathname vers "/home"
    const url = request.nextUrl.clone();
    url.pathname = "/home";
    return NextResponse.redirect(url);
  }
  // Pour toutes les autres routes, laissez passer la requête normalement
  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
