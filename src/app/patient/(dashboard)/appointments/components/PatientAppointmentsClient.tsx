"use client";

import React, { useEffect } from "react";
import { useSidebarStore } from "@/src/store/useSidebarStore";
import { Button } from "@/components/ui/button";
import { IoAdd } from "react-icons/io5";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UpcomingAppointments from "./UpcomingAppointments";
import PastAppointments from "./PastAppointments";
import { useRouter } from "next/navigation";

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
      address?: string | null;
    };
  };
  prescription?: {
    publicNotes?: string;
  };
};

type Props = {
  upcomingAppointmentData: AppointmentWithDoctor[];
  pastAppointmentData: AppointmentWithDoctor[];
};

const PatientAppointmentsClient = ({
  upcomingAppointmentData,
  pastAppointmentData,
}: Props) => {
  const { setActiveItem } = useSidebarStore();
  const router = useRouter();

  useEffect(() => {
    setActiveItem("Appointments");
  }, [setActiveItem]);

  return (
    <div className="w-full lg:w-[90%] lg:ml-14 h-[100vh]">
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-center justify-center p-2">
          <h1 className="text-3xl font-bold">Appointments Page</h1>
          <p className=" mt-1 text-gray-500">Manage and view your scheduled appointments</p>
        </div>
        <div className="p-2">
          <Button
            onClick={() => router.push("/patient/appointments/book")}
            className="h-[50px] bg-[#28A745] hover:bg-[#2ea728] cursor-pointer active:shadow-lg"
          >
            <IoAdd /> New Appointment
          </Button>
        </div>
      </div>

      <hr className="" />

      <div className="w-full mt-4 h-[600px]">
        <Tabs defaultValue="upcomingAppointments" className="w-full h-full">
          <TabsList className="h-[40px] ml-2 ">
            <TabsTrigger className="cursor-pointer" value="upcomingAppointments">
              Upcoming ({upcomingAppointmentData.length})
            </TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="pastAppointments">
              Past ({pastAppointmentData.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcomingAppointments">
            <div className=" overflow-y-auto gap-3 h-full w-full items-center justify-start px-2 flex flex-col ">
              {upcomingAppointmentData.length > 0 ? (
                upcomingAppointmentData.map((appointment) => (
                  <UpcomingAppointments
                    key={appointment.id}
                    id={appointment.id}
                    doctorName={appointment.doctor.doctorProfile.fullName}
                    specialty={appointment.doctor.doctorProfile.specialization}
                    imageUrl={appointment.doctor.doctorProfile.imageUrl || ""}
                    date={new Date(appointment.date).toLocaleDateString()}
                    time={appointment.timeSlot}
                    location={appointment.doctor.doctorProfile.address || "Not provided"}
                    reason={appointment.reason}
                    status={appointment.status}
                  />
                ))
              ) : (
                <div>
                  <p>You have no Upcoming appointments found</p>
                  <br />
                  <p className="text-gray-500">
                    You can book a new appointment by clicking the button above.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="pastAppointments">
            <div className=" overflow-y-auto gap-3 h-full w-full items-center justify-start px-2 flex flex-col ">
              {pastAppointmentData.length > 0 ? (
                pastAppointmentData.map((appointment) => (
                  <PastAppointments
                    key={appointment.id}
                    id={appointment.id}
                    doctorName={appointment.doctor.doctorProfile.fullName}
                    specialty={appointment.doctor.doctorProfile.specialization}
                    imageUrl={appointment.doctor.doctorProfile.imageUrl || ""}
                    date={new Date(appointment.date).toLocaleDateString()}
                    time={appointment.timeSlot}
                    location={appointment.doctor.doctorProfile.address || "Not provided"}
                    reason={appointment.reason}
                    status={appointment.status}
                    notes={appointment.prescription?.publicNotes}
                  />
                ))
              ) : (
                <div>
                  <p>You have no Past appointments found</p>
                  <br />
                  <p className="text-gray-500">
                    You can book a new appointment by clicking the button above.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PatientAppointmentsClient;
