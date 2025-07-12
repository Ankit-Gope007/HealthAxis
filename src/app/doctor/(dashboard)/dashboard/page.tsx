"use client";
import React from 'react'
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Clock, FileText, MessageSquare } from "lucide-react";
import axios from 'axios';
import { useDoctorProfileStore } from '@/src/store/useDoctorProfileStore';
import { useSidebarStore } from '@/src/store/useSidebarStore';
import { getStatusStyle } from '@/src/lib/statusStyle';
import { useRouter } from 'next/navigation';

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

const page = () => {
  const [loading, setLoading] = useState(false);
  const [appointmentData, setAppointmentData] = useState<AppointmentWithPatient[]>([]);
  const [hasFetched, setHasFetched] = useState(false);
  const { profile } = useDoctorProfileStore();
  const { setActiveItem } = useSidebarStore();
  const router = useRouter();

  useEffect(() => {
    setActiveItem("Dashboard");
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

  // Filtering all data accoirding to my needs

  // 1. Today's Appointments
  const todaysAppointments = appointmentData.filter((appointment) => {
    const appointmentDate = new Date(appointment.date);
    const today = new Date();
    return (
      appointmentDate.getFullYear() === today.getFullYear() &&
      appointmentDate.getMonth() === today.getMonth() &&
      appointmentDate.getDate() === today.getDate() &&
      appointment.status === "CONFIRMED"
    );
  });

  // 2. Pending Appointments
  const pendingAppointments = appointmentData.filter((appointment) => appointment.status === "PENDING");

  // 3. Patients This Week
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  const endOfWeek = new Date();
  endOfWeek.setDate(endOfWeek.getDate() + (6 - endOfWeek.getDay()));
  const patientsThisWeek = appointmentData.filter((appointment) => {
    const appointmentDate = new Date(appointment.date);
    return (
      appointmentDate >= startOfWeek && appointmentDate <= endOfWeek
    );
  });

  // 4. Total Patients this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  const endOfMonth = new Date();
  endOfMonth.setMonth(endOfMonth.getMonth() + 1);
  endOfMonth.setDate(0); // Last day of the month
  const totalPatientsThisMonth = appointmentData.filter((appointment) => {
    const appointmentDate = new Date(appointment.date);
    return (
      appointmentDate >= startOfMonth && appointmentDate <= endOfMonth
    );
  });







  const stats = [
    {
      title: "Today's Appointments",
      value: todaysAppointments.length.toString(),
      icon: <Calendar className="h-5 w-5 text-green-600" />,
    },
    {
      title: "Pending Appointments",
      value: pendingAppointments.length.toString(),
      icon: <Clock className="h-5 w-5 text-orange-600" />,
    },
    {
      title: "Patients This Week",
      value: patientsThisWeek.length.toString(),
      icon: <Users className="h-5 w-5 text-blue-600" />,
    },
    {
      title: "Patients This Month",
      value: totalPatientsThisMonth.length.toString(),
      icon: <FileText className="h-5 w-5 text-purple-600" />,

    }
  ];

  const upcomingAppointments = [
    { id: 1, patient: "Sarah Johnson", time: "10:00 AM", condition: "Follow-up checkup", status: "confirmed" },
    { id: 2, patient: "Michael Brown", time: "10:30 AM", condition: "Chest pain consultation", status: "pending" },
    { id: 3, patient: "Emily Davis", time: "11:15 AM", condition: "Routine examination", status: "confirmed" },
    { id: 4, patient: "David Wilson", time: "2:00 PM", condition: "Blood pressure check", status: "confirmed" },
  ];

  const recentPatients =
    appointmentData
      .filter(
        (app) =>
          (app.status === "CONFIRMED" || app.status === "COMPLETED") &&
          new Date(app.date).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)
      )
      .map((appointment) => ({
        id: appointment.patient.id,
        name: appointment.patient.patientProfile.fullName,
        condition: appointment.reason || "No condition specified",
        lastVisit: new Date(appointment.date).toLocaleDateString(),
        imageUrl: appointment.patient.patientProfile.imageUrl || "",
      })) || [];

  return (
    <>
      {
        loading ?
          (
            <div className="w-full lg:w-[90%] lg:ml-14 h-[100vh] flex-col gap-5 center " >
              <div className="loading-animation h-12 w-12">
              </div>
              <div>
                <p className="text-muted-foreground">Loading Your Dashboard data...</p>
              </div>
            </div>
          )
          :
          (
            <div className='w-full lg:w-[90%] lg:ml-14 h-[100vh] '>
              <header className="mb-4 mt-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Good morning, Dr. Smith</h1>
                <p className="text-muted-foreground">Here's what's happening with your practice today.</p>
              </header>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <Card key={index} className="py-0">
                    <CardContent className="p-2 center gap-2">
                      <div className="flex items-center justify-between mb-2">
                        <div className="">
                          {stat.icon}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-sm font-medium text-gray-900">{stat.title}</p>
                        {/* <p className="text-xs text-muted-foreground">{stat.trend}</p> */}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Today's Schedule */}
                <Card className=" h-fit">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-green-600" />
                      Today's Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {
                        todaysAppointments.length === 0 ? (
                          <p className="text-muted-foreground">No appointments scheduled for today.</p>
                        ) :
                          todaysAppointments.map((appointment) => (
                            <div key={appointment.id} className="flex items-center justify-between p-1 bg-gray-50 rounded-lg">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="font-medium text-gray-900">{appointment.patient.patientProfile.fullName}</p>
                                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusStyle(appointment.status)}`}>
                                    {appointment.status}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground">{appointment.reason}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium text-green-600">{appointment.timeSlot}</p>
                                <Button
                                  onClick={() => {
                                    setActiveItem("Appointments");
                                    router.push(`/doctor/appointments/details/${appointment.id}`);
                                  }}
                                  size="sm" variant="outline" className="mt-1 h-5">
                                  View
                                </Button>
                              </div>
                            </div>
                          ))

                      }
                    </div>
                    <Button
                      onClick={() => {
                        setActiveItem("Appointments");
                        router.push("/doctor/appointments");
                      }}
                      className="w-full mt-4 health-green">
                      View All Appointments
                    </Button>
                  </CardContent>
                </Card>

                {/* Recent Patients */}
                <Card className="h-fit">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-green-600" />
                      Recent Patients
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {
                      
                        recentPatients.length === 0 ? (
                          <p className="text-muted-foreground">No recent patients.</p>
                        ) :
                      recentPatients.map((patient) => (
                        <div key={patient.id} className="flex items-center justify-between p-1 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 bg-green-100 rounded-full flex items-center justify-center">
                              {patient.imageUrl ? (
                                <img src={patient.imageUrl} alt={patient.name} className="h-full w-full rounded-full object-cover" />
                              ) : (
                                <span className="text-green-600">{patient.name.charAt(0).toUpperCase()}</span>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{patient.name}</p>
                              <p className="text-sm text-muted-foreground">{patient.condition}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">{patient.lastVisit}</p>
                            <Button
                              onClick={() => {
                                setActiveItem("Patients");
                                router.push(`/doctor/patient/${patient.id}`);
                              }}
                              size="sm" variant="outline" className="mt-1 h-5">
                              View Profile
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button
                      onClick={() => {
                        setActiveItem("Patients");
                        router.push("/doctor/patient");
                      }}
                      className="w-full mt-4 health-green">
                      View All Patients
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card className=" mt-4">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                      onClick={() => {
                        setActiveItem("Prescriptions");
                        router.push("/doctor/prescriptions");
                      }}
                      className="health-green  py-4 flex gap-2 h-5">
                      <FileText className="h-3 w-3 p-0.5" />
                      Write Prescription
                    </Button>
                    <Button
                      onClick={() => {
                        setActiveItem("Schedule");
                        router.push("/doctor/schedule");
                      }}
                      className="health-green  py-4 flex gap-2 h-5">
                      <Calendar className="h-3 w-3 p-0.5" />
                      Schedule Appointment
                    </Button>
                    <Button
                      onClick={() => {
                        setActiveItem("Chat");
                        router.push("/doctor/chat");
                      }}
                      className="health-green  py-4 flex gap-2 h-5">
                      <MessageSquare className="h-3 w-3 p-0.5" />
                      Start Chat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>)
      }
    </>

  );
};

export default page;