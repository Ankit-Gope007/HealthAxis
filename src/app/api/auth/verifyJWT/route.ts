import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/src/lib/prisma";


// Function to verify JWT and return patient data

export async function verifyJWT(token: string) {
    try {

        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; email: string };

        // Fetch patient data from the database using the decoded ID
        const patient = await prisma.patient.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                email: true,
            },
        });

        if (!patient) {
            return new NextResponse(JSON.stringify({ error: "Patient not found" }), { status: 404 });
        }
        console.log("Patient data:", patient);

        // Return the patient data
        return new NextResponse(
            JSON.stringify(patient),
            {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });


    } catch (error) {
        console.error("Error verifying JWT:", error);
        return new NextResponse(JSON.stringify({ error: "Internal server error" }), { status: 500 });

    }
}
