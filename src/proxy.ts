import { NextResponse } from "next/server";
import { auth } from "./auth";

export default auth((request) => {
  const { pathname } = request.nextUrl;
  const isAuthenticated = !!request.auth;

  const authRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/verify-code",
    "/reset-password",
  ];
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  const protectedRoutes = [
    "/cart",
    "/createorder",
    "/allorders",
    "/profile",
    "/wishlist",
  ];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/login",
    "/register",
    "/forgot-password",
    "/verify-code",
    "/reset-password",
    "/cart/:path*",
    "/createorder/:path*",
    "/allorders/:path*",
    "/profile/:path*",
    "/wishlist/:path*",
  ],
};
