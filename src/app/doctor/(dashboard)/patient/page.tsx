"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, User } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { FaRegFileAlt } from "react-icons/fa";
import axios from "axios";
import { useDoctorProfileStore } from "@/src/store/useDoctorProfileStore";
import { useSidebarStore } from "@/src/store/useSidebarStore";
import { useEffect } from "react";

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

const DoctorPatients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [appointmentData, setAppointmentData] = useState<AppointmentWithPatient[]>([]);
  const { setActiveItem } = useSidebarStore();
  const [hasFetched, setHasFetched] = useState(false); // New state to track if fetch has occurred
  const [loading, setLoading] = useState(false);
  const { profile } = useDoctorProfileStore();



  // Count the same number of patients to find out how many times they have visited and make it a function
  const patientVisitCount: { [key: string]: number } = {};
  appointmentData.forEach(appointment => {
    if (appointment.patientId) {
      if (!patientVisitCount[appointment.patientId]) {
        patientVisitCount[appointment.patientId] = 0;
      }
      patientVisitCount[appointment.patientId]++;
    }
  }
  );

  // latest condition of visit if he/she has visited multiple times and make it a function that i can use
  const latestCondition = (patientId: string) => {
    const patientAppointments = appointmentData.filter(appointment => appointment.patientId === patientId);
    if (patientAppointments.length > 0) {
      return patientAppointments[patientAppointments.length - 1].reason || "No condition provided";
    }
    return "No condition provided";
  };
  // Last date of visit
  const lastVisitDate = (patientId: string) => {
    const patientAppointments = appointmentData.filter(appointment => appointment.patientId === patientId);
    if (patientAppointments.length > 0) {
      const lastAppointment = patientAppointments[patientAppointments.length - 1];
      const date = new Date(lastAppointment.date);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    }
    return "No visits yet";
  };

  const patients = appointmentData.map(appointment => ({
    id: appointment.patient.id,
    imageUrl: appointment.patient.patientProfile.imageUrl || null,
    name: appointment.patient.patientProfile.fullName,
    age: new Date().getFullYear() - new Date(appointment.patient.patientProfile.dob).getFullYear(),
    gender: appointment.patient.patientProfile.gender,
    lastVisit: lastVisitDate(appointment.patient.id), // Use the lastVisitDate function
    condition: latestCondition(appointment.patient.id), // Use the latest condition function
    totalVisits: patientVisitCount[appointment.patient.id] || 1 // Use the count from patientVisitCount
  }));



  useEffect(() => {
    setActiveItem("Patients");
  }, [setActiveItem]);

  useEffect(() => {
    console.log("Doctor Profile:", profile);
    if (profile && profile.doctorId && !hasFetched) {
      fetchPatients(profile.doctorId);
      setHasFetched(true);
    } else if (!profile?.doctorId) {
      setHasFetched(false);
    }
  }, [profile, hasFetched]); // Depend on profile and hasFetched


  //  filter unique patients based on their ID
  const filteredPatients = Array.from(new Map(patients.map(patient => [patient.id, patient])).values())
    .filter(patient => {
      const searchLower = searchTerm.toLowerCase();
      return (
        patient.name.toLowerCase().includes(searchLower) ||
        patient.condition.toLowerCase().includes(searchLower) ||
        patient.lastVisit.toLowerCase().includes(searchLower)
      );
    }
    )
    .sort((a, b) => new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime()); // Sort by last visit date, most recent first


  const fetchPatients = async (id: string) => {
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
  }

  return (
    <>
      {
        loading ?
          (
            <div className="w-full lg:w-[90%] lg:ml-14 h-[100vh] flex-col gap-5 center " >
              <div className="loading-animation h-12 w-12">
              </div>
              <div>
                <p className="text-muted-foreground">Loading Patients data...</p>
              </div>
            </div>
          )
          :
          (
            <div className='w-full lg:w-[90%] lg:ml-14 h-[100vh] '>
              <header className="mb-4 mt-4">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Patients</h1>
                <p className="text-muted-foreground">Manage your patient records</p>
              </header>

              {/* Search */}
              <Card className="health-card mb-6 py-0">
                <CardContent className="p-4">
                  <div className="flex  flex-col md:flex-row gap-4 items-center">
                    <div className="flex-1 w-full">
                      <Input
                        placeholder="Search by patient name or condition..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-5"
                      />
                    </div>

                  </div>
                </CardContent>
              </Card>

              {/* Patients Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredPatients.map((patient) => (
                  <Card key={patient.id} className="health-card hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-0">
                      <div className="flex items-center gap-1">
                        <div className="h-9 w-9 bg-green-100 rounded-full flex items-center justify-center">
                          {patient.imageUrl ? (
                            <img src={patient.imageUrl} alt={patient.name} className="h-9 w-9 rounded-full object-cover" />
                          ) : (
                            <User className="h-6 w-6 text-green-700" />
                          )}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{patient.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {patient.age} years • {patient.gender}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Last Visit:</span>
                          <span className="font-medium">{patient.lastVisit}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Total Visits:</span>
                          <span className="font-medium">{patient.totalVisits}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm gap-2">
                          <span className="text-muted-foreground">Condition:</span>
                          <span className="font-medium text-green-700 mt-1">{patient.condition}</span>
                        </div>
                      </div>

                      <div className="flex-col gap-2 pt-2">
                        <Link href={`/doctor/patient/${patient.id}`} className="flex-1">
                          <Button variant="outline" className="health-green w-full h-7 text-sm ">
                            <FaRegFileAlt className=" mr-1" />
                            View Profile
                          </Button>
                        </Link>

                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredPatients.length === 0 && (
                <Card className="health-card">
                  <CardContent className="p-8 text-center">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No patients found</h3>
                    <p className="text-muted-foreground">
                      {searchTerm ? "Try adjusting your search terms" : "You don't have any patients yet"}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )
      }
    </>

  );
};

export default DoctorPatients;