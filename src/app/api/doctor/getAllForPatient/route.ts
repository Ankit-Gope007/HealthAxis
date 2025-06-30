import { NextResponse } from "next/server";
import { getAllDoctorsForPatient } from "@/src/controllers/Doctor/Doctor.controller";


export async function GET() {
    try {

        // Get all doctors for the patient
        const doctors = await getAllDoctorsForPatient();

        return NextResponse.json({doctors});
    } catch (error) {
        console.error("Error fetching doctors:", error);
        return NextResponse.json(
            { error: "Failed to fetch doctors" },
            { status: 500 }
        );
    }
}
