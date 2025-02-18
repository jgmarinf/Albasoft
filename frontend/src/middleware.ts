import type { JWT } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token as JWT;

    // Redirigir autenticados desde auth
    if (pathname.startsWith("/auth") && token) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Control de roles
    if (pathname.startsWith("/dashboard")) {
      if (!token) return NextResponse.redirect(new URL("/auth/login", req.url));

      // Acceso para admin
      if (token.role === "admin") {
        if (pathname === "/dashboard") {
          return NextResponse.redirect(new URL("/dashboard/projects", req.url));
        }
      }
      // Restricción para usuarios normales
      else if (token.role === "user") {
        if (pathname.startsWith("/dashboard/admin")) {
          return NextResponse.redirect(new URL("/dashboard", req.url));
        }
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Ruta /auth siempre permite acceso
        if (req.nextUrl.pathname.startsWith("/auth")) return true;

        // Verificar autenticación para otras rutas
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/auth/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
