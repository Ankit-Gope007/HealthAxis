"use client";
import React, { useState, useEffect } from "react";
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
    Clock,
    MapPin,

    X
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { getStatusStyle } from "@/src/lib/statusStyle";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";


type AppointmentData = {
    id: string;
    patientId: string;
    doctorId: string;
    date: string;
    timeSlot: string;
    reason?: string;
    status: string;
    location: string

    // Relations
    patient: {
        email: string;
        patientProfile: {
            fullName: string;
            dob: string;
            phone: string;
            imageUrl?: string;
            address?: string;
            bloodGroup?: string;
            medicalHistory?: string;
            currentMedications?: string;
            gender?: string;
            emergencyContactNumber?: string;
        }
    }
    doctor: {
        email: string;
        doctorProfile: {
            address?: string;
        }
    }
}


const DoctorAppointmentPatient = () => {
    const params = useParams<{ id: string }>();
    const id = params?.id;
    const router = useRouter();
    const [appointmentData, setAppointmentData] = useState<AppointmentData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    
    

   

    const getAppoinmentDetail = async (appointmentId: string) => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/appointment/getById?appointmentId=${appointmentId}`);
            if (res.status === 200) {
                const data = res.data;
                console.log("Appointment details fetched successfully:", data);
                setAppointmentData(data);
                setLoading(false);
            } else {
                console.error("Failed to fetch appointment details:", res.statusText);
                setLoading(false);
            }
        } catch (error) {
            console.error("Error fetching appointment details:", error);
            setLoading(false);
        }
    }

    const handleCancelAppointment = (appointmentId: string, patientName: string) => {
        toast((t) => (
            <div className="text-sm p-3">
                <p className="font-semibold text-red-600">⚠️ Cancel Appointment for {patientName}?</p>
                <p className="text-xs text-gray-600 mt-1">
                    This action will permanently cancel the appointment and notify the patient.
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
                                const res = await axios.delete(`/api/appointment/delete?appointmentId=${appointmentId}`);
                                if (res.status !== 200) {
                                    throw new Error("Failed to cancel appointment");
                                }
                                toast.success(`✅ Appointment for ${patientName} cancelled`, {
                                    duration: 3000,
                                    position: "top-right",
                                    style: {
                                        background: "#DC3545",
                                        color: "#fff",
                                    },
                                });
                                router.push('/doctor/appointments');
                            } catch (error) {
                                console.error("Error cancelling appointment:", error);
                                toast.error(`❌ Could not cancel appointment for ${patientName}`, {
                                    duration: 3000,
                                    position: "top-right",
                                    style: {
                                        background: "#DC3545",
                                        color: "#fff",
                                    },
                                });
                            }
                        }}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        ), { duration: 10000 });
    };

    const handleCompleteAppointment = async (appointmentId = appointmentData?.id, patientName = appointmentData?.patient.patientProfile.fullName) => {
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
                                //  sending the appointmentId and status to the API to confirm the appointment
                                const res = await axios.post("/api/appointment/completeAppointment", { appointmentId: appointmentId });
                                if (res.status !== 200) {
                                    throw new Error("Failed to confirm appointment");
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

    useEffect(() => {
        if (id) {
            const appointmentId = id.toString();
            getAppoinmentDetail(appointmentId);
        } else {
            console.error("No appointment ID provided");
        }
    }, [id]);

    const handleConfirmAppointment = async (appointmentId = appointmentData?.id, patientName = appointmentData?.patient.patientProfile.fullName) => {
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
                                //  sending the appointmentId and status to the API to confirm the appointment
                                const res = await axios.post("/api/appointment/updateStatus", { appointmentId: appointmentId, status: "CONFIRMED" });
                                if (res.status !== 200) {
                                    throw new Error("Failed to confirm appointment");
                                }
                                toast.success(`✅ Appointment for ${patientName} CONFIRMED!`, {
                                    duration: 3000,
                                    position: "top-right",
                                    style: {
                                        background: "#28A745",
                                        color: "#fff",
                                    },
                                });
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

    return (
        <>
            {loading ? (
                <div className='w-full lg:w-[90%] lg:ml-14 h-[100vh] center flex-col gap-2'>
                    <div className="loading-animation h-16 w-16 border-b-2 border-green-500"></div>
                    <div className="text-gray-500"> Loading Appointment Details ...</div>
                </div>
            ) : (

                <div className="w-full lg:w-[90%] lg:ml-14 h-[100vh]">
                    <Toaster position="top-right" reverseOrder={false} />
                    <div className="flex items-center gap-1 mb-1">
                        <Button
                            variant="ghost"
                            onClick={() => router.push('/doctor/appointments')}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Appointments
                        </Button>
                    </div>

                    <header className="mb-2">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16">
                                    {appointmentData?.patient?.patientProfile?.imageUrl ? (
                                        <AvatarImage src={appointmentData.patient.patientProfile.imageUrl} alt={appointmentData.patient.patientProfile.fullName} />
                                    ) : (
                                        <AvatarFallback className="bg-health-100 text-health-700">
                                            {appointmentData?.patient?.patientProfile?.fullName.split(" ").map(n => n[0]).join("")}
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 mb-1">{appointmentData?.patient.patientProfile.fullName}</h1>
                                    {/* convert the dob into age */}
                                    <p className="text-sm text-muted-foreground">
                                        {appointmentData?.patient.patientProfile.dob ?
                                            `Age: ${new Date().getFullYear() - new Date(appointmentData.patient.patientProfile.dob).getFullYear()}` :
                                            "Age: N/A"}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Gender: {appointmentData?.patient.patientProfile.gender || "N/A"}
                                    </p>
                                    <p className="text-sm text-muted-foreground">Appointment : {appointmentData?.id}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {
                                    appointmentData?.status === "PENDING" ? (
                                        <Button
                                            onClick={() => handleConfirmAppointment(appointmentData?.id || "", appointmentData?.patient
                                                .patientProfile.fullName || "Patient")}
                                            className="bg-[#28A745] text-white hover:bg-[#2ea728]
                                            active:shadow-lg flex items-center"
                                        >
                                            <FileText className="h-4 w-4 mr-2" />
                                            Confirm Appointment
                                        </Button>
                                    )
                                        :
                                        (
                                            <>
                                                <Button variant="outline" className="">
                                                    <MessageSquare className="h-4 w-4 mr-2" />
                                                    Start Chat
                                                </Button>
                                                <Button
                                                    onClick={() => router.push(`/doctor/prescriptions/${appointmentData?.id}`)}
                                                    className="bg-[#28A745] text-white hover:bg-[#2ea728] active:shadow-lg flex items-center">
                                                    <FileText className="h-4 w-4 mr-2" />
                                                    Write Prescription
                                                </Button>
                                            </>
                                        )
                                }
                            </div>
                        </div>
                    </header>

                    {/* Current Appointment Info */}
                    <Card className="health-card mb-2 border-l-4 border-l-health-600">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-health-600" />
                                Current Appointment Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Date</p>
                                        <p className="font-medium">
                                            {appointmentData?.date ? (
                                                new Date(appointmentData.date).toLocaleDateString(
                                                    "en-US",
                                                    {
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric"
                                                    }
                                                )
                                            ) : (
                                                "N/A"
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Time</p>
                                        <p className="font-medium">{appointmentData?.timeSlot}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Location</p>
                                        <p className="font-medium">{appointmentData?.doctor.doctorProfile.address}</p>
                                    </div>
                                </div>
                            </div>
                            <Separator className="my-4" />
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Reason for Visit</p>
                                <p className="font-medium">{appointmentData?.reason}</p>
                            </div>
                            <div className="flex items-center gap-4 mt-4">
                                <Badge className={getStatusStyle(appointmentData?.status || "")}>
                                    {appointmentData?.status}
                                </Badge>
                                <span className="text-sm text-muted-foreground">Duration: 15 mins</span>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                        {/* Patient Information */}
                        <div className="lg:col-span-1 space-y-6">
                            <Card className="health-card">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="h-5 w-5 text-health-600" />
                                        Patient Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Phone</label>
                                        <p className="flex items-center gap-2 mt-1">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            {appointmentData?.patient.patientProfile.phone || "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Email</label>
                                        <p className="flex items-center gap-2 mt-1">
                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                            {appointmentData?.patient.email || "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Address</label>
                                        <p className="mt-1 text-sm">{appointmentData?.patient.patientProfile.address || "N/A"}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Emergency Contact</label>
                                        <p className="mt-1 text-sm">{appointmentData?.patient.patientProfile.emergencyContactNumber || "N/A"}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Blood Type</label>
                                        <p className="mt-1 font-medium text-red-600">{appointmentData?.patient.patientProfile.bloodGroup || "N/A"}</p>
                                    </div>
                                </CardContent>
                            </Card>

                          
                        </div>

                   
                        <div className="lg:col-span-2 space-y-6">
            
                          

                            {/* Quick Actions */}
                            <Card className="health-card">
                                <CardHeader>
                                    <CardTitle>Appointment Actions</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {
                                            appointmentData?.status === "PENDING" ? (
                                                <Button
                                                    onClick={() => handleConfirmAppointment(appointmentData?.id || "", appointmentData?.patient.patientProfile.fullName || "Patient")}
                                                    className="bg-[#28A745] text-white hover:bg-[#2ea728] active:shadow-lg flex items-center">
                                                    <FileText className="h-4 w-4 mr-2" />
                                                    Confirm Appointment
                                                </Button>
                                            ) : (
                                                <>
                                                    <Button
                                                        onClick={() => handleCompleteAppointment(appointmentData?.id || "", appointmentData?.patient.patientProfile.fullName || "Patient")}
                                                        className="bg-[#28A745] text-white hover:bg-[#2ea728] active:shadow-lg flex items-center">
                                                        <FileText className="h-4 w-4 mr-2" />
                                                        Complete Appointment
                                                    </Button>
                                                    <Button variant="outline">
                                                        <MessageSquare className="h-4 w-4 mr-2" />
                                                        Send Message
                                                    </Button>
                                                    <Button variant="outline">
                                                        <Calendar className="h-4 w-4 mr-2" />
                                                        Reschedule
                                                    </Button>
                                                </>
                                            )
                                        }

                                        <Button
                                            variant="outline"
                                            onClick={() => handleCancelAppointment(appointmentData?.id || "", appointmentData?.patient.patientProfile.fullName || "Patient")}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <X className="h-4 w-4 mr-2" />
                                            Cancel Appointment
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div >
            )
            }
        </>



    );
};

export default DoctorAppointmentPatient;