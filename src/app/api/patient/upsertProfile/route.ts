import { NextResponse } from "next/server";
import { upsertPatientProfile } from "@/src/controllers/Patient/Patient.controller";


export async function POST(request: Request) {
    try {
        // Parse the request body
        const data = await request.json();

        // Call the upsertPatientProfile function with the parsed data
        const response = await upsertPatientProfile(data);

        // Return the response from the upsertPatientProfile function
        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        // Handle any errors that occur during profile update
        return NextResponse.json({ error: "An error occurred while updating the profile" }, { status: 500 });
    }
}