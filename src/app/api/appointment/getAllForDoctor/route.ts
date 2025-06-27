import { NextResponse } from "next/server";
import {getAppointmentsByDoctor} from "@/src/controllers/Appointments/Appointment.controller";


export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const doctorId = searchParams.get("doctorId");

        if (!doctorId) {
            return NextResponse.json({ error: "Doctor ID is required" }, { status: 400 });
        }

        const appointments = await getAppointmentsByDoctor(doctorId);

        return NextResponse.json(appointments, { status: 200 });
    } catch (error) {
        console.error("Error fetching appointments:", error);
        return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 });
    }
}