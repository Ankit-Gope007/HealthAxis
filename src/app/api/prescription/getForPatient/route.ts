import { NextResponse } from "next/server";
import { getPrescriptionForPatient } from "@/src/controllers/Prescription/Prescription.controller";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const appointmentId = searchParams.get("appointmentId");

        // Validate appointmentId
        if (!appointmentId) {
            return NextResponse.json({ error: "Appointment ID is required" }, { status: 400 });
        }

        // Fetch the prescription for the patient
        const prescription = await getPrescriptionForPatient(appointmentId);

        if (!prescription) {
            return NextResponse.json({ error: "Prescription not found" }, { status: 404 });
        }

        return NextResponse.json(prescription, { status: 200 });

    } catch (error) {
        console.error("Error fetching prescription:", error);
        return NextResponse.json({ error: "Failed to fetch prescription" }, { status: 500 });
    }
}