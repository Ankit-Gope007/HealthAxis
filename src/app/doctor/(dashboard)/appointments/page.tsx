"use client";
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Clock, User } from "lucide-react";
import { useState } from "react";
import { useDoctorProfileStore } from "@/src/store/useDoctorProfileStore";
import { useSidebarStore } from "@/src/store/useSidebarStore";
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';

type AppointmentWithPatient = {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  timeSlot: string;
  reason: string | "No reason provided";
  status: string
  location: string

  // Relations
  patient: {
    id: string;
    email: string;
    patientProfile: {
      fullName: string;
      imageUrl?: string | null;
      dob: string;
      bloodGroup: string;
      gender: string;
      medicalHistory?: string;
      currentMedications?: string;
    }
  }
  // Optional if you include patient relation too
  doctor?: {
    id: string;
    email: string;
  };
};

const Page = () => {
  const { profile } = useDoctorProfileStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [appointmentData, setAppointmentData] = useState<AppointmentWithPatient[]>([]);
  const { setActiveItem } = useSidebarStore();
  const [hasFetched, setHasFetched] = useState(false); // New state to track if fetch has occurred
  const [loading, setLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    setActiveItem("Appointments");
  }, [setActiveItem]);

  useEffect(() => {
    console.log("Doctor Profile:", profile);
    if (profile && profile.doctorId && !hasFetched) {
      fetchAppointments(profile.doctorId);
      setHasFetched(true);
    } else if (!profile?.doctorId) {
      setHasFetched(false);
    }
  }, [profile, hasFetched]); // Depend on profile and hasFetched




  const fetchAppointments = async (id: string) => {
    try {
      setLoading(true);
      console.log("Fetching appointments for patient ID:", id);
      const response = await axios.get(`/api/appointment/getAllForDoctor?doctorId=${id}`);
      if (response.status === 200) {
        setLoading(false);
        console.log("Appointments fetched successfully:", response.data);
        setAppointmentData(response.data);
      } else {
        setLoading(false);
        console.error("Failed to fetch appointments:", response.statusText);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching appointments:", error);
    }
  };





  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-700';
      case 'PENDING':
        return 'bg-orange-100 text-orange-700';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };



  const inCompletedAppointments = appointmentData.filter(appointment => {
    const appointmentDate = new Date(appointment.date);
    const currentDate = new Date().setHours(0, 0, 0, 0); // Set current date to midnight for comparison
    return appointmentDate.setHours(0, 0, 0, 0) >= currentDate && (appointment.status === "PENDING" || appointment.status === "CONFIRMED");
  }
  );

  const filteredAppointments = inCompletedAppointments.filter(appointment => {
    const matchesSearch = appointment.patient.patientProfile.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });


  const handleConfirmAppointment = async (appointmentId: string, patientName: string) => {
    toast((t) => (
      <div className="text-sm p-3">
        <p className="font-semibold">✅ Confirm appointment for {patientName}?</p>
        <p className="text-xs text-gray-600 mt-1">
          This will mark the appointment as CONFIRMED and notify the patient.
        </p>
        <div className="mt-3 flex justify-end gap-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                setUpdatingStatus(true);
                //  sending the appointmentId and status to the API to confirm the appointment
                const res = await axios.post("/api/appointment/updateStatus", { appointmentId: appointmentId, status: "CONFIRMED" });
                if (res.status !== 200) {
                  throw new Error("Failed to confirm appointment");
                  setUpdatingStatus(false);
                }
                toast.success(`✅ Appointment for ${patientName} CONFIRMED!`, {
                  duration: 3000,
                  position: "top-right",
                  style: {
                    background: "#28A745",
                    color: "#fff",
                  },
                });
                setUpdatingStatus(false);
                // Optionally, you can refresh the appointments data here
                window.location.reload(); // Reload the page to reflect changes

                // Optional: Refresh data after confirm
                // await refetchAppointments();
              } catch (error) {
                console.error("Error confirming appointment:", error);
                toast.error(`❌ Could not confirm appointment for ${patientName}`, {
                  duration: 3000,
                  position: "top-right",
                  style: {
                    background: "#DC3545",
                    color: "#fff",

                  },
                });
                setUpdatingStatus(false);
              }
            }}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
          >
            Confirm
          </button>
        </div>
      </div>
    ), { duration: 10000 });
  };

  const handleCompleteAppointment = async (appointmentId: string, patientName: string) => {
    toast((t) => (
      <div className="text-sm p-3">
        <p className="font-semibold">✅ Complete the appointment for {patientName}?</p>
        <p className="text-xs text-gray-600 mt-1">
          This will mark the appointment as Completed and notify the patient.
          And the precription will get expired  , and you will not be able to prescribe any medicines for this appointment.
          To be still in contact with the patient, you can use the chat feature.
        </p>
        <div className="mt-3 flex justify-end gap-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                setUpdatingStatus(true);
                //  sending the appointmentId and status to the API to confirm the appointment
                const res = await axios.post("/api/appointment/completeAppointment", { appointmentId: appointmentId });
                if (res.status !== 200) {
                  throw new Error("Failed to confirm appointment");
                  setUpdatingStatus(false);
                }
                toast.success(`✅ Appointment for ${patientName} is Completed! \n
                    you will no longer be able to access ${patientName}'s prescription / notes from the appointment page\n
                    To access the data of the past patient check the Patient tab on the Sidebar. 
                  `, {
                  duration: 3000,
                  position: "top-right",
                  style: {
                    background: "#28A745",
                    color: "#fff",
                  },

                });
                setUpdatingStatus(false);
                // Optionally, you can refresh the appointments data here
                window.location.reload(); // Reload the page to reflect changes

                // Optional: Refresh data after confirm
                // await refetchAppointments();
              } catch (error) {
                console.log ("Error confirming appointment:", error);
                toast.error(`❌ Could not confirm appointment for ${patientName}`, {
                  duration: 3000,
                  position: "top-right",
                  style: {
                    background: "#DC3545",
                    color: "#fff",
                  },
                });
                setUpdatingStatus(false);
              }
            }}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
          >
            Confirm
          </button>
        </div>
      </div>
    ), { duration: 10000 });
  }

  return (

    <div className="w-full lg:w-[90%] lg:ml-14 h-[100vh]">
      <Toaster position="top-right" reverseOrder={false} />
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Appointments</h1>
        <p className="text-muted-foreground">Manage your patient appointments</p>
      </header>

      {/* Filters */}
      <Card className="health-card mb-3">
        <CardContent className="py-0">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by patient name or reason..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-5"
              />
            </div>
            <div className="flex gap-2">
              <div className="flex gap-2 ">
                <Button
                  variant={statusFilter === "all" ? "default" : "outline"}
                  onClick={() => setStatusFilter("all")}
                  size="sm"
                  className={
                    statusFilter === "all"
                      ? "bg-[#28A745] hover:bg-[#218838] text-white h-5"
                      : "hover:bg-[#F0FFF5] hover:text-[#28A745] border-[#28A745] text-[#28A745] h-5"
                  }
                >
                  All
                </Button>

                <Button
                  variant={statusFilter === "CONFIRMED" ? "default" : "outline"}
                  onClick={() => setStatusFilter("CONFIRMED")}
                  size="sm"
                  className={
                    statusFilter === "CONFIRMED"
                      ? "bg-[#28A745] hover:bg-[#218838] text-white h-5"
                      : "hover:bg-[#F0FFF5] hover:text-[#28A745] border-[#28A745] text-[#28A745] h-5"
                  }
                >
                  Confirmed
                </Button>

                <Button
                  variant={statusFilter === "PENDING" ? "default" : "outline"}
                  onClick={() => setStatusFilter("PENDING")}
                  size="sm"
                  className={
                    statusFilter === "PENDING"
                      ? "bg-[#28A745] hover:bg-[#218838] text-white h-5"
                      : "hover:bg-[#F0FFF5] hover:text-[#28A745] border-[#28A745] text-[#28A745] h-5"
                  }
                >
                  Pending
                </Button>

                {/* <Button
                  variant={statusFilter === "COMPLETED" ? "default" : "outline"}
                  onClick={() => setStatusFilter("COMPLETED")}
                  size="sm"
                  className={
                    statusFilter === "COMPLETED"
                      ? "bg-[#28A745] hover:bg-[#218838] text-white h-5"
                      : "hover:bg-[#F0FFF5] hover:text-[#28A745] border-[#28A745] text-[#28A745] h-5"
                  }
                >
                  Completed
                </Button> */}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointments Table */}
      <Card className="">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-3 w-3 text-health-600" />
            All Appointments ({inCompletedAppointments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {
            loading ?
              (
                <div className="w-full h-[50%] flex items-center justify-center flex-col gap-2">
                  <div className="loading-animation h-10 w-10"></div>
                  <div className="text-gray-500">Loading Appointments...</div>
                </div>
              )
              :
              (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody >
                    {
                      filteredAppointments.length === 0 ?
                        (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center text-muted-foreground">
                              No appointments found.
                            </TableCell>
                          </TableRow>
                        )
                        :
                        filteredAppointments.map((appointment) => (
                          <TableRow
                            className='overflow-y-scroll max-h-[200px] show-scrollbar'
                            key={appointment.id}>
                            <TableCell className=''>
                              <div className="flex items-center gap-3">
                                <div className="h-6 w-6 bg-health-100 rounded-full flex items-center justify-center">
                                  {appointment.patient.patientProfile.imageUrl ? (
                                    <Image
                                      src={appointment.patient.patientProfile.imageUrl}
                                      alt={appointment.patient.patientProfile.fullName}
                                      width={24}
                                      height={24}
                                      className="h-full w-full rounded-full object-cover"
                                    />
                                  ) : (
                                    <User className="h-4 w-4 text-health-600" />
                                  )}
                                </div>
                                <span className="font-medium">{appointment.patient.patientProfile.fullName}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <p className="font-medium">
                                    {new Date(appointment.date).toLocaleDateString()}
                                  </p>
                                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {appointment.timeSlot}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <p className="max-w-xs truncate">{appointment.reason}</p>
                            </TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(appointment.status)}`}>
                                {appointment.status}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                  <Link href={`/doctor/appointments/details/${appointment.id}`} className="flex items-center gap-1">
                                    View Patient
                                  </Link>

                                </Button>
                                {appointment.status === 'CONFIRMED' && (
                                  <Button
                                    disabled={updatingStatus}
                                    onClick={() => handleCompleteAppointment(appointment.id, appointment.patient.patientProfile.fullName)}
                                    variant="outline" size="sm" className="bg-[#28A745] text-white">
                                    Complete Appointment
                                  </Button>
                                )}
                                {appointment.status === 'PENDING' && (
                                  <Button
                                    disabled={updatingStatus}
                                    onClick={() => handleConfirmAppointment(appointment.id, appointment.patient.patientProfile.fullName)}
                                    className='bg-[#28A745] text-white' size="sm" variant="outline">
                                    Confirm
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                    }
                  </TableBody>
                </Table >
              )
          }
        </CardContent >
      </Card >
    </div >

  );
};

export default Page;
