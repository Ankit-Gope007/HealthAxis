import { NextResponse } from "next/server";
import { addImageToPatientProfile } from "@/src/controllers/Patient/Patient.controller";

// Function to handle image upload for patient profile
export async function PATCH(request: Request) {
    try {
        // Parse the request body to get patientId and imageUrl
        const { patientId, imageUrl } = await request.json();
        
        // Call the addImageToPatientProfile function with the parsed data
        const response = await addImageToPatientProfile(
            patientId,
            imageUrl,
        );


        // Return the response from the addImageToPatientProfile function
        return NextResponse.json(response, { status: 200 });
    } catch (error: any) {
        // Handle any errors that occur during image upload
        return NextResponse.json({ error: error.message || "Something went Wrong!!" }, { status: error.status || 500 });
    }
}