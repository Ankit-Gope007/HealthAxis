// export { auth as middleware } from "@/auth"

import { NextResponse } from "next/server";
import { NextRequest } from "next/server";


export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    const publicPaths = path == "/patient/login";

    const token = request.cookies.get("authjs.session-token")?.value || "";

    console.log("Middleware path:", path);
    console.log("Token exists:", !!token);

    if (publicPaths && token) {
        return NextResponse.redirect(new URL("/patient/dashboard", request.url));
    }
    if (!publicPaths && !token) {
        return NextResponse.redirect(new URL("/patient/login", request.url));
    }

}

export const config = {
    matcher: ["/patient/:path*", "/patient/login"],
};