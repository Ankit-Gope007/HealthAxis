import { getDoctorById } from "@/src/controllers/Doctor/Doctor.controller";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const id = url.searchParams.get("id")!;
        const doctor = await getDoctorById(id);
        return NextResponse.json({ doctor });
    } catch (error) {
        console.error("Error fetching doctor by ID:", error);
        return NextResponse.json({ error: "Failed to fetch doctor" }, { status: 500 });

    }
}