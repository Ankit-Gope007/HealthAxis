import { NextResponse } from "next/server";
import {updateAppointmentStatus} from "@/src/controllers/Appointments/Appointment.controller";

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const { appointmentId, status } = data;

        // Validate required fields
        if (!appointmentId || !status) {
            return NextResponse.json(
                { error: "Appointment ID and status are required" },
                { status: 400 }
            );
        }

        // Update the appointment status
        const updatedAppointment = await updateAppointmentStatus(appointmentId, status);

        return NextResponse.json(updatedAppointment, { status: 200 });
    } catch (error) {
        console.error("Error updating appointment status:", error);
        return NextResponse.json(
            { error: "Failed to update appointment status" },
            { status: 500 }
        );
    }
}