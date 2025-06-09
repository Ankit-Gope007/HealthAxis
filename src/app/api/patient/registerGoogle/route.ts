import {registerPatientGoogle} from "@/src/controllers/Patient/Patient.controller"
import { NextResponse } from "next/server";


export async function POST(request: Request) {
    try {
        const data = await request.json();
        const patient = await registerPatientGoogle(data);
        if (!patient) {
            return NextResponse.json({ error: "Patient registration failed" }, { status: 400 });
        }
        return NextResponse.json({ message: "Patient registered successfully", patient }, { status: 201 });
    } catch (error) {
        console.error("Error in POST /api/patient/registerGoogle:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
        
    }

}