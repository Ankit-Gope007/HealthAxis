"use client";
import React from "react";
import { useState, useEffect } from "react";
import PatientNotesModal from "./components/PatientNotesModal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Calendar,
  FileText,
  MessageSquare,
  Phone,
  Mail,
  ArrowLeft,
  Download,
  Edit,
  StickyNote
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import PrescribedMedcine from "./components/PrescribedMedcine";
import axios from "axios";
import { useDoctorProfileStore } from "@/src/store/useDoctorProfileStore";
import { getStatusStyle } from "@/src/lib/statusStyle";
import EditPrescription from "./components/EditPrescription";
import toast from "react-hot-toast";
import { useSidebarStore } from "@/src/store/useSidebarStore";

type PresData = {
  id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  dateIssued: string;
  status: string;
  medications: {
    id: string;
    name: string;
    dosage: string;
    instructions?: string;
  }[];
  publicNotes?: string;
  privateNotes?: string;
  appointment?: {
    reason: string;
    patient: {
      email: string;
      patientProfile: {
        fullName: string;
        imageUrl: string;
        phone: string;
        address: string;
        dob: string;
        bloodGroup: string;
        gender?: string;
        medicalHistory?: string;
      };
    };
    doctor: {
      id: string;
      doctorProfile: {
        fullName: string;
        imageUrl: string;
      };
    };
  };
}

