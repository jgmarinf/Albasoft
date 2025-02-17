import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

interface UserToken {
  user?: {
    role: string;
  };
}

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token as UserToken;

    // Redirigir usuarios autenticados que intentan acceder a rutas de autenticación
    if (pathname.startsWith("/auth") && token) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Control de acceso basado en roles
    if (pathname.startsWith("/dashboard")) {
      if (!token) return NextResponse.redirect(new URL("/auth/login", req.url));

      if (token.user?.role === "admin") {
        if (pathname === "/dashboard") {
          return NextResponse.redirect(new URL("/dashboard/projects", req.url));
        }
      } else if (token.user?.role === "user") {
        if (pathname.startsWith("/dashboard/")) {
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
