import { NextResponse } from "next/server";
import { createAppointment } from "@/src/controllers/Appointments/Appointment.controller";


export async function POST(request: Request) {
    try {
        const data = await request.json();
        const { patientId, doctorId, date, timeSlot, reason } = data;

        // Validate required fields
        if (!patientId || !doctorId || !date || !timeSlot || !reason) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        // Create the appointment
        const newAppointment = await createAppointment({
            patientId,
            doctorId,
            date: new Date(date),
            timeSlot,
            reason,
        });

        return NextResponse.json(newAppointment, { status: 201 });
    } catch (error) {
        console.error("Error creating appointment:", error);
        return NextResponse.json(
            { error: "Failed to create appointment" },
            { status: 500 }
        );
    }
}