import { prisma } from "@/src/lib/prisma";


// send a message to a user
export const sendMessage = async (
    data: {
        senderId: string;
        receiverId: string;
        content: string;
        appointmentId: string;
    }
) => {
    try {


        // Check appointment status
        const appointment = await prisma.appointment.findUnique({
            where: { id: data.appointmentId },
        });

        if (!appointment || appointment.status !== "confirmed") {
            throw new Error("Chat not allowed: appointment not confirmed");
        }

        // Create a new message in the database
        const message = await prisma.message.create({
            data: {
                senderId: data.senderId,
                receiverId: data.receiverId,
                content: data.content,
                appointmentId: data.appointmentId, // Optional, if you want to link the message to an appointment
            },
        });

        // Return the created message
        return {
            success: true,
            message: "Message sent successfully",
            data: message,
        };
    } catch (error) {
        console.error("Error sending message:", error);
        throw new Error("Failed to send message");
    }
};

// get messages between two users
export const getMessages = async (appointmentId: string) => {
    try {
        const messages = await prisma.message.findMany({
            where: { appointmentId },
            orderBy: { createdAt: "asc" },
            include: {
                sender: true,
                receiver: true,
            },
        });

        return messages
    } catch (error) {
        console.error("Error fetching messages:", error);
        throw new Error("Failed to fetch messages");

    }
}
