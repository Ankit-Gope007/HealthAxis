import { NextResponse } from "next/server";
import { loginDoctor } from "@/src/controllers/Doctor/Doctor.controller";



export async function POST (request: Request){

    try {

        const body = await request.json();
        
        const result = await loginDoctor(body);
        if (!result) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }
        return NextResponse.json({ message: "Doctor logged in successfully", data: result }, { status: 200 });


    } catch (error) {
        console.error("Error in POST /api/doctor/login:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
        
    }

}