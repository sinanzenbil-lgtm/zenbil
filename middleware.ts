import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isLoginPage = req.nextUrl.pathname === "/admin/giris";
  
  // Admin route değilse devam et
  if (!isAdminRoute) {
    return NextResponse.next();
  }

  // Login sayfasındaysa devam et
  if (isLoginPage) {
    return NextResponse.next();
  }

  // Admin route'ta - session kontrolü yap (NextAuth cookie kontrol)
  const sessionToken = req.cookies.get("authjs.session-token") || 
                      req.cookies.get("__Secure-authjs.session-token");

  if (!sessionToken) {
    return NextResponse.redirect(new URL("/admin/giris", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
