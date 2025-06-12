import { NextResponse } from "next/server";
import { getPatientProfile } from "@/src/controllers/Patient/Patient.controller";


export const POST = async (request:Request) => {
    try {
        const { patientId } = await request.json();
        if (!patientId) {
            return NextResponse.json({ error: "patientId is required" }, { status: 400 });
        }
        // Fetch the patient profile using the controller function
        const patientProfile = await getPatientProfile(patientId);
        if (!patientProfile) {
            return NextResponse.json({ error: "Patient profile not found" }, { status: 404 });
        }
        return NextResponse.json(patientProfile, { status: 200 });
        
    } catch (error) {
        console.error("Error fetching patient profile:", error);
        return NextResponse.json({ error: "Failed to fetch patient profile" }, { status: 500 });
    }
}