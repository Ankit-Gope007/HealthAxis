import { prisma } from "@/src/lib/prisma";


// Appointment Creation controller:
export async function createAppointment(data: {
    patientId: string;
    doctorId: string;
    date: Date;
    timeSlot: string;
    reason: string;
}) {
    const { patientId, doctorId, date, timeSlot, reason } = data;

    try {
        // Check if the patient exists 
        const patient = await prisma.user.findUnique({
            where: { id: patientId }
        })
        if (!patient) {
            throw new Error("Pateint with that Id was not found in the DB")
        }

        // Check if the doctor exists or not 
        const doctor = await prisma.user.findUnique({
            where: { id: doctorId }
        })
        if (!doctor) {
            throw new Error("Doctor with that Id was not found in the DB")
        }

        // Now check the same appointment is already created or not 

        const appointment = await prisma.appointment.findFirst({
            where: {
                patientId,
                doctorId,
                date,
                timeSlot
            }
        })

        if (appointment) {
            throw new Error("The same appointment Already exists!!!")
        }

        // Now create a new appointment ;
        const newAppointment = await prisma.appointment.create({
            data: {
                patientId,
                doctorId,
                date,
                timeSlot,
                reason
            }
        });

        return newAppointment;

    } catch (error) {
        console.error("Error creating appointment:", error);
        throw new Error("Failed to create appointment");
    }
}


// get all appointments of the patients to the doctor
export async function getAppointmentsByDoctor(doctorId: string) {
    try {
        // Check if the doctor exists
        const doctor = await prisma.user.findUnique({
            where: { id: doctorId }
        });
        if (!doctor) {
            throw new Error("Doctor with that Id was not found in the DB");
        }

        // Fetch appointments for the doctor
        const appointments = await prisma.appointment.findMany({
            where: { doctorId },
            include: {
                patient: {
                    include: {
                        patientProfile: true 
                    }
                }, 
                doctor: true   
            },
            orderBy: [
                { date: 'asc' },
                { timeSlot: 'asc' }
            ]
        });

        return appointments;

    } catch (error) {
        console.error("Error fetching appointments by doctor:", error);
        throw new Error("Failed to fetch appointments by doctor");

    }
}

// get all appointments of the patients to the patient
export async function getAppointmentsByPatient(patientId: string) {
    try {
        // Check if the patient exists
        const patient = await prisma.user.findUnique({
            where: { id: patientId }
        });
        if (!patient) {
            throw new Error("Patient with that Id was not found in the DB");
        }

        // Fetch appointments for the patient
        const appointments = await prisma.appointment.findMany({
            where: { patientId },
            include: {
                patient: true, // Include patient details
                doctor:{
                    include: {
                        doctorProfile: true // Include doctor's profile details
                    }
                }
            },
            orderBy: [
                { date: 'asc' },
                { timeSlot: 'asc' }
            ]
        });

        return appointments;

    } catch (error) {
        console.error("Error fetching appointments by patient:", error);
        throw new Error("Failed to fetch appointments by patient");

    }
}

// Update Appointment Status controller:
export async function updateAppointmentStatus(appointmentId: string, status: string) {
    try {
        // Check if the appointment exists
        const appointment = await prisma.appointment.findUnique({
            where: { id: appointmentId }
        });
        if (!appointment) {
            throw new Error("Appointment with that Id was not found in the DB");
        }

        // Update the appointment status
        const updatedAppointment = await prisma.appointment.update({
            where: { id: appointmentId },
            data: { status }
        });

        return updatedAppointment;

    } catch (error) {
        console.error("Error updating appointment status:", error);
        throw new Error("Failed to update appointment status");

    }
}

// Delete Appointment controller:
export async function deleteAppointment(appointmentId: string) {
    try {
        // Check if the appointment exists
        const appointment = await prisma.appointment.findUnique({
            where: { id: appointmentId }
        });
        if (!appointment) {
            throw new Error("Appointment with that Id was not found in the DB");
        }

        // Delete the appointment
        await prisma.appointment.delete({
            where: { id: appointmentId }
        });

        return { message: "Appointment deleted successfully" };

    } catch (error) {
        console.error("Error deleting appointment:", error);
        throw new Error("Failed to delete appointment");

    }
}