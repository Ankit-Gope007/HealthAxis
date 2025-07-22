import { registerPatientCredential } from "@/src/controllers/Patient/Patient.controller";
import { NextResponse } from 'next/server';



export async function POST(request: Request) {
    try {
        // Parse the request body
        const data = await request.json();

        // Call the registerPatient function with the parsed data
        const response = await registerPatientCredential(data);

        // Return the response from the registerPatient function
        return response;
    } catch (error) {
        // Handle any errors that occur during registration
        return NextResponse.json({ error: "An error occurred during registration", details: error }, { status: 500 });
    }
}