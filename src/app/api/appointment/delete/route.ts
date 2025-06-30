import { NextResponse } from "next/server";
import { deleteAppointment } from "@/src/controllers/Appointments/Appointment.controller";

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const appointmentId = searchParams.get("appointmentId");

        if (!appointmentId) {
            return NextResponse.json({ error: "Appointment ID is required" }, { status: 400 });
        }

        // Call the controller to delete the appointment
        await deleteAppointment(appointmentId);

        return NextResponse.json({ message: "Appointment deleted successfully" }, { status: 200 });

    } catch (error) {
        console.error("Error deleting appointment:", error);
        return NextResponse.json({ error: "Failed to delete appointment" }, { status: 500 });
    }
}