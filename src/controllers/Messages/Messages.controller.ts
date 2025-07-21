import { prisma } from "@/src/lib/prisma";


// fetch all messages for a specific appointment
export async function getMessages(appointmentId: string) {
    // Validate appointment
    const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId },
    });

    if (!appointment || appointment.status !== "CONFIRMED") {
        throw new Error("You cannot fetch messages for this appointment.");
    }

    // Fetch messages for the appointment
    const messages = await prisma.message.findMany({
        where: { appointmentId },
        include: {
            sender: {
                select: {
                    id: true,
                    email: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true,
                    profileSetup: true,
                    accessToken: true,
                    refreshToken: true,
                    expiresAt: true,
                    // password excluded
                },
            },
            receiver: {
                select: {
                    id: true,
                    email: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true,
                    profileSetup: true,
                    accessToken: true,
                    refreshToken: true,
                    expiresAt: true,
                    // password excluded
                },
            },
        },
    });

    return messages;
}