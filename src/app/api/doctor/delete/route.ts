import { deleteDoctor } from "@/src/controllers/Doctor/Doctor.controller";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { doctorId } = await req.json();
        if (!doctorId) {
            return NextResponse.json({ error: "Doctor ID is required" }, { status: 400 });
        }
        // Call the deleteDoctor controller function
        await deleteDoctor(doctorId);
        return NextResponse.json({ message: "Doctor deleted" });
    } catch (error) {
        console.error("Error deleting doctor:", error);
        return NextResponse.json({ error: "Failed to delete doctor" }, { status: 500 });

    }
}