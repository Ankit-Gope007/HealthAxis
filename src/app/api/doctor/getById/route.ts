import { getDoctorById } from "@/src/controllers/Doctor/Doctor.controller";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const doctorId = searchParams.get("doctorId");

        if (!doctorId) {
            return NextResponse.json({ error: "Doctor ID is required" }, { status: 400 });
        }

        const doctor = await getDoctorById(doctorId);

        if (!doctor) {
            return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
        }

        return NextResponse.json(doctor, { status: 200 });
    } catch (error) {
        console.error("Error fetching doctor by ID:", error);
        return NextResponse.json({ error: "Failed to fetch doctor" }, { status: 500 });

    }
}