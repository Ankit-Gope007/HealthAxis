import { NextResponse } from "next/server";
import { getRecentPrescriptionsForDoctor } from "@/src/controllers/Prescription/Prescription.controller";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const doctorId = searchParams.get("doctorId");

        // Validate doctorId
        if (!doctorId) {
            return NextResponse.json({ error: "Doctor ID is required" }, { status: 400 });
        }

        // Fetch recent prescriptions for the doctor
        const prescriptions = await getRecentPrescriptionsForDoctor(doctorId);

        return NextResponse.json(prescriptions, { status: 200 });

    } catch (error) {
        console.error("Error fetching recent prescriptions:", error);
        return NextResponse.json({ error: "Failed to fetch recent prescriptions" }, { status: 500 });
    }
}