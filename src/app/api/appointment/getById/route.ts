import { NextResponse } from "next/server";
import { getAppointmentDetailsById } from "@/src/controllers/Appointments/Appointment.controller";



export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const appointmentId = searchParams.get("appointmentId");

        if (!appointmentId) {
            return NextResponse.json({ error: "Appointment ID is required" }, { status: 400 });
        }

        const appointmentDetails = await getAppointmentDetailsById(appointmentId);
        if (!appointmentDetails) {
            return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
        }
        return NextResponse.json(appointmentDetails, { status: 200 });
    }
    catch (error) {
        console.error("Error fetching appointment details:", error);
        return NextResponse.json({ error: "Failed to fetch appointment details" }, { status: 500 });
    }
}
