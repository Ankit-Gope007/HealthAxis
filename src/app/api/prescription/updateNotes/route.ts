import { NextResponse } from "next/server";
import { updatePatientNotes } from "@/src/controllers/Prescription/Prescription.controller";


export async function POST(request: Request) {
    try {
        const data = await request.json();

        const { appointmentId, publicNotes, privateNotes } = data;

        // Validate required fields
        if (!appointmentId || !publicNotes || !privateNotes) {
            return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
        }

        // Update the prescription notes
        const updatedPrescription = await updatePatientNotes(appointmentId, publicNotes, privateNotes);

        return NextResponse.json(updatedPrescription, { status: 200 });

    } catch (error) {
        console.error("Error updating prescription notes:", error);
        return NextResponse.json({ error: "Failed to update prescription notes" }, { status: 500 });
    }
}