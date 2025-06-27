import { NextResponse } from "next/server";
import {getAppointmentsByPatient} from "@/src/controllers/Appointments/Appointment.controller";


export async function GET (request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const patientId = searchParams.get("patientId");

        // Validate required fields
        if (!patientId) {
            return NextResponse.json(
                { error: "Patient ID is required" },
                { status: 400 }
            );
        }

        // Get appointments for the patient
        const appointments = await getAppointmentsByPatient(patientId);

        return NextResponse.json(appointments, { status: 200 });
    } catch (error) {
        console.error("Error fetching appointments:", error);
        return NextResponse.json(
            { error: "Failed to fetch appointments" },
            { status: 500 }
        );
    }
}