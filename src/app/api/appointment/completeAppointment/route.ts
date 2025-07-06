import { NextResponse } from "next/server";
import { completeAppointment } from "@/src/controllers/Appointments/Appointment.controller";

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const { appointmentId } = data;

        // Validate required fields
        if (!appointmentId) {
            return NextResponse.json({ error: "Appointment ID is required" }, { status: 400 });
        }

        // Complete the appointment
        const completedAppointment = await completeAppointment(appointmentId);
        
        if (!completedAppointment) {
            return NextResponse.json({ error: "Appointment not found or already completed" }, { status: 404 });
        }

        return NextResponse.json(completedAppointment, { status: 200 });
        
    } catch (error) {
        console.error("Error completing appointment:", error);
        return NextResponse.json({ error: "Failed to complete appointment" }, { status: 500 });
    }
}