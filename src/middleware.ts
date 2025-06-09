import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";



export function middleware(request: NextRequest) {
    // getting the pathname from the url
    const path = request.nextUrl.pathname;

    // determinig the public paths
    const publicPaths = path == '/patient/login';

    // getting the token from the cookies
    const token = request.cookies.get('authjs.session-token') || request.cookies.get('next-auth.csrf-token');

    // if path is public and token is present, redirect to dashboard
    if (publicPaths && token) {
        return NextResponse.redirect(new URL('/patient/dashboard', request.url));
    }

    // if path is not public and token is not present, redirect to login
    if (!publicPaths && !token) {
        return NextResponse.redirect(new URL('/patient/login', request.url));
    }

   
}

export const config ={
    matcher: [
        '/patient/:path*',
    ]
}