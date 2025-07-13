import { prisma } from "@/src/lib/prisma";
import { transporter } from "@/src/lib/mail";
import { google } from "googleapis";

export async function createGoogleCalendarEvent(patient: any, appointment: any) {
  // ✅ Create ONE OAuth2 client
  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI // you MUST have this set!
  );

  // ✅ Set the credentials from the signed-in user (patient)
  oAuth2Client.setCredentials({
    access_token: patient.accessToken,   // YOU must pass these correctly
    refresh_token: patient.refreshToken
  });

  // ✅ Create calendar client using that OAuth2 client
  const calendar = google.calendar({
    version: "v3",
    auth: oAuth2Client
  });

  // ✅ Define the event
  const event = {
    summary: `Appointment with Dr. ${appointment.doctor.doctorProfile?.fullName}`,
    description: `Your appointment for ${appointment.date} has been confirmed.`,
    start: {
      dateTime: new Date(appointment.date).toISOString(),
      timeZone: "Asia/Kolkata",
    },
    end: {
      dateTime: new Date(new Date(appointment.date).getTime() + 30 * 60000).toISOString(),
      timeZone: "Asia/Kolkata",
    },
    attendees: [
      { email: patient.email }
    ]
  };

  // ✅ Insert the event
  const response = await calendar.events.insert({
    calendarId: "primary",
    requestBody: event,
  });

  return response.data;
}


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
                doctor: true,

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
                },
                prescription: {
                    select: {
                        medicines: true, // Include medicines in the prescription
                        publicNotes: true // Include public notes in the prescription
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
                        accessToken: true,
                        refreshToken: true,
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

        if (status === "CONFIRMED"&& updatedAppointment.patient.accessToken && updatedAppointment.patient.refreshToken) {
            // Create Google Calendar event
            await createGoogleCalendarEvent(updatedAppointment.patient, updatedAppointment);
        }


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

// Completing an appointment controller;
export async function completeAppointment(appointmentId: string) {
    try {
        // 1. Check if appointment exist or not
        const existingAppointment = await prisma.appointment.findUnique({
            where: {
                id: appointmentId
            },
        })

        if (!existingAppointment) {
            console.log("Error , the appointment doesnt exists")
            throw new Error("No appointment with the given appointmentId is found")
        }

        // 2. set Appointment status to COMPLETED!!
        const updatedAppointment = await prisma.appointment.update({
            where: { id: appointmentId },
            data: {
                status: "COMPLETED"
            },
            include: {
                patient: {
                    select: {
                        email: true,
                        patientProfile: true
                    }
                },
                doctor: {
                    include: {
                        doctorProfile: true
                    }
                }
            }
        })

        // 3. Find that the patient has already reviewed the doctor or not: 
        const existingReview = await prisma.review.findFirst({
            where: {
                patientId: updatedAppointment.patientId,
                doctorId: updatedAppointment.doctorId
            }
        });





        // 4. Send an email to the patient about the appointment completion (add the review doc option link only if its the first appointment completed)
        if (existingReview) {
            await transporter.sendMail({
                from: "Health Axis <noReply> yourdomain.com",
                to: updatedAppointment.patient.email,
                subject: `Appointment Completed with Dr. ${updatedAppointment.doctor.doctorProfile?.fullName}`,
                text: `Dear ${updatedAppointment.patient.patientProfile?.fullName},\n\n
Your appointment with Dr. ${updatedAppointment.doctor.doctorProfile?.fullName} on ${updatedAppointment.date.toDateString()} at ${updatedAppointment.timeSlot} has been completed.\n\nThank you for choosing Health Axis!`,
                html: `
        <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
            <tr>
              <td style="background-color: #28A745; padding: 20px; text-align: center;">
                <h2 style="color: #ffffff; margin: 0 ;">Health Axis</h2>
              </td>
            </tr>
            <tr>
              <td style="padding: 30px;">
                <p style="font-size: 16px; color: #333333;">Dear ${updatedAppointment.patient.patientProfile?.fullName},</p>
                <p style="font-size: 16px; color: #333333; line-height: 1.5;">
                  Your appointment with <strong> ${updatedAppointment.doctor.doctorProfile?.fullName}</strong> on <strong>${updatedAppointment.date.toDateString()}</strong> at <strong>${updatedAppointment.timeSlot}</strong> has been completed.
                </p>
                <p style="font-size: 16px; color: #333333;">
                  Thank you for choosing Health Axis! We hope you had a great experience.
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
        }
        else {
            await transporter.sendMail({
                from: "Health Axis <noReply@yourdomain.com>",
                to: updatedAppointment.patient.email,
                subject: `Appointment Completed with  ${updatedAppointment.doctor.doctorProfile?.fullName}`,
                text: `Dear ${updatedAppointment.patient.patientProfile?.fullName},

Your appointment with Dr. ${updatedAppointment.doctor.doctorProfile?.fullName} on ${updatedAppointment.date.toDateString()} at ${updatedAppointment.timeSlot} has been completed.

Thank you for choosing Health Axis!

You can leave a review for your doctor here: http://localhost:3000/patient/reviews
`,
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
            Your appointment with <strong>Dr. ${updatedAppointment.doctor.doctorProfile?.fullName}</strong> on <strong>${updatedAppointment.date.toDateString()}</strong> at <strong>${updatedAppointment.timeSlot}</strong> has been completed.
          </p>
          <p style="font-size: 16px; color: #333333;">
            Thank you for choosing Health Axis! We hope you had a great experience.
          </p>
          <div style="margin: 30px 0; text-align: center;">
            <a href="http://localhost:3000/patient/login"
              style="background-color: #28A745; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 4px; font-weight: bold; display: inline-block; margin-bottom: 10px;">
              Go to Dashboard
            </a>
            <br/>
            <a href="http://localhost:3000/patient/review/${updatedAppointment.doctorId}"
              style="background-color: #007BFF; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 4px; font-weight: bold; display: inline-block;">
              Leave a Review
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
        }

        return updatedAppointment;

    } catch (error) {
        console.error("Error completing appointment:", error);
        throw new Error("Failed to complete appointment");

    }

}

// Get all the appointment of a particular patient with a particular doctor
export async function getPatientAppointmentsWithDoctor(patientId: string, doctorId: string) {
    try {
        // Check if the patient exists
        const patient = await prisma.user.findUnique({
            where: { id: patientId }
        });
        if (!patient) {
            throw new Error("Patient with that Id was not found in the DB");
        }

        // Check if the doctor exists
        const doctor = await prisma.user.findUnique({
            where: { id: doctorId }
        });
        if (!doctor) {
            throw new Error("Doctor with that Id was not found in the DB");
        }

        // Fetch appointments for the patient with the specific doctor
        const appointments = await prisma.appointment.findMany({
            where: {
                patientId,
                doctorId
            },
            include: {
                patient: {
                    select: {
                        email: true,
                        patientProfile: true
                    }
                },
                doctor: {

                    select: {
                        email: true,
                        doctorProfile: true
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
        console.error("Error fetching appointments by patient and doctor:", error);
        throw new Error("Failed to fetch appointments by patient and doctor");

    }
}

