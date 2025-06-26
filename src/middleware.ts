
import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Identify which section of the app the request is hitting
  const isPatientPath = path.startsWith("/patient");
  const isDoctorPath = path.startsWith("/doctor");
  const isAdminPath = path.startsWith("/admin");

  // Identify login pages
  const isPatientLogin = path === "/patient/login" || path === "/patient/signup";
  const isDoctorLogin = path === "/doctor/login"|| path === "/doctor/register";
  const isAdminLogin = path === "/admin/login";

  // Get tokens from cookies
  const patientToken = request.cookies.get("authjs.session-token") || request.cookies.get("next-auth.csrf-token");
  const doctorToken = request.cookies.get("doctorToken");
  const adminToken = request.cookies.get("adminToken");

  // Redirect already logged-in users away from login pages
  if (isPatientLogin && patientToken) {
    return NextResponse.redirect(new URL("/patient/dashboard", request.url));
  }
  if (isDoctorLogin && doctorToken) {
    return NextResponse.redirect(new URL("/doctor/dashboard", request.url));
  }
  if (isAdminLogin && adminToken) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  // Protect routes from unauthenticated access
  if (isPatientPath && !isPatientLogin && !patientToken) {
    return NextResponse.redirect(new URL("/patient/login", request.url));
  }
  if (isDoctorPath && !isDoctorLogin && !doctorToken) {
    return NextResponse.redirect(new URL("/doctor/login", request.url));
  }
  if (isAdminPath && !isAdminLogin && !adminToken) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
}

export const config = {
  matcher: [
    "/patient/:path*",
    "/doctor/:path*",
    "/admin/:path*",
  ],
};