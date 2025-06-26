import { NextResponse } from "next/server";
import { logoutDoctor } from "@/src/controllers/Doctor/Doctor.controller";

export async function POST() {
  try {
    // Call the logoutDoctor function to handle the logout logic
    await logoutDoctor();



    // Return a successful response
    return NextResponse.json(
      { message: "Logout successful" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Logout failed" },
      { status: 500 }
    );
  }
}