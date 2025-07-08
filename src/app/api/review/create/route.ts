import { NextResponse } from "next/server";
import { registerReview } from "@/src/controllers/Reviews/Review.controller";

export async function POST (request:Request){
    try {
        const body  = await request.json()
        const {patientId,doctorId,comment,rating}= body;

        // Check if data is missing or not :
        if (!patientId || !doctorId || rating<1){
            return NextResponse.json ({error:"Data is not compatable"},{status:500})
        }
        

        // Then send the data:
        const review = await registerReview({
            patientId,
            doctorId,
            comment,
            rating
        })

        if (review){
            return NextResponse.json({data:review},{status:200})
        }
        else{
            return NextResponse.json({error:"Something went wrong in the controller"},{status:500})
        }
        
    } catch (error) {
        console.log(error)
        
    }
}