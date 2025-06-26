import { NextResponse } from "next/server";
import { logoutAdmin } from "@/src/controllers/Admin/Admin.controller";

export async function POST() {
  try {
    // Call the logoutAdmin function to handle the logout logic
    await logoutAdmin();
    

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