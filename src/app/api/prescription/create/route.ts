import { NextResponse } from "next/server";
import { createPrescription } from "@/src/controllers/Prescription/Prescription.controller";


export async function POST(request: Request){
    try {
        const data = await request.json();
       
        const {appointmentId, publicNotes, privateNotes, medicines} = data;
        // Validate required fields
        if (!appointmentId || !Array.isArray(medicines) || medicines.length === 0) {
            return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
        }
        // Create the prescription
        const prescription = await createPrescription({
            appointmentId,
            publicNotes,
            privateNotes,
            medicines,
        });
        return NextResponse.json(prescription, { status: 201 });
        
    } catch (error) {
        console.error("Error creating prescription:", error);
        return NextResponse.json({ error: "Failed to create prescription" }, { status: 500 });
        
    }
}