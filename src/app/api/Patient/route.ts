import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";


export default async function createPatientSession(patientId: string, patientEmail: string) {
    try {
        const sessionToken = jwt.sign(
            {
                id: patientId,
                email: patientEmail,
            },
            process.env.JWT_SECRET!,
            {
                expiresIn: "1d",
            }
        );;

        // 1. Store the session in the DB
        await prisma.session.create({
            data: {
                token: sessionToken,
                userId: patientId,
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day
            },
        });

        console.log("Session created in database for patient ID:", patientId);

        console.log("Session token:", sessionToken);

        // 2. Create a response and set cookie BEFORE returning
        const response = new NextResponse(JSON.stringify({ message: "Patient session created successfully." }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

        cookies().set("token", sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Use secure cookies in production
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24, // 1 day
        });

        return response;
    } catch (error) {
        console.error("Error creating patient session:", error);
        return new NextResponse(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}