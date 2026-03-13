import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/src/lib/prisma";
import PatientAppointmentsClient from "./components/PatientAppointmentsClient";

type SerializedAppointment = {
  id: string;
  date: string;
  timeSlot: string;
  reason?: string;
  status: string;
  doctor: {
    id: string;
    doctorProfile: {
      fullName: string;
      specialization: string;
      imageUrl?: string | null;
      address?: string | null;
    };
  };
  prescription?: {
    publicNotes?: string;
  };
};

const Page = async () => {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const [user, appointments] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, profileSetup: true },
    }),
    prisma.appointment.findMany({
      where: { patientId: session.user.id },
      select: {
        id: true,
        date: true,
        timeSlot: true,
        reason: true,
        status: true,
        doctor: {
          select: {
            id: true,
            doctorProfile: {
              select: {
                fullName: true,
                specialization: true,
                imageUrl: true,
                address: true,
              },
            },
          },
        },
        prescription: {
          select: {
            publicNotes: true,
          },
        },
      },
      orderBy: { date: "asc" },
    }),
  ]);

  if (!user?.profileSetup) {
    redirect("/patient/profile");
  }

  const now = new Date();
  const serializedAppointments: SerializedAppointment[] = appointments.map((appointment) => ({
    id: appointment.id,
    date: appointment.date.toISOString(),
    timeSlot: appointment.timeSlot,
    reason: appointment.reason || undefined,
    status: appointment.status,
    doctor: {
      id: appointment.doctor.id,
      doctorProfile: {
        fullName: appointment.doctor.doctorProfile?.fullName || "Unknown",
        specialization: appointment.doctor.doctorProfile?.specialization || "General",
        imageUrl: appointment.doctor.doctorProfile?.imageUrl || null,
        address: appointment.doctor.doctorProfile?.address || "Not provided",
      },
    },
    prescription: {
      publicNotes: appointment.prescription?.publicNotes || undefined,
    },
  }));

  const upcomingAppointmentData = serializedAppointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.date);
    return appointmentDate >= now && appointment.status !== "COMPLETED";
  });

  const pastAppointmentData = serializedAppointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.date);
    return appointmentDate < now || appointment.status === "COMPLETED";
  });

  return (
    <PatientAppointmentsClient
      upcomingAppointmentData={upcomingAppointmentData}
      pastAppointmentData={pastAppointmentData}
    />
  );
};

export default Page;