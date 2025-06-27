"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Check, X, Mail, FileText, Calendar, Phone, MapPin } from "lucide-react";
import toast, { Toaster } from 'react-hot-toast';
import { useParams } from "next/navigation";
import axios from "axios";
import { set } from "mongoose";

type Doctor = {
    id: string;
    name: string;
    email: string;
    phone: string;
    specialization: string;
    experience: number;
    verified: boolean;
    clinicAddress?: string;
    licenseNumber: string;
    licenseUrl: string;
    createdAt: string;
};


const AdminDoctorDetails = () => {
    const { id } = useParams();
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        doctorsData();
    }
        , [id]);

    const doctorsData = async () => {
        try {
            console.log("Fetching doctor data for ID:", id);
            const response = await axios.get(`/api/doctor/getById?id=${id}`);
            console.log("Response Status:", response.status);
            if (response.status === 200) {
                const doctor = response.data.data;
                const doctorProfile = doctor.doctorProfile;
                console.log("Doctor Data:", doctor);
                setDoctor({
                    id: doctor.id,
                    name: doctorProfile.fullName,
                    email: doctor.email,
                    phone: doctorProfile.phone,
                    specialization: doctorProfile.specialization,
                    experience: doctorProfile.experience,
                    verified: doctorProfile.verified,
                    clinicAddress: doctorProfile.address,
                    licenseNumber: doctorProfile.licenseNumber,
                    licenseUrl: doctorProfile.licenseDocument,
                    createdAt: doctor.createdAt,

                });
            } else {
                console.error("Failed to fetch doctor data");
            }

        } catch (error) {
            console.error("Error fetching doctor data:", error);

        }
    }




    const appointments = [
        {
            id: "1",
            patientName: "John Doe",
            date: "2024-03-20",
            time: "10:00 AM",
            status: "Completed",
            type: "Regular Checkup"
        },
        {
            id: "2",
            patientName: "Jane Smith",
            date: "2024-03-21",
            time: "2:30 PM",
            status: "Scheduled",
            type: "Follow-up"
        },
        {
            id: "3",
            patientName: "Mike Johnson",
            date: "2024-03-22",
            time: "11:15 AM",
            status: "Scheduled",
            type: "Consultation"
        }
    ];

    const handleVerify = async (doctorId: string, doctorName: string) => {
        toast((t) => (
            <div className="text-sm p-3">
                <p className="font-semibold">🩺 Verify Dr. {doctorName}?</p>
                <p className="text-xs text-gray-600 mt-1">
                    This will notify the doctor and activate their access.
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
                                setLoading(true);
                                const verification = await axios.post("/api/doctor/verify", { id: doctorId });
                                if (verification.status !== 200) {
                                    throw new Error("Verification failed");
                                }
                                setLoading(false);
                                toast.success(`✅ Dr. ${doctorName} has been verified`, {
                                    duration: 3000,
                                    position: "top-right",
                                    style: {
                                        background: "#28A745",
                                        color: "#fff",
                                    },
                                });
                                
                            } catch (error) {
                                setLoading(false);
                                toast.error(`❌ Failed to verify Dr. ${doctorName}`, {
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

    const handleReject = async (doctorId: string, doctorName: string) => {
        toast((t) => (
            <div className="text-sm p-3">
                <p className="font-semibold text-red-600">⚠️ Reject Dr. {doctorName}?</p>
                <p className="text-xs text-gray-600 mt-1">
                    This will permanently remove their profile from the system.
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
                                const rejection = await axios.post("/api/doctor/delete", { doctorId: doctorId });
                                if (rejection.status !== 200) {
                                    throw new Error("Rejection failed");
                                }
                                toast.success(`🗑️ Dr. ${doctorName} has been rejected`, {
                                    duration: 3000,
                                    position: "top-right",
                                    style: {
                                        background: "#DC3545",
                                        color: "#fff",
                                    },
                                });

                            } catch (error) {
                                toast.error(`❌ Failed to reject Dr. ${doctorName}`, {
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
    const handleSendEmail = () => {
        toast(`Email sent to ${doctor?.email}`, {
            duration: 3000,
            position: "top-right",
            icon: <Mail className="h-4 w-4" />,
            style: {
                backgroundColor: "#007bff",
                color: "#fff",
            },
        })
    };

    return (

        <div className='w-full lg:w-[90%] lg:ml-14 h-[100vh] '>
            {/* Header */}
            <Toaster />
            <div className="flex justify-between items-start">
                <div className="m-2">
                    <h1 className="text-3xl font-bold text-gray-900">{doctor?.name}</h1>
                    <p className="text-muted-foreground">Doctor Details & Management</p>
                </div>
                <div className="flex flex-col md:flex-row mb-2 md:mb-0  mt-2 space-y-2  space-x-2">
                    {!doctor?.verified && (
                        <Button 
                            onClick={() => handleVerify(doctor?.id || "", doctor?.name || "")}
                        className="bg-green-600 h-5 w-full  md:w-auto hover:bg-green-700">
                            <Check className="h-4 w-4 mr-1" />
                            Verify Doctor
                        </Button>
                    )}
                    <Button variant="outline" className="h-5" onClick={handleSendEmail}>
                        <Mail className="h-4 w-4 mr-1" />
                        Send Email
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Doctor Information */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info */}
                    <Card className="gap-3">
                        <CardHeader className="">
                            <CardTitle className="flex items-center justify-between">
                                Doctor Information
                                <Badge variant={doctor?.verified ? "default" : "secondary"}>
                                    {doctor?.verified ? "Verified" : "Pending Verification"}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 ">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                                    <p className="text-sm">{doctor?.name}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                                    <p className="text-sm">{doctor?.email}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Phone</label>
                                    <p className="text-sm">{doctor?.phone}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Specialization</label>
                                    <p className="text-sm">{doctor?.specialization}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Experience</label>
                                    <p className="text-sm">{doctor?.experience} years</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">License Number</label>
                                    <p className="text-sm">{doctor?.licenseNumber}</p>
                                </div>
                            </div>

                            {/* <div>
                  <label className="text-sm font-medium text-muted-foreground">Address</label>
                  <p className="text-sm">{doctor.address}</p>
                </div> */}

                            {/* <div>
                  <label className="text-sm font-medium text-muted-foreground">Education</label>
                  <p className="text-sm">{doctor.education}</p>
                </div> */}

                            {/* <div>
                  <label className="text-sm font-medium text-muted-foreground">Certifications</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                   
                    <Badge
                    >
                        {doctor?.licen}
                    </Badge>
                
                  </div>
                </div> */}

                            {/* <div>
                  <label className="text-sm font-medium text-muted-foreground">Bio</label>
                  <p className="text-sm">{doctor.bio}</p>
                </div> */}
                        </CardContent>
                    </Card>

                    {/* Appointments */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Appointments</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Patient</TableHead>
                                        <TableHead>Date & Time</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {appointments.map((appointment) => (
                                        <TableRow key={appointment.id}>
                                            <TableCell className="font-medium">{appointment.patientName}</TableCell>
                                            <TableCell>
                                                <div>
                                                    <div>{appointment.date}</div>
                                                    <div className="text-sm text-muted-foreground">{appointment.time}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{appointment.type}</TableCell>
                                            <TableCell>
                                                <Badge variant={
                                                    appointment.status === "Completed" ? "default" :
                                                        appointment.status === "Scheduled" ? "secondary" : "outline"
                                                }>
                                                    {appointment.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                {/* License & Actions */}
                <div className="space-y-2">
                    {/* License Document */}
                    <Card className="px-0 gap-2">
                        <CardHeader>
                            <CardTitle>License Document</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="w-full h-5">
                                        <FileText className="h-3 w-3 mr-2" />
                                        View License
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl p-6">
                                    <DialogHeader>
                                        <DialogTitle className="text-lg font-semibold">
                                            License Document - {doctor?.name}
                                            <span className="text-sm text-muted-foreground ml-2">
                                                {doctor?.licenseNumber}
                                            </span>
                                        </DialogTitle>
                                    </DialogHeader>



                                    <div className="w-full rounded-lg overflow-hidden border border-gray-300 shadow-sm">
                                        <iframe
                                            src={doctor?.licenseUrl}
                                            title="License Document"
                                            className="w-full h-[500px] rounded-md"
                                            style={{ border: "none" }}
                                        ></iframe>
                                    </div>

                                </DialogContent>
                            </Dialog>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card className="px-0 gap-2">
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {!doctor?.verified && (
                                <Button
                                 onClick={() => handleVerify(doctor?.id || "", doctor?.name || "")}
                                 className="w-full bg-green-600 hover:bg-green-700 h-5">
                                    <Check className="h-4 w-4 mr-2" />
                                    Approve & Verify
                                </Button>
                            )}

                            <Button variant="outline"
                                onClick={() => handleReject(doctor?.id || "", doctor?.name || "")}
                                className="w-full text-red-600 hover:text-red-700 h-5">
                                <X className="h-4 w-4 mr-2" />
                                Reject Application
                            </Button>

                            <Button variant="outline" onClick={handleSendEmail} className="w-full h-5">
                                <Mail className="h-4 w-4 mr-2" />
                                Send Email
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Statistics */}
                    <Card className="mt-4">
                        <CardHeader>
                            <CardTitle>Statistics</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Total Appointments</span>
                                <span className="text-sm font-medium">48</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">This Month</span>
                                <span className="text-sm font-medium">12</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Patient Rating</span>
                                <span className="text-sm font-medium">4.8/5.0</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Joined</span>
                                <span className="text-sm font-medium"> {new Date(doctor?.createdAt || "").toLocaleDateString()}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>

    );
};

export default AdminDoctorDetails;
