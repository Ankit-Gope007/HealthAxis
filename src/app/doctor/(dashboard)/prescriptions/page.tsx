"use client";
import React from "react";
import NewPrescriptionDialog from "./components/NewPrescriptionDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Plus, Search, Calendar, Clock } from "lucide-react";
import { useState,useEffect } from "react";
import PrescriptionCard from "./components/PrescriptionCard";
import axios from "axios";
import { useDoctorProfileStore } from "@/src/store/useDoctorProfileStore";
import { useSidebarStore } from "@/src/store/useSidebarStore";

type AppointmentPatientData = {

  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  timeSlot: string;
  reason?: string;
  status: string
  location: string

  // Relations
  patient: {
    email: string;
    patientProfile: {
      fullName: string;
      imageUrl: string;
      phone: string;
      address: string;
    }

  }

  doctor: {
    id: string;
    doctorProfile: {
      fullName: string;
      imageUrl: string;

    }
  }

}





const page = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [appointmentsData, setAppointmentsData] = useState<AppointmentPatientData[]>([]);
  const [loading, setLoading] = useState(false);
  const {profile} = useDoctorProfileStore();
  const [recentPrescriptions, setRecentPrescriptions] = useState<any[]>([]);
  const {setActiveItem} = useSidebarStore();

    useEffect(() => {
    setActiveItem("Prescriptions");
    
    if (profile && profile.doctorId) {
      fetchAppointments(profile.doctorId);
      fetchRecentPrescriptions(profile.doctorId)
    } else {
      console.warn("Profile or patientId not available yet");
    }


  }, [profile]);


  const fetchAppointments = async (id: string) => {
    try {
      setLoading(true);
      console.log("Fetching appointments for patient ID:", id);
      const response = await axios.get(`/api/appointment/getAllForDoctor?doctorId=${id}`);
      if (response.status === 200) {
        console.log("Appointments fetched successfully:", response.data);
        setAppointmentsData(response.data);
        setLoading(false);
      } else {
        console.error("Failed to fetch appointments:", response.statusText);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setLoading(false);
    }
  };


  const fetchRecentPrescriptions = async (doctorId: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/prescription/recentPresForDoc?doctorId=${doctorId}`);
      if (response.status === 200) {
        console.log("Recent prescriptions fetched successfully:", response.data);
        setRecentPrescriptions(response.data);
        setLoading(false);
        return response.data;
      } else {
        setLoading(false);
        console.error("Failed to fetch recent prescriptions:", response.statusText);
        return [];

      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching recent prescriptions:", error);
      return [];
    }
  }

 const prescriptions = recentPrescriptions.map((prescription: any) => ({
    id: prescription.id,
    appointmentId: prescription.appointmentId,
    patient: prescription.appointment.patient.patientProfile.fullName,
    age: prescription.appointment.patient.patientProfile.dob.split("-")[0] ? new Date().getFullYear() - new Date(prescription.appointment.patient.patientProfile.dob).getFullYear() : "N/A",
    medication: prescription.medicines.map((med: any) => med.name).join(", "),
    frequency: prescription.frequency,
    date: prescription.createdAt,
    status: prescription.appointment.status,
    image: prescription.appointment.patient.patientProfile.imageUrl || "/default-avatar.png"
  }));



  const filteredPrescriptions = prescriptions.filter(prescription =>
    prescription.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prescription.medication.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = prescriptions.filter(p => p.status === 'CONFIRMED').length;
  const completedCount = appointmentsData.filter(p => p.status === 'COMPLETED').length;

  return (

    <div className="w-full lg:w-[90%] lg:ml-14 h-[100vh]  ">
      <header className="mb-2 mt-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Prescriptions</h1>
            <p className="text-muted-foreground">Manage patient prescriptions and medications</p>
          </div>
          <NewPrescriptionDialog>
            <Button className="health-green">
              <Plus className="h-4 w-4 mr-2" />
              New Prescription
            </Button>
          </NewPrescriptionDialog>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <Card className="p-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="mr-1">
                <p className="text-sm font-medium text-muted-foreground">Active Prescriptions</p>
                <p className="text-2xl font-bold text-green-600">{activeCount}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-gray-600">{completedCount}</p>
              </div>
              <div className="bg-gray-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Patients</p>
                <p className="text-2xl font-bold text-blue-600">{prescriptions.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative ">
          <Search className="absolute left-3 top-1 h-3 w-3 text-muted-foreground" />
          <Input
            placeholder="Search by patient or medication..."
            className="pl-10 h-5 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Prescriptions List */}
      <Card className="p-0">
        <CardHeader className="mt-4">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-600" />
            Recent Prescriptions
          </CardTitle>
        </CardHeader>
        <CardContent>
         { loading ? (
            <div className="w-full center pb-5">
              <div className="loading-animation h-5 w-5">

              </div>
            </div>
         )
         :
         (<div className="space-y-4">
            {filteredPrescriptions.map((prescription) => (
              <PrescriptionCard 
                key={prescription.id}
                id={prescription.appointmentId.toString()}
                patient={prescription.patient}
                age={prescription.age.toString() }
                medication={prescription.medication}
                frequency={prescription.frequency}
                date={new Date(prescription.date).toLocaleDateString()}
                status={prescription.status}
                image={prescription.image}
              
              />
            ))}
          </div>)}
        </CardContent>
      </Card>
    </div>

  );
};

export default page;
