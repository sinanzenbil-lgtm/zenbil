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
  // NextAuth v5 uses "authjs.session-token" for HTTP and "__Secure-authjs.session-token" for HTTPS
  const sessionToken = req.cookies.get("authjs.session-token") || 
                      req.cookies.get("__Secure-authjs.session-token");

  if (!sessionToken) {
    // Session yoksa login sayfasına yönlendir
    return NextResponse.redirect(new URL("/admin/giris", req.url));
  }

  // Session varsa devam et
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
