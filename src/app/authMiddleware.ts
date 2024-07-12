import { NextRequest, NextResponse } from "next/server";

export function authMiddleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const role = req.cookies.get("user")?.value;
  console.log("Middleware is running");
  
  if (!token) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // Paths that require authentication
  const protectedPaths = ["/dashboard"];

  // Check for authentication and role
  if (protectedPaths.some((path) => req.nextUrl.pathname.startsWith(path))) {
    console.log("Protected path:", req.nextUrl.pathname);
    if (role === "admin") {
      if (req.nextUrl.pathname !== "/dashboard") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    } else if (role === "student") {
      // Redirect non-admin users to the homepage
      return NextResponse.redirect(new URL("/", req.url));
    } else {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }

  return NextResponse.next();
}
