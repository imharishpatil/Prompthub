import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const protectedRoutes = ["/dashboard", "/create", "/profile"]
const authRoutes = ["/auth/signin", "/auth/signup"]

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // Check for auth token in cookies or localStorage (handled client-side)
  const authToken = req.cookies.get("auth_token")?.value

  // If accessing protected route without token, redirect to sign-in
  if (isProtected && !authToken) {
    const signInUrl = new URL("/auth/signin", req.url)
    signInUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(signInUrl)
  }

  // If accessing auth routes with token, redirect to dashboard
  if (isAuthRoute && authToken) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/create/:path*", "/profile/:path*", "/auth/:path*"],
}
