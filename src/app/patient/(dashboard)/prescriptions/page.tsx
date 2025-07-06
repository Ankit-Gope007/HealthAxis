"use client";
import React, { use } from "react";
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PillIcon, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import PrescriptionCard from "./components/PrescriptionCard";
import { usePatientProfileStore } from "@/src/store/usePatientProfileStore";
import toast, { Toaster } from "react-hot-toast"
import axios from "axios";

type PresData = {
  appointment: {
    id: string;
    patientId: string;
    reason: string;
    createdAt: string;
    status: string;
    doctor: {
      id: string;
      doctorProfile: {
        fullName: string;
        imageUrl?: string | null;
        specialization?: string | null;

      }
    }
  };
  medicines: {
    name: string;
    dosage: string;
    instructions: string;
  }[];
  publicNotes: string;
}

const page = () => {
  const [activeTab, setActiveTab] = useState("current");
  const [searchQuery, setSearchQuery] = useState("");
  const { profile } = usePatientProfileStore();
  const [prescriptionData, setPrescriptions] = useState<PresData[]>([])
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile && profile.patientId) {
      fetchPrescriptions(profile.patientId);
    } else {
      console.warn("Profile or patientId not available yet");
    }
  }, [profile]);


  const fetchPrescriptions = async (patientId: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/prescription/getForPatient?patientId=${patientId}`);
      if (response.status === 200) {
        console.log("Fetcheing prescriptions for patientId:", patientId);
        console.log("Prescriptions fetched successfully:", response.data);
        const prescriptionsData = response.data as PresData[];
        setPrescriptions(prescriptionsData);
        setLoading(false);

      }

    } catch (error) {
      setLoading(false);
      console.error("Error fetching prescriptions:", error);
      toast.error("Failed to fetch prescriptions. Please try again later.");
    }
  }

  const transformedPrescriptions = prescriptionData.map((pres, index) => ({
    id: index + 1,
    status: pres.appointment.status,
    doctor: pres.appointment.doctor.doctorProfile.fullName,
    specialty: pres.appointment.doctor.doctorProfile.specialization || "General",
    date: new Date(pres.appointment.createdAt).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }),
    appointmentDate: new Date(pres.appointment.createdAt).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }),
    medications: pres.medicines.map(med => ({
      name: med.name,
      dosage: med.dosage,
      instructions: med.instructions                    // you can enhance this if you have duration
    })),
    notes: pres.publicNotes || "-",
    image: pres.appointment.doctor.doctorProfile.imageUrl || "https://source.unsplash.com/200x200/?doctor"
  }));



  const prescriptions = {
    current: transformedPrescriptions.filter(p => {
      const pres = prescriptionData.find(data => data.publicNotes === p.notes);
      return pres?.appointment.status === "CONFIRMED";
    }),
    past: transformedPrescriptions.filter(p => {
      const pres = prescriptionData.find(data => data.publicNotes === p.notes);
      return pres?.appointment.status === "COMPLETED";
    })
  };



  // Filter prescriptions based on search query
  // const filteredPrescriptions = {
  //   current: prescriptions.current.filter(p =>
  //     p.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     p.medications.some(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()))
  //   ),
  //   past: prescriptions.past.filter(p =>
  //     p.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     p.medications.some(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()))
  //   )
  // };

  // Filter prescriptions which doesn't have the status "Completed"
  const currentPrescriptions = prescriptionData.filter(p => p.appointment.status !== "COMPLETED");
  // Filter prescriptions which have the status "Completed"
  const pastPrescriptions = prescriptionData.filter(p => p.appointment.status === "COMPLETED");


  return (

    <div className='w-full lg:w-[90%] lg:ml-14 h-[100vh]'>
      <header className="mb-2 mt-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Prescriptions</h1>
        <p className="text-muted-foreground">View and manage your medical prescriptions</p>
      </header>

      <div className="mb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1 h-3 w-3 text-muted-foreground" />
          <Input
            placeholder="Search by medication or doctor name..."
            className="pl-10 h-5"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {
        loading ?
          (
            <div className="w-full h-[50%]  flex items-center justify-center flex-col gap-2">
              <div className="loading-animation h-10 w-10">
              </div>
              <div className="text-gray-500"> Loading Prescription Data ...</div>
            </div>
          )
          :
          (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-3">
              <TabsList className="w-full sm:w-auto grid grid-cols-2 h-5 sm:inline-flex">
                <TabsTrigger value="current">Current Prescriptions({currentPrescriptions.length})</TabsTrigger>
                <TabsTrigger value="past">Past Prescriptions({pastPrescriptions.length})</TabsTrigger>
              </TabsList >

              <TabsContent value="current" className="mt-3 space-y-4">
                {currentPrescriptions.length > 0 ? (
                  currentPrescriptions.map((prescription) => (
                    <PrescriptionCard key={prescription.appointment.id} prescription={
                      {
                        id: prescription.appointment.id,
                        status: prescription.appointment.status,
                        doctor: prescription.appointment.doctor.doctorProfile.fullName,
                        specialty: prescription.appointment.doctor.doctorProfile.specialization || "General",
                        date: new Date(prescription.appointment.createdAt).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        }),
                        appointmentDate: new Date(prescription.appointment.createdAt).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        }),
                        medications: prescription.medicines.map(med => ({
                          name: med.name,
                          dosage: med.dosage,
                          instructions: med.instructions
                        })),
                        notes: prescription.publicNotes || "-",
                        image: prescription.appointment.doctor.doctorProfile.imageUrl || "https://source.unsplash.com/200x200/?doctor"
                      }
                    } />
                  ))
                ) : (
                  <div className="bg-gray-50 border border-gray-100 rounded-lg p-8 text-center">
                    <PillIcon className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                    <h3 className="text-lg font-medium mb-1">No Current Prescriptions</h3>
                    <p className="text-muted-foreground">You don't have any active prescriptions.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="past" className="mt-6 space-y-4">
                {pastPrescriptions.length > 0 ? (
                  pastPrescriptions.map((prescription) => (
                    <PrescriptionCard key={prescription.appointment.id} prescription={
                      {
                        id: prescription.appointment.id,
                        status: prescription.appointment.status,
                        doctor: prescription.appointment.doctor.doctorProfile.fullName,
                        specialty: prescription.appointment.doctor.doctorProfile.specialization || "General",
                        date: new Date(prescription.appointment.createdAt).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        }),
                        appointmentDate: new Date(prescription.appointment.createdAt).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        }),
                        medications: prescription.medicines.map(med => ({
                          name: med.name,
                          dosage: med.dosage,
                          instructions: med.instructions
                        })),
                        notes: prescription.publicNotes || "-",
                        image: prescription.appointment.doctor.doctorProfile.imageUrl || "https://source.unsplash.com/200x200/?doctor"
                      }
                    } />
                  ))
                ) : (
                  <div className="bg-gray-50 border border-gray-100 rounded-lg p-8 text-center">
                    <h3 className="text-lg font-medium mb-1">No Past Prescriptions</h3>
                    <p className="text-muted-foreground">You don't have any past prescriptions.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs >
          )
      }



    </div >

  );
};


export default page;