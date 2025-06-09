import { getPatientById } from "@/src/controllers/Patient/Patient.controller";
import { NextResponse ,NextRequest } from "next/server";


export async function POST (request: NextRequest) {
    try {
        const body = await request.json();
        const { id } = body;

        // Validate the patientId
        if (!id) {
            return NextResponse.json({ error: "Patient ID is required" }, { status: 400 });
        }

        // Call the controller function to get patient by ID
        const response = await getPatientById(id);

        // Return the response from the controller
        return response;
    } catch (error) {
        console.error("Error in POST /api/patient/getPatientById:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
