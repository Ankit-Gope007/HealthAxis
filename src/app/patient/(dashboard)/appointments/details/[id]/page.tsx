"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
    Calendar,
    Clock,
    MapPin,
    Phone,
    MessageSquare,
    FileText,
    ArrowLeft,
    User
} from "lucide-react";
import { MdOutlineEmail } from "react-icons/md";
import { getStatusStyle } from "@/src/lib/statusStyle";
import axios from "axios";

type AppointmentData = {
    id: string;
    patientId: string;
    doctorId: string;
    date: string;
    timeSlot: string;
    reason?: string;
    status: string
    location: string

    // Relations
    doctor: {
        id: string;
        email?: string;
        doctorProfile: {
            fullName: string;
            specialization: string;
            imageUrl?: string | "";
            phone?: string;
            address?: string;
        }
    }

    patient?: {
        id: string;
        name: string;
    };
}

const Page = () => {
    const params = useParams<{ id: string }>();
    const id = params?.id;
    const router = useRouter();
    const [appointmentData, setAppointmentData] = useState<AppointmentData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // Mock appointment data - in real app, fetch based on appointmentId
    const appointment = {
        id: id,
        doctor: "Sarah Johnson",
        specialty: "Cardiologist",
        date: "May 18, 2025",
        time: "10:30 AM",
        status: "CONFIRMED", // can be "pending", "approved", "completed", "cancelled"
        location: "Downtown Medical Center",
        address: "123 Medical Plaza, Suite 200, Downtown City, ST 12345",
        notes: "Annual heart checkup - Please bring previous test results",
        doctorPhone: "+1 (555) 123-4567",
        estimatedDuration: "45 minutes",
        appointmentType: "Follow-up",
        instructions: "Please arrive 15 minutes early for check-in. Bring a valid ID and insurance card.",
        avatarUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=200&auto=format&fit=crop"
    };

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

    useEffect(() => {
        if (id) {
            const appointmentId = id.toString();
            getAppoinmentDetail(appointmentId);
        } else {
            console.error("No appointment ID provided");
        }
    }, [id]);



    return (
        <>
            {
                loading ?
                    <div className='w-full lg:w-[90%] lg:ml-14 h-[100vh] center'>
                        <div className="loading-animation h-16 w-16 border-b-2 border-green-500"></div>
                    </div>
                    : (
                        <div className='w-full lg:w-[90%] lg:ml-14 h-[100vh]'>
                            <div className="flex items-center gap-4 mb-2">
                                <Button
                                    variant="ghost"
                                    onClick={() => router.push('/patient/appointments')}
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back to Appointments
                                </Button>
                            </div>

                            <header className="mb-2 p-2">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Appointment Details</h1>
                                        <p className="text-muted-foreground">Appointment #{appointment.id}</p>
                                    </div>
                                    <Badge className={`text-xs font-medium ${getStatusStyle(appointmentData?.status || "")}`}>
                                        {appointmentData?.status || "Unknown Status"}
                                    </Badge>
                                </div>
                            </header>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                                {/* Doctor Information */}
                                <div className="lg:col-span-1">
                                    <Card className="health-card gap-0">
                                        <CardHeader className="mb-2">
                                            <CardTitle className="flex items-center gap-2">
                                                <User className="h-5 w-5 text-health-600" />
                                                Doctor Information
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-14 w-14">
                                                    <AvatarImage src={appointmentData?.doctor.doctorProfile.imageUrl} />
                                                    <AvatarFallback className="bg-health-100 text-health-700">
                                                        {appointmentData?.doctor.doctorProfile.fullName.charAt(0).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <h3 className="font-semibold text-lg">
                                                        {appointmentData?.doctor.doctorProfile.fullName || "Dr. Unknown"}
                                                    </h3>
                                                    <p className="text-muted-foreground">
                                                        {appointmentData?.doctor.doctorProfile.specialization || "Specialization Unknown"}
                                                    </p>
                                                </div>
                                            </div>

                                            <Separator />

                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <Phone className="h-2 w-2 text-muted-foreground" />
                                                    <span className="text-sm">
                                                        {appointmentData?.doctor.doctorProfile.phone || "Not Available"}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <MdOutlineEmail className="h-2 w-2 text-muted-foreground" />
                                                    <span className="text-sm">
                                                        {appointmentData?.doctor.email || "Not Available"}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex gap-2 pt-4">
                                                <Button variant="outline" className="flex-1 h-5 w-fit p-1 cursor-pointer bg-[#28A745] text-white" >
                                                    Message
                                                </Button>
                                                <Button variant="outline" size="sm" className="flex-1 h-5 w-fit p-1 cursor-pointer text-[#28A745]">

                                                    Call
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Appointment Details */}
                                <div className="lg:col-span-2 space-y-2">
                                    <Card className="gap-0  ">
                                        <CardHeader className="mb-2">
                                            <CardTitle className="flex items-center gap-2">
                                                <Calendar className="h-5 w-5 text-health-600" />
                                                Appointment Information
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-sm font-medium text-muted-foreground">Date</label>
                                                    <p className="font-medium flex items-center gap-2 mt-1">
                                                        <Calendar className="h-4 w-4 text-health-600" />
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
                                                <div>
                                                    <label className="text-sm font-medium text-muted-foreground">Time</label>
                                                    <p className="font-medium flex items-center gap-2 mt-1">
                                                        <Clock className="h-4 w-4 text-health-600" />
                                                        {appointmentData?.timeSlot}
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-muted-foreground">Duration</label>
                                                    <p className="font-medium mt-1">15 mins</p>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-muted-foreground">Type</label>
                                                    <p className="font-medium mt-1">Check Up</p>
                                                </div>
                                            </div>

                                            <Separator />

                                            <div>
                                                <label className="text-sm font-bold">Location</label>
                                                <p className="font-medium flex items-start gap-2 mt-1">
                                                    <MapPin className="h-4 w-4 text-health-600 mt-0.5" />
                                                    <span>
                                                        <span className="text-muted-foreground text-sm">{appointmentData?.doctor.doctorProfile.address}</span>
                                                    </span>
                                                </p>
                                            </div>

                                            {appointmentData?.reason && (
                                                <>
                                                    <Separator />
                                                    <div>
                                                        <label className="text-sm font-medium text-muted-foreground">Reason for Visit</label>
                                                        <p className="mt-1">{appointmentData.reason}</p>
                                                    </div>
                                                </>
                                            )}


                                            <Separator />
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">Instructions</label>
                                                <p className="mt-1 text-sm bg-blue-50 p-3 rounded-lg">Please arrive 15 minutes early for check-in. Bring a valid ID and insurance card.</p>
                                            </div>

                                        </CardContent>
                                    </Card>

                                    {/* Actions */}
                                    {appointment.status === "CONFIRMED" ? (
                                        <Card className="health-card">
                                            <CardHeader>
                                                <CardTitle>Quick Actions</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="flex flex-wrap gap-3">
                                                    {/* Download Appointment Details Button */}
                                                    <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                                                        <FileText className="h-4 w-4 mr-2" />
                                                        Download Details
                                                    </Button>
                                                    {/* Add to Calendar Button */}
                                                    <Button variant="outline" className="text-green-600 border-green-200 hover:bg-green-50">
                                                        <Calendar className="h-4 w-4 mr-2" />
                                                        Add to Calendar
                                                    </Button>
                                                    {/* Contact Doctor Button */}
                                                    <Button variant="outline" className="text-purple-600 border-purple-200 hover:bg-purple-50">
                                                        <MessageSquare className="h-4 w-4 mr-2" />
                                                        Contact Doctor
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ) : (
                                        <Card className="health-card">
                                            <CardHeader>
                                                <CardTitle>Appointment Actions</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="flex flex-wrap gap-3">
                                                    {/* cancle appointment button*/}
                                                    <Button variant="outline" className="text-red-600 border-red-200 hover
                                        bg-red-50">
                                                        Cancel Appointment
                                                    </Button>
                                                    {/* reshedule Appointment button */}
                                                    <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                                                        Reschedule Appointment
                                                    </Button>

                                                </div>
                                            </CardContent>
                                        </Card>
                                    )
                                    }



                                </div>
                            </div>
                        </div>
                    )
            }
        </>


    );
};

export default Page;
