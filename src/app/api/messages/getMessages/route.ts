import { NextResponse } from "next/server";
import { getMessages } from "@/src/controllers/Messages/Messages.controller";


export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const appointmentId = searchParams.get("appointmentId");

        // Fetch messages for the appointment
        const messages = await getMessages(appointmentId|| "");

        return NextResponse.json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
    }
}