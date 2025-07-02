import { prisma } from "@/src/lib/prisma";
import { transporter } from "@/src/lib/mail";


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
                doctor: {
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
            data: { status },
            include: {
                patient: {
                    select: {
                        email: true,
                        patientProfile: {
                            select: {
                                fullName: true
                            }
                        }
                    }
                },
                doctor: {
                    include: {
                        doctorProfile: {
                            select: {
                                fullName: true,
                                specialization: true,
                                imageUrl: true
                            }
                        }
                    }
                }
            }


        });

        await transporter.sendMail({
            from: "Health Axis <no-reply@yourdomain.com>",
            to: updatedAppointment.patient.email,
            subject: `Appointment Status Updated: ${status}`,
            text: `Dear ${updatedAppointment.patient.patientProfile?.fullName},\n\nYour appointment with Dr. ${updatedAppointment.doctor.doctorProfile?.fullName} has been updated to ${status}.\n\nThank you!`,
            html: `
    <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
        <tr>
          <td style="background-color: #28A745; padding: 20px; text-align: center;">
            <h2 style="color: #ffffff; margin: 0;">Health Axis</h2>
          </td>
        </tr>
        <tr>
          <td style="padding: 30px;">
            <p style="font-size: 16px; color: #333333;">Dear ${updatedAppointment.patient.patientProfile?.fullName},</p>
            <p style="font-size: 16px; color: #333333; line-height: 1.5;">
              Your appointment with <strong> ${updatedAppointment.doctor.doctorProfile?.fullName}</strong> 
              has been updated to 
              <span style="background-color: #e6f4ea; color: #28A745; padding: 2px 6px; border-radius: 4px;">
                ${status}
              </span>.
            </p>
            <p style="font-size: 16px; color: #333333;">
              Please log in to your dashboard for more details.
            </p>
            <div style="margin: 30px 0; text-align: center;">
              <a href="http://localhost:3000/patient/login" 
                 style="background-color: #28A745; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 4px; font-weight: bold;">
                Go to Dashboard
              </a>
            </div>
            <p style="font-size: 14px; color: #999999;">Thank you for choosing Health Axis!</p>
          </td>
        </tr>
        <tr>
          <td style="background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #777;">
            &copy; ${new Date().getFullYear()} Health Axis. All rights reserved.
          </td>
        </tr>
      </table>
    </div>
  `
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

// get appointment details by ID controller:
export async function getAppointmentDetailsById(appointmentId: string) {
    try {
        // Check if the appointment exists
        const appointment = await prisma.appointment.findUnique({
            where: { id: appointmentId },
            include: {
                patient: {
                    include: {
                        patientProfile: true
                    }
                },
                doctor: {
                    include: {
                        doctorProfile: true
                    }
                }
            }
        });

        if (!appointment) {
            throw new Error("Appointment with that Id was not found in the DB");
        }

        return appointment;

    } catch (error) {
        console.error("Error fetching appointment details:", error);
        throw new Error("Failed to fetch appointment details");

    }
}