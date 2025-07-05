import { NextResponse } from "next/server";
import { updateMedicines } from "@/src/controllers/Prescription/Prescription.controller";


export async function POST(request: Request) {
    try {
        const data = await request.json();

        const { appointmentId, medicines } = data;

        // Validate required fields
        if (!appointmentId || !Array.isArray(medicines) || medicines.length === 0) {
            return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
        }

        // Update the prescription
        const updatedPrescription = await updateMedicines(appointmentId, medicines);
        return NextResponse.json(updatedPrescription, { status: 200 });

    } catch (error) {
        console.error("Error updating prescription:", error);
        return NextResponse.json({ error: "Failed to update prescription" }, { status: 500 });
    }
}