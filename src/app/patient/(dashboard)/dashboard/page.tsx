"use client";
import React, { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useUserStore } from "@/src/store/useUserStore";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSidebarStore } from '@/src/store/useSidebarStore';
import { usePatientProfileStore } from "@/src/store/usePatientProfileStore";
import AppointmentCards from "./components/AppointmentCards"; // Import your AppointmentCards component


type AppointmentWithDoctor = {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  timeSlot: string;
  reason?: string;
  status: string
  location: string

  // Relations
  doctor: {
    id: string;
    doctorProfile: {
      fullName: string;
      specialization: string;
      imageUrl?: string | null;
    }
  }

  patient?: {
    id: string;
    name: string;
  };
};


const Page = () => {
  const { data: session, status } = useSession();
  const { user, setUser } = useUserStore(); // Get user and setUser from your store
  const router = useRouter();
  const { setActiveItem } = useSidebarStore();
  const { profile, setProfile } = usePatientProfileStore(); // Assuming you have a store for patient profile
  const [appointmentsData, setAppointmentsData] = useState<AppointmentWithDoctor[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchPatientProfile = async () => {
    try {

      const response = await axios.post('/api/patient/getPatientProfile',
        { patientId: user?.id }
      );
      if (response.status === 200) {
        console.log("Patient profile fetched successfully:", response.data);
        setProfile(response.data);


      }

    } catch (error) {
      console.error("Error fetching patient profile:", error);
      toast.error("Failed to fetch patient profile");
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      if (status === "loading" || !session?.user?.id) {
        return;
      }

      try {
        setLoading(true);
        const res = await axios.post(`/api/patient/getPatientById`, {
          id: session.user.id,
        });

        console.log("Response from API:", res.data);
        const fetchedUser = res.data;
        if (fetchedUser) {
          setUser(fetchedUser);
          setLoading(false);
        }
        if (fetchedUser && !fetchedUser.profileSetup) {
          toast("Please complete your profile setup to access all features.");
          setActiveItem("profile");
          router.push("/patient/profile");
          setLoading(false);
        }
        // Fetch patient profile after user data is set

        if (user) {
          fetchPatientProfile();
          setLoading(false);
        }

      } catch (error) {
        console.error("Failed to fetch user data:", error);
        toast.error("Failed to load user data.");
        setLoading(false);
      }
    };

    fetchUser();
  }, [session, status, setUser, setActiveItem, router]); // Add all dependencies

  // Display a welcome toast message when the dashboard is accessed
  // This useEffect should depend on 'user' to ensure it's available
  useEffect(() => {
    // set the active sidebar item to "Dashboard"
    setActiveItem("Dashboard");
    // Only show toast if user is available and toast hasn't been shown
    if (user && user.email) {
      const hasShown = sessionStorage.getItem("dashboardToastShown");

      if (!hasShown) {
        toast.success(`Welcome back, ${user.email}! 🎉`);
        sessionStorage.setItem("dashboardToastShown", "true");
      }
    }
  }, [user]); // Now depends on 'user' from Zustand

  // Fetch appointments when the profile is available
  useEffect(() => {
    if (profile && profile.patientId) {
      console.log("Profile is available, fetching appointments for patientId:", profile.patientId);
      fetchAppointments(profile.patientId);
    } else {
      console.warn("Profile or patientId not available yet");
    }
  }, [profile]);

  const fetchAppointments = async (id: string) => {
    setLoading(true);
    try {
      console.log("Fetching appointments for patient ID:", id);
      const response = await axios.get(`/api/appointment/getAllForPatient?patientId=${id}`);
      if (response.status === 200) {
        console.log("Appointments fetched successfully:", response.data);
        setAppointmentsData(response.data);
        setLoading(false);
      } else {
        console.error("Failed to fetch appointments:", response.statusText);
        toast.error("Failed to fetch appointments");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Error fetching appointments");
      setLoading(false);
    }
  };

  const upcomingAppointments = appointmentsData.filter((app) => {
    const appointmentDate = new Date(app.date);
    const currentDate = new Date();
    return appointmentDate >= currentDate && app.status === "CONFIRMED" || app.status === "PENDING";
  })


  return (


    <>
      {
        loading ? (
          <div className="flex items-center justify-center h-screen">
            <div className="loading-animation h-10 w-10"></div>
          </div>
        )
        :
        (<div className='w-full lg:w-[90%] lg:ml-14 h-[100vh] bg-[#F9FAFC] '>
          <Toaster />

          {/* Heading and Tagline  + book appoinment button*/}
          <div className=" flex justify-between flex-col md:flex-row">
            {/* heading */}
            <div className="flex flex-col justify-between items-start p-2">
              <h1 className="text-xl font-semibold">Welcome to Your Dashboard , {profile ? profile.fullName : "Guest"}! </h1>
              <p>
                Here's an overview of your health records, appointments, and more.
              </p>
            </div>
            {/* Book  Appoinment Button */}
            <div className="flex justify-end p-2">
              <button
                onClick={() => {
                  setActiveItem("Appointments");
                  router.push("/patient/appointments");
                }}
                className="bg-[#28A745] w-full cursor-pointer  text-white px-4 py-2 rounded-lg hover:bg-[#28a746] transition duration-200"
              >
                Book Appointment
              </button>
            </div>
          </div>

          {/* Divider */}
          <hr className="my-2 border-gray-300" />

          {/* Your Health Records */}

          {/* Your Upcoming Appointments */}
          <div className=" h-[300px] p-2">
            <h2 className="text-lg font-semibold mt-4 ">Your Upcoming Appointments</h2>
            <p>Manage your appointments and health records here.</p>

            {/* Appointment Cards */}
            <div className="mt-4 flex justify-start gap-3 h-[250px] overflow-x-auto p-1">
              {loading ? (
                <div className="h-full w-full center">
                  <div className="loading-animation h-10 w-10">
                  </div>
                </div>

              ) : upcomingAppointments.length > 0
                ? (
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
                  <div>
                    <p className="text-gray-500">You Have no Upcoming Appointments.</p>
                    <p className="text-gray-500">Please book an appointment to see it here.</p>
                  </div>
                )}
            </div>
          </div>

        </div>)
      }
    </>


  )
}

export default Page