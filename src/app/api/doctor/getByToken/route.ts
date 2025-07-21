import { NextResponse } from "next/server";
import { getDoctorById } from "@/src/controllers/Doctor/Doctor.controller";
import jwt from 'jsonwebtoken';
import { cookies } from "next/headers";

interface DecodedToken {
    id: string;
    // add other properties if needed
}

export async function GET(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("doctorToken")?.value || req.headers.get("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return NextResponse.json({ error: "Authorizationtoken is required" }, { status: 401 });
        }
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as DecodedToken;
        if (!decoded || !decoded.id) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }
        console.log("Decoded token:", decoded);
        const doctorId = decoded.id;
        if (!doctorId) {
            return NextResponse.json({ error: "Doctor ID is required" }, { status: 400 });
        }
        const doctor = await getDoctorById(doctorId);
        if (!doctor) {
            return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
        }
        return NextResponse.json(doctor, { status: 200 });
        
        
    } catch (error) {
        console.error("Error fetching doctor by token:", error);
        return NextResponse.json({ error: "Failed to fetch doctor" }, { status: 500 });
        
    }
}