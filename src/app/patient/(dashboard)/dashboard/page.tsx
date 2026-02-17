import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/src/lib/prisma";
import PatientDashboardClient from "./PatientDashboardClient";

/**
 * WHY SERVER COMPONENT?
 * - Fetches data on server (faster database access)
 * - Parallel queries (all data fetched at once)
 * - No client-side waterfalls
 * - Better SEO and initial load performance
 */
export default async function PatientDashboard() {
  // Get session on server (
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  // PARALLEL DATA FETCHING - All queries run simultaneously
  const [user, profile, appointments] = await Promise.all([
    // Query 1: Get user with embedded profile 
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        profileSetup: true,
        patientProfile: {
          select: {
            id: true,
            fullName: true,
            imageUrl: true,
            phone: true,
            patientId: true,
            dob: true,
            bloodGroup: true,
            gender: true
          }
        }
      }
    }),

    // Query 2: Get patient profile (for Zustand store)
    prisma.patientProfile.findUnique({
      where: { patientId: session.user.id },
      select: {
        id: true,
        fullName: true,
        imageUrl: true,
        patientId: true,
        phone: true,
        dob: true,
        bloodGroup: true,
        gender: true
      }
    }),

    // Query 3: Get ALL appointments with doctor details
    prisma.appointment.findMany({
      where: { patientId: session.user.id },
      select: {
        id: true,
        date: true,
        timeSlot: true,
        status: true,
        reason: true,
        doctor: {
          select: {
            id: true,
            doctorProfile: {
              select: {
                fullName: true,
                specialization: true,
                imageUrl: true
              }
            }
          }
        }
      },
      orderBy: { date: 'asc' }
    })
  ]);

  // Redirect before rendering anything
  if (!user?.profileSetup) {
    redirect("/patient/profile");
  }

  // data sent to client
  const currentDate = new Date();
  const upcomingAppointments = appointments
    .filter((apt: typeof appointments[0]) => {
      const appointmentDate = new Date(apt.date);
      return appointmentDate >= currentDate && 
             (apt.status === "CONFIRMED" || apt.status === "PENDING");
    })
    .map((apt) => ({
      id: apt.id,
      date: apt.date.toISOString(),
      timeSlot: apt.timeSlot,
      reason: apt.reason || undefined,
      status: apt.status,
      doctor: {
        id: apt.doctor.id,
        doctorProfile: {
          fullName: apt.doctor.doctorProfile?.fullName || "Unknown",
          specialization: apt.doctor.doctorProfile?.specialization || "General",
          imageUrl: apt.doctor.doctorProfile?.imageUrl || null
        }
      }
    }));

  // Pass pre-fetched data to Client Component
  return (
    <PatientDashboardClient
      user={user}
      profile={profile}
      upcomingAppointments={upcomingAppointments}
      totalAppointments={appointments.length}
    />
  );
}