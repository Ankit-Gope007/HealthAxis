"use client";
import React, { useEffect, useState } from 'react'
import { useSidebarStore } from '@/src/store/useSidebarStore';
import { Button } from '@/components/ui/button';
import { IoAdd } from 'react-icons/io5';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UpcomingAppointments from './components/UpcomingAppointments';
import PastAppointments from './components/PastAppointments';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { usePatientProfileStore } from '@/src/store/usePatientProfileStore';


type AppointmentWithDoctor = {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  timeSlot: string;
  reason?: string ;
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


const page = () => {
  const { setActiveItem } = useSidebarStore();
  const { profile } = usePatientProfileStore();

  const router = useRouter();
  const [appointmentsData, setAppointmentsData] = useState<AppointmentWithDoctor[]>([]);
  const [profileId, setProfileId] = useState<string | null>(null);

  useEffect(() => {
    if (profile && profile.patientId) {
      fetchAppointments(profile.patientId);
    } else {
      console.warn("Profile or patientId not available yet");
    }

    setActiveItem("Appointments");
  }, [profile, setActiveItem]);

  const fetchAppointments = async (id: string) => {
    try {
      console.log("Fetching appointments for patient ID:", id);
      const response = await axios.get(`/api/appointment/getAllForPatient?patientId=${id}`);
      if (response.status === 200) {
        console.log("Appointments fetched successfully:", response.data);
        setAppointmentsData(response.data);
      } else {
        console.error("Failed to fetch appointments:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };
  return (
    <div className='w-full lg:w-[90%] lg:ml-14 h-[100vh]'>
      {/* heading + button */}
      <div className='flex items-center justify-between'>
        {/* Heading */}
        <div className='flex flex-col items-center justify-center p-2'>
          <h1 className='text-3xl font-bold'>Appointments Page</h1>
          <p className=' mt-1 text-gray-500'>Manage and view your scheduled appointments</p>
        </div>
        {/* Button */}
        <div className='p-2'>
          <Button
            onClick={() => router.push('/patient/appointments/book')}
            className='h-[50px] bg-[#28A745] hover:bg-[#2ea728] cursor-pointer active:shadow-lg'> <IoAdd /> New Appointment</Button>
        </div>
      </div>
      {/* divider */}
      <hr className='' />

      {/* Tabs */}
      <div className='w-full mt-4 h-[600px]'>

        <Tabs defaultValue="upcomingAppointments" className="w-full h-full">
          <TabsList className='h-[40px] ml-2 '>
            <TabsTrigger className='cursor-pointer' value="upcomingAppointments">Upcoming (2)</TabsTrigger>
            <TabsTrigger className='cursor-pointer' value="pastAppointments">Past (3)</TabsTrigger>
          </TabsList>



          {/* Upcoming Appointments */}
          <TabsContent value="upcomingAppointments">
            <div className=' overflow-y-auto gap-3 h-full w-full items-center justify-start px-2 flex flex-col '>
              {appointmentsData.length > 0 ? (
                appointmentsData.map(appointment => (
                  console.log("Appointment data:", appointment),
                  <UpcomingAppointments
                    key={appointment.id}
                    id={appointment.id}
                    doctorName={`${appointment.doctor?.doctorProfile?.fullName}`}
                    specialty={appointment.doctor?.doctorProfile?.specialization}
                    imageUrl={appointment.doctor.doctorProfile.imageUrl || ""} // Placeholder image
                    date={new Date(appointment.date).toLocaleDateString()}
                    time={appointment.timeSlot}
                    location={appointment.location}
                    reason={appointment.reason}
                    status={appointment.status} // Example status
                  />
                ))
              ) : (
                <p>No appointments found</p>
              )}

            </div>
          </TabsContent>




          {/* Past Appointments */}
          <TabsContent value="pastAppointments">
            <div className=' overflow-y-auto gap-3 h-full w-full items-center justify-start px-2 flex flex-col '>
              <PastAppointments
                doctorName="Dr. Jane Smith"
                specialty="Dermatologist"
                imageUrl="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&auto=format&fit=crop" // Placeholder image
                date="April 10, 2025"
                time="2:00 PM"
                location="City Hospital"
                notes="Skin allergy consultation"
                status="Completed" // Example status
              />
              <PastAppointments
                doctorName="Dr. Jane Smith"
                specialty="Dermatologist"
                imageUrl="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&auto=format&fit=crop" // Placeholder image
                date="April 10, 2025"
                time="2:00 PM"
                location="City Hospital"
                notes="Skin allergy consultation"
                status="Completed" // Example status
              />
              <PastAppointments
                doctorName="Dr. Jane Smith"
                specialty="Dermatologist"
                imageUrl="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&auto=format&fit=crop" // Placeholder image
                date="April 10, 2025"
                time="2:00 PM"
                location="City Hospital"
                notes="Skin allergy consultation"
                status="Completed" // Example status
              />


            </div>
          </TabsContent>
        </Tabs>

      </div>


    </div>
  )
}

export default page