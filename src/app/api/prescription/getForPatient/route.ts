import { NextResponse } from "next/server";
import { getAllPrescriptionsForPatient } from "@/src/controllers/Prescription/Prescription.controller";


export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const patientId = searchParams.get("patientId");

        if (!patientId) {
            return NextResponse.json({ error: "Patient ID is required" }, { status: 400 });
        }

        // Fetch prescriptions for the patient
        const prescriptions = await getAllPrescriptionsForPatient(patientId);

        return NextResponse.json(prescriptions, { status: 200 });
    } catch (error) {
        console.error("Error fetching prescriptions:", error);
        return NextResponse.json({ error: "Failed to fetch prescriptions" }, { status: 500 });
    }
}