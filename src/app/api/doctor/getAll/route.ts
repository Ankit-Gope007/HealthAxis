import { getAllDoctors } from "@/src/controllers/Doctor/Doctor.controller";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const doctors = await getAllDoctors();
        return NextResponse.json({ doctors });
    } catch (error) {
        console.error("Error fetching doctors:", error);
        return NextResponse.json({ error: "Failed to fetch doctors" }, { status: 500 });

    }
}