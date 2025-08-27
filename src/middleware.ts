import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value || null;

  // Si no hay token y quiere entrar a /usuarios, lo mandamos al login
  if (!token && req.nextUrl.pathname.startsWith("/usuarios") ||
        !token && req.nextUrl.pathname.startsWith("/galeria") ||
        !token && req.nextUrl.pathname.startsWith("/mapa")


) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/usuarios/:path*",
    "/galeria/:path*",
    "/mapa/:path*"
  ], 
};
