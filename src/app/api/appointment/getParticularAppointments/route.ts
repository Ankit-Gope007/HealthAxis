import { NextResponse } from "next/server";
import { getPatientAppointmentsWithDoctor } from "@/src/controllers/Appointments/Appointment.controller";

export async function POST(request: Request) {
    try {
        const { patientId, doctorId } = await request.json();

        if (!patientId || !doctorId) {
            return NextResponse.json({ error: "Missing patientId or doctorId" }, { status: 400 });
        }

        const appointments = await getPatientAppointmentsWithDoctor(patientId, doctorId);

        if (!appointments || appointments.length === 0) {
            return NextResponse.json({ message: "No appointments found" }, { status: 404 });
        }

        return NextResponse.json(appointments, { status: 200 });

        
    } catch (error) {
        console.error("Error fetching appointments:", error);
        return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 });
    }
}