import { NextResponse } from "next/server";
import { hasPatientReviewedDoctor } from "@/src/controllers/Reviews/Review.controller";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { patientId, doctorId } = body;

        // Check if data is missing or not:
        if (!patientId || !doctorId) {
            return NextResponse.json({ error: "Data is not compatible" }, { status: 500 });
        }

        // Check if the patient has already reviewed the doctor
        const hasReviewed = await hasPatientReviewedDoctor(patientId, doctorId);

        return NextResponse.json({ hasReviewed }, { status: 200 });
    } catch (error) {
        console.error("Error checking review:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}