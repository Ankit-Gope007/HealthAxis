"use client";

import React, { useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSidebarStore } from '@/src/store/useSidebarStore';
import { usePatientProfileStore } from "@/src/store/usePatientProfileStore";
import { useUserStore } from "@/src/store/useUserStore";
import AppointmentCards from "./components/AppointmentCards";

// Type definitions 
type AppointmentWithDoctor = {
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
    }
  }
};

type PatientProfile = {
  id: string;
  fullName: string;
  imageUrl?: string | null;
  patientId: string;
  phone: string;
  dob: Date;
  bloodGroup?: string | null;
  gender: string;
};

type PatientProfileForStore = {
  id: string;
  fullName: string;
  bloodGroup: string;
  gender: string;
  phone: string;
  imageUrl?: string;
  address?: string;
  dob: string;
  patientId: string;
};

type User = {
  id: string;
  email: string;
  profileSetup: boolean;
  patientProfile: PatientProfile | null;
};

type UserForStore = {
  id: string;
  email: string;
  role: string;
  profileSetup: boolean;
};

/**
 * PROPS INTERFACE
 * All data comes from Server Component (pre-fetched)
 */
interface PatientDashboardClientProps {
  user: User;
  profile: PatientProfile | null;
  upcomingAppointments: AppointmentWithDoctor[];
  totalAppointments: number;
}

// Client Component
export default function PatientDashboardClient({
  user,
  profile,
  upcomingAppointments,
  totalAppointments
}: PatientDashboardClientProps) {
  const router = useRouter();
  const { setActiveItem } = useSidebarStore();
  const { setProfile } = usePatientProfileStore();
  const { setUser } = useUserStore();

//  EFFECT 1: Sync Server Data to Client Store
  useEffect(() => {
    if (profile) {
      // Convert to store-compatible format
      const profileForStore: PatientProfileForStore = {
        id: profile.id,
        fullName: profile.fullName,
        bloodGroup: profile.bloodGroup || "Not specified",
        gender: profile.gender,
        phone: profile.phone,
        imageUrl: profile.imageUrl || undefined,
        dob: profile.dob.toISOString(),
        patientId: profile.patientId
      };
      setProfile(profileForStore);
    }
    if (user) {
      // Convert to store-compatible format
      const userForStore: UserForStore = {
        id: user.id,
        email: user.email,
        role: "PATIENT",
        profileSetup: user.profileSetup
      };
      setUser(userForStore);
    }
  }, [profile, user, setProfile, setUser]);

//  Set active sidebar item & Show welcome toast
  useEffect(() => {
    setActiveItem("Dashboard");
    
    // Welcome toast (once per browser session)
    if (profile) {
      const hasShown = sessionStorage.getItem("dashboardToastShown");
      if (!hasShown) {
        toast.success(`Welcome back, ${profile.fullName}! 🎉`);
        sessionStorage.setItem("dashboardToastShown", "true");
      }
    }
  }, [setActiveItem, profile]);

  /**
   * RENDER
   * WHY NO LOADING STATE? Data already fetched on server
   */
  return (
    <div className='w-full lg:w-[90%] lg:ml-14 min-h-screen bg-[#F9FAFC]'>
      <Toaster />

      {/* Header Section */}
      <div className="flex justify-between flex-col md:flex-row p-2">
        {/* Heading */}
        <div className="flex flex-col justify-between items-start">
          <h1 className="text-xl font-semibold">
            Welcome to Your Dashboard, {profile?.fullName || "Guest"}!
          </h1>
          <p className="text-gray-600">
            Here&apos;s an overview of your health records, appointments, and more.
          </p>
        </div>

        {/* Book Appointment Button */}
        <div className="flex justify-end mt-4 md:mt-0">
          <button
            onClick={() => {
              setActiveItem("Appointments");
              router.push("/patient/appointments");
            }}
            className="bg-[#28A745] w-full md:w-auto cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-[#218838] transition duration-200"
          >
            Book Appointment
          </button>
        </div>
      </div>

      {/* Divider */}
      <hr className="my-2 border-gray-300" />

      {/* Stats Section (NEW - Shows quick metrics) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-2 mb-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm text-gray-600">Total Appointments</h3>
          <p className="text-2xl font-bold">{totalAppointments}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm text-gray-600">Upcoming</h3>
          <p className="text-2xl font-bold text-[#28A745]">
            {upcomingAppointments.length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm text-gray-600">Profile Status</h3>
          <p className="text-2xl font-bold text-green-600">
            {user.profileSetup ? "✓ Complete" : "⚠ Incomplete"}
          </p>
        </div>
      </div>

      {/* Upcoming Appointments Section */}
      <div className="p-2">
        <h2 className="text-lg font-semibold mt-4">Your Upcoming Appointments</h2>
        <p className="text-gray-600 mb-4">Manage your appointments and health records here.</p>

        {/* Appointment Cards Container */}
        <div className="mt-4 flex justify-start gap-3 overflow-x-auto pb-4">
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.map((appointment) => (
              <AppointmentCards
                key={appointment.id}
                fullName={appointment.doctor.doctorProfile.fullName}
                specialization={appointment.doctor.doctorProfile.specialization}
                imageUrl={appointment.doctor.doctorProfile.imageUrl || ""}
                appointmentDate={new Date(appointment.date).toLocaleDateString()}
                appointmentTime={appointment.timeSlot}
                status={appointment.status}
              />
            ))
          ) : (
            <div className="bg-white p-6 rounded-lg shadow w-full text-center">
              <p className="text-gray-500 mb-2">You have no upcoming appointments.</p>
              <p className="text-gray-400">Please book an appointment to see it here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}