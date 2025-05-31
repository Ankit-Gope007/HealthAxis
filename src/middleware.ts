// export { auth as middleware } from "@/auth"

// import { NextResponse } from "next/server";
// import { NextRequest } from "next/server";
// import jwt from "jsonwebtoken";
// import { verifyJWT } from "./app/api/auth/verifyJWT/route";


// export function middleware(request: NextRequest) {
//     const path = request.nextUrl.pathname;

//     const publicPaths = path == "/patient/login";

//      const token = request.cookies.get("token")?.value || "";

//         // const token = request.cookies.get("authjs.session-token")?.value || "";

//     console.log("Middleware path:", path);
//     console.log("Token exists:", !!token);

//     if (publicPaths && token) {
//         return NextResponse.redirect(new URL("/patient/dashboard", request.url));
//     }
//     if (!publicPaths && !token) {
//         return NextResponse.redirect(new URL("/patient/login", request.url));
//     }

//     if (token) {
//         try {
//            const decoded =  verifyJWT(token);
//         } catch (error) {
//             console.error("Invalid token:", error);
//             return NextResponse.redirect(new URL("/patient/login", request.url));
//         }
//     }

// }

// export const config = {
//     matcher: ["/patient/:path*", "/patient/login"],
    
// };



import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const publicPaths = path === "/patient/login";

  // Read the NextAuth session cookie
  const token =
    request.cookies.get("authjs.session-token")?.value || "";

  console.log("Middleware path:", path);
  console.log("Token exists:", !!token);

  // If user is logged in and trying to access login page → redirect to dashboard
  if (publicPaths && token) {
    return NextResponse.redirect(new URL("/patient/dashboard", request.url));
  }

  // If user is NOT logged in and trying to access a protected page → redirect to login
  if (!publicPaths && !token) {
    return NextResponse.redirect(new URL("/patient/login", request.url));
  }

  // Allow valid cases to continue
  return NextResponse.next();
}

export const config = {
  matcher: ["/patient/:path*", "/patient/login"],
};