const Page = () => {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();
  const { profile } = useDoctorProfileStore();
  const [loading, setLoading] = useState(false);
  const [presData, setPresData] = useState<PresData>(
    {
      id: "",
      appointmentId: id || "",
      patientId: "",
      doctorId: profile?.doctorId || "",
      dateIssued: new Date().toISOString().split("T")[0],
      status: "active",
      medications: [],
      publicNotes: "",
      privateNotes: "",
      appointment: {
        reason: "",
        patient: {
          email: "",
          patientProfile: {
            fullName: "",
            imageUrl: "",
            phone: "",
            address: "",
            dob: "",
            bloodGroup: ""
          }
        },
        doctor: {
          id: profile?.doctorId || "",
          doctorProfile: {
            fullName: profile?.fullName || "",
            imageUrl: profile?.imageUrl || ""
          }
        }
      }
    }
  );
  const { setActiveItem } = useSidebarStore();

  useEffect(() => {
    console.log("Updated prescription data:", presData);
  }, [presData]);



  const fetchPrescriptionData = React.useCallback(async (appointmentId: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/prescription/getForDoctor?appointmentId=${appointmentId}`);
      if (response.status !== 200 && response.status !== 404) {
        throw new Error("Failed to fetch prescription data");
      }
      console.log("Prescription data fetched successfully:", response.data);

      const apiData = response.data;

      // 💡 Fix the key difference here:
      const mapped: PresData = {
        ...apiData,
        medications: apiData.medicines || [],
        dateIssued: apiData.createdAt,
        status: apiData.appointment.status,
        // You can also map/rename other keys if needed
      };

      // if(response.status===404){
      //   toast("Prescription not found. Please create a New Prescription First");
      //   setLoading(false);
      //   router.push('/doctor/prescriptions');
      // }

      setPresData(mapped);
      setLoading(false);

    } catch (error) {
      if (typeof error === "object" && error !== null && "status" in error && (error as any).status === 404) {
        toast("Prescription not found. Please create a New Prescription First");
        setLoading(false);
        router.push('/doctor/prescriptions');
      } else {
        setLoading(false);
        toast.error("Failed to fetch prescription data. Please try again later.");
        // Log the error for debugging
      }
      console.error("Error fetching prescription data:", error);


    }
  }, [router]);


  useEffect(() => {
    setActiveItem("Prescriptions");
    if (id) {
      fetchPrescriptionData(id);
    }
    console.log("Prescription ID:", presData?.id);
  }, [fetchPrescriptionData, id, presData?.id, setActiveItem]);



  const prescriptionData = {
    id: presData.id || id,
    patient: {
      id: presData.patientId || "N/A",
      name: presData.appointment?.patient.patientProfile.fullName || "N/A",
      age: presData.appointment?.patient.patientProfile.dob
        ? new Date().getFullYear() - new Date(presData.appointment.patient.patientProfile.dob).getFullYear()
        : "N/A",
      gender: presData.appointment?.patient.patientProfile.gender || "N/A",
      phone: presData.appointment?.patient.patientProfile.phone || "N/A",
      email: presData.appointment?.patient.email || "N/A",
      bloodType: presData.appointment?.patient.patientProfile.bloodGroup || "N/A",
      allergies: presData.appointment?.patient.patientProfile.medicalHistory
        ? presData.appointment?.patient.patientProfile.medicalHistory.split(",")
        : [],
      currentConditions: presData.appointment?.reason,
      avatar: presData.appointment?.patient.patientProfile.imageUrl,
      medicalHistory: presData.appointment?.patient.patientProfile.medicalHistory || "N/A"
    },
    prescription: {
      id: presData.id || id,
      dateIssued: presData.dateIssued.split("T")[0] || new Date().toISOString().split("T")[0],
      status: presData.status || "N/A",
      medications: presData.medications,
      notes: presData.publicNotes || "N/A",
      nextRefillDate: "N/A", // or real value
      refillsRemaining: 0 // or real value
    }
  };





  return (
    <>
      {
        loading ?
          (
            <div className="w-full lg:w-[90%] lg:ml-14 h-[100vh] flex-col gap-5 center " >
              <div className="loading-animation h-12 w-12">
              </div>
              <div>
                <p className="text-muted-foreground">Loading prescription data...</p>
              </div>
            </div>
          )
          :
          (

            <div className="w-full lg:w-[90%] lg:ml-14 h-[100vh]  " >
              <div className="flex items-center gap-4 mb-2">
                <Button
                  variant="ghost"
                  onClick={() => router.push('/doctor/prescriptions')}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-3 w-3 mr-2" />
                  Back to Prescriptions
                </Button >
              </div >

              <header className="mb-3">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={prescriptionData.patient.avatar} />
                      <AvatarFallback className="bg-green-100 text-green-700">
                        {prescriptionData.patient.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 mb-1">{prescriptionData.patient.name}</h1>
                      <p className="text-muted-foreground">{prescriptionData.patient.age} years • {prescriptionData.patient.gender}</p>
                      <p className="text-sm text-muted-foreground">Prescription #{prescriptionData.prescription.id}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <PatientNotesModal
                      patientName={prescriptionData.patient.name}
                      publicNotes={presData.publicNotes}
                      privateNotes={presData.privateNotes}
                      appointmentId={presData.appointmentId}
                      status={presData.status}
                    >
                      <Button variant="outline">
                        <StickyNote className="h-4 w-4 mr-2" />
                        Patient Notes
                      </Button>
                    </PatientNotesModal>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>

                  </div>
                </div>
              </header>

              {/* Current Prescription Details */}
              <Card className="green-card mb-8 border-l-4 border-l-green-600" >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-green-600" />
                      Current Prescription Details
                      <Badge className={getStatusStyle(prescriptionData.prescription.status)}>
                        {prescriptionData.prescription.status}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Date Issued</p>
                        <p className="font-medium">{prescriptionData.prescription.dateIssued}</p>
                      </div>
                    </div>

                  </CardTitle>
                </CardHeader>
                <CardContent>


                  <Separator className="my-2" />

                  <div>
                    <h4 className="font-medium text-lg mb-4">Prescribed Medications</h4>
                    <div className="space-y-4">
                      {prescriptionData.prescription.medications.map((medication) => (
                        <PrescribedMedcine key={medication.id} medication={medication} />
                      ))}
                    </div>
                  </div>

                  {prescriptionData.prescription.notes && (
                    <>
                      <Separator className="my-6" />
                      <div>
                        <h4 className="font-medium text-lg mb-2">Doctor&apos;s Notes</h4>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <p className="text-sm">{prescriptionData.prescription.notes}</p>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card >

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                {/* Patient Information */}
                {
                  presData.status !== "COMPLETED" &&
                  (
                    <div className="lg:col-span-1 space-y-6">
                      <Card className="green-card">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5 text-green-600" />
                            Patient Information
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Phone</label>
                            <p className="flex items-center gap-2 mt-1">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              {prescriptionData.patient.phone}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Email</label>
                            <p className="flex items-center gap-2 mt-1">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              {prescriptionData.patient.email}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Blood Type</label>
                            <p className="mt-1 font-medium text-red-600">{prescriptionData.patient.bloodType}</p>
                          </div>
                        </CardContent>
                      </Card>


                    </div>
                  )
                }


                <div className="lg:col-span-2 space-y-6">
                  {/* Quick Actions */}
                  {
                    prescriptionData.prescription.status !== "COMPLETED" &&
                    (
                      <Card className="green-card">
                        <CardHeader>
                          <CardTitle>Prescription Actions</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                            <EditPrescription
                              prescriptionId={prescriptionData.prescription.id}
                              medications={prescriptionData.prescription.medications}
                              publicNotes={presData.publicNotes}
                              appointmentId={presData.appointmentId}
                            >
                              <Button className="health-green">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Current Prescription
                              </Button>
                            </EditPrescription>

                            <PatientNotesModal
                              patientName={prescriptionData.patient.name}
                              publicNotes={presData.publicNotes}
                              privateNotes={presData.privateNotes}
                            >
                              <Button variant="outline" className="w-full">
                                <StickyNote className="h-4 w-4 mr-2" />
                                Manage Notes
                              </Button>
                            </PatientNotesModal>
                            <Button variant="outline">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Message Patient
                            </Button>

                          </div>
                        </CardContent>
                      </Card>
                    )
                  }
                </div>
              </div>
            </div >
          )
      }
    </>

  );
};

export default Page;
