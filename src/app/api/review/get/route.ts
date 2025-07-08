import { NextResponse } from "next/server";
import { getReviewsByDoctorId } from "@/src/controllers/Reviews/Review.controller";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const doctorId = searchParams.get("doctorId");

        if (!doctorId) {
            return NextResponse.json({ error: "Doctor ID is required" }, { status: 400 });
        }

        const reviews = await getReviewsByDoctorId(doctorId);

        // if (!reviews || reviews.length === 0) {
        //     return NextResponse.json({ message: "No reviews found for this doctor" }, { status: 404 });
        // }

        return NextResponse.json(reviews, { status: 200 });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
    }
}