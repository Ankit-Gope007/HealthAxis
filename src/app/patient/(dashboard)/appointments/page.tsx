"use client";
import React, { useEffect } from 'react'
import { useSidebarStore } from '@/src/store/useSidebarStore';
import { Button } from '@/components/ui/button';
import { IoAdd } from 'react-icons/io5';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UpcomingAppointments from './components/UpcomingAppointments';
import PastAppointments from './components/PastAppointments';

const page = () => {
  const { setActiveItem } = useSidebarStore();
  useEffect(() => {
    setActiveItem('Appointments');
  }, [setActiveItem]);
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
          <Button className='h-[50px] bg-[#28A745] hover:bg-[#2ea728] cursor-pointer active:shadow-lg'> <IoAdd /> New Appointment</Button>
        </div>
      </div>
      {/* divider */}
      <hr className='' />

      {/* Tabs */}
      <div className='w-full mt-4 h-[600px]'>

        <Tabs defaultValue="upcomingAppointments" className="w-full h-full">
          <TabsList className='h-[40px] ml-2 '>
            <TabsTrigger  className='cursor-pointer'  value="upcomingAppointments">Upcoming (2)</TabsTrigger>
            <TabsTrigger className='cursor-pointer' value="pastAppointments">Past (3)</TabsTrigger>
          </TabsList>



          {/* Upcoming Appointments */}
          <TabsContent value="upcomingAppointments">
            <div className=' overflow-y-auto gap-3 h-full w-full items-center justify-start px-2 flex flex-col '>
              <UpcomingAppointments
                doctorName="Dr. John Doe"
                specialty="Cardiologist"
                imageUrl="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&auto=format&fit=crop" // Placeholder image
                date="May 18, 2025"
                time="10:30 AM"
                location="Downtown Medical Center"
                notes="Annual heart checkup"
                status="Approved" // Example status
              />
              <UpcomingAppointments
                doctorName="Dr. John Doe"
                specialty="Cardiologist"
                imageUrl="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&auto=format&fit=crop" // Placeholder image
                date="May 18, 2025"
                time="10:30 AM"
                location="Downtown Medical Center"
                notes="Annual heart checkup"
                status="Approved" // Example status
              />
              <UpcomingAppointments
                doctorName="Dr. John Doe"
                specialty="Cardiologist"
                imageUrl="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&auto=format&fit=crop" // Placeholder image
                date="May 18, 2025"
                time="10:30 AM"
                location="Downtown Medical Center"
                notes="Annual heart checkup"
                status="Approved" // Example status
              />
              <UpcomingAppointments
                doctorName="Dr. John Doe"
                specialty="Cardiologist"
                imageUrl="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&auto=format&fit=crop" // Placeholder image
                date="May 18, 2025"
                time="10:30 AM"
                location="Downtown Medical Center"
                notes="Annual heart checkup"
                status="Approved" // Example status
              />
              <UpcomingAppointments
                doctorName="Dr. John Doe"
                specialty="Cardiologist"
                imageUrl="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&auto=format&fit=crop" // Placeholder image
                date="May 18, 2025"
                time="10:30 AM"
                location="Downtown Medical Center"
                notes="Annual heart checkup"
                status="Approved" // Example status
              />
              <UpcomingAppointments
                doctorName="Dr. John Doe"
                specialty="Cardiologist"
                imageUrl="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&auto=format&fit=crop" // Placeholder image
                date="May 18, 2025"
                time="10:30 AM"
                location="Downtown Medical Center"
                notes="Annual heart checkup"
                status="Approved" // Example status
              />
              <UpcomingAppointments
                doctorName="Dr. John Doe"
                specialty="Cardiologist"
                imageUrl="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&auto=format&fit=crop" // Placeholder image
                date="May 18, 2025"
                time="10:30 AM"
                location="Downtown Medical Center"
                notes="Annual heart checkup"
                status="Approved" // Example status
              />
              <UpcomingAppointments
                doctorName="Dr. John Doe"
                specialty="Cardiologist"
                imageUrl="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&auto=format&fit=crop" // Placeholder image
                date="May 18, 2025"
                time="10:30 AM"
                location="Downtown Medical Center"
                notes="Annual heart checkup"
                status="Approved" // Example status
              />
              <UpcomingAppointments
                doctorName="Dr. John Doe"
                specialty="Cardiologist"
                imageUrl="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&auto=format&fit=crop" // Placeholder image
                date="May 18, 2025"
                time="10:30 AM"
                location="Downtown Medical Center"
                notes="Annual heart checkup"
                status="Approved" // Example status
              />

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