"use client"
import React, { useEffect } from 'react'
import { useSidebarStore } from '@/src/store/useSidebarStore'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Eye, Check, X, Mail} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Link from 'next/link';
import axios from 'axios';

type DoctorInfo = {
    id: string;
    email: string;
    password: string;
    role: "DOCTOR";
    profileSetup: boolean;
    createdAt: string;
    updatedAt: string;
    doctorProfile: {
        id: string;
        fullName: string;
        phone: string;
        imageUrl: string | null;
        address: string | null;
        specialization: string | null;
        experience: number | null;
        licenseNumber: string;
        licenseDocument: string;
        verified: boolean;
        consultationFee: number | null;
        createdAt: string;
        updatedAt: string;
        doctorId: string;
    };
};

const page = () => {
    const { setActiveItem } = useSidebarStore();
    const [doctorsData, setDoctorsData] = useState<DoctorInfo[]>([]);

    useEffect(() => {
        setActiveItem("Doctors");
        // Fetch doctor data when the component mounts
        handleDoctorData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleDoctorData = async () => {
        try {
            const response = await axios.get('/api/doctor/getAll');
            if (response.status === 200) {
                console.log("Doctors data fetched successfully:", response.data.doctors.data);
                setDoctorsData(response.data.doctors.data);
                console.log("Doctors data:", doctorsData);

                // You can set the fetched data to state or handle it as needed
            } else {
                console.error("Failed to fetch doctors data:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching doctors data:", error);
            toast.error("Failed to fetch doctors data", {
                duration: 3000,
                position: "top-right",
                style: {
                    background: "#DC3545",
                    color: "#fff",
                },
            });

        }
    }


    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterSpecialization, setFilterSpecialization] = useState("all");
    const [loading, setLoading] = useState(false);

    const doctors = [
        {
            id: "1",
            name: "Dr. Sarah Johnson",
            email: "sarah.johnson@email.com",
            phone: "+1 (555) 123-4567",
            specialization: "Cardiology",
            experience: 8,
            verified: true,
            licenseUrl: "/license-sample.pdf",
            joinedDate: "2024-01-15"
        },
        {
            id: "2",
            name: "Dr. Michael Chen",
            email: "michael.chen@email.com",
            phone: "+1 (555) 234-5678",
            specialization: "Neurology",
            experience: 12,
            verified: false,
            licenseUrl: "/license-sample.pdf",
            joinedDate: "2024-02-20"
        },
        {
            id: "3",
            name: "Dr. Emily Rodriguez",
            email: "emily.rodriguez@email.com",
            phone: "+1 (555) 345-6789",
            specialization: "Pediatrics",
            experience: 6,
            verified: true,
            licenseUrl: "/license-sample.pdf",
            joinedDate: "2024-01-30"
        },
        {
            id: "4",
            name: "Dr. James Wilson",
            email: "james.wilson@email.com",
            phone: "+1 (555) 456-7890",
            specialization: "Orthopedics",
            experience: 15,
            verified: false,
            licenseUrl: "/license-sample.pdf",
            joinedDate: "2024-03-10"
        }
    ];

    const specializations = [ "General Medicine", "Cardiology", "Dermatology", "Endocrinology",
        "Gastroenterology", "Neurology", "Oncology", "Orthopedics",
        "Pediatrics", "Psychiatry", "Radiology", "Surgery"];

    const filteredDoctors = doctorsData.filter(doctor => {
        const matchesSearch = doctor.doctorProfile.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === "all" ||
            (filterStatus === "verified" && doctor.doctorProfile.verified) ||
            (filterStatus === "unverified" && !doctor.doctorProfile.verified);
        const matchesSpecialization = filterSpecialization === "all" ||
            doctor.doctorProfile.specialization === filterSpecialization;

        return matchesSearch && matchesStatus && matchesSpecialization;
    });

    // const handleVerify = async (doctorId: string, doctorName: string) => {

    //     try {
    //         const confirmation = window.confirm(`Are you sure you want to verify ${doctorName}'s registration?`);
    //         if (!confirmation) return;
    //         setLoading(true);
    //         const verification = await axios.post('/api/doctor/verify', { id: doctorId });
    //         if (verification.status !== 200) {
    //             throw new Error("Verification failed");
    //         }
    //         setLoading(false);
    //         toast.success(`${doctorName} has been verified successfully`, {
    //             duration: 3000,
    //             position: "top-right",
    //             style: {
    //                 background: "#28A745",
    //                 color: "#fff",
    //             },
    //         });
    //         // Optionally, you can refresh the doctor data after verification
    //         handleDoctorData();
    //     } catch (error) {
    //         setLoading(false);
    //         console.error("Error verifying doctor:", error);
    //         toast.error(`Failed to verify ${doctorName}`, {
    //             duration: 3000,
    //             position: "top-right",
    //             style: {
    //                 background: "#DC3545",
    //                 color: "#fff",
    //             },
    //         });

    //     }

    // };



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
                                handleDoctorData();
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

    // const handleReject = async (doctorId: string, doctorName: string) => {
    //     const confirmation = window.confirm(`Are you sure you want to reject ${doctorName}'s registration?`);
    //     if (!confirmation) return;

    //     const rejection = await axios.post('/api/doctor/delete', { id: doctorId });
    //     if (rejection.status !== 200) {
    //         toast.error(`Failed to reject ${doctorName}`, {
    //             duration: 3000,
    //             position: "top-right",
    //             style: {
    //                 background: "#DC3545",
    //                 color: "#fff",
    //             },
    //         });
    //         return;
    //     }
    //     toast.success(`${doctorName} has been rejected successfully`, {
    //         duration: 3000,
    //         position: "top-right",
    //         style: {
    //             background: "#DC3545",
    //             color: "#fff",
    //         },
    //     });
    //     // Optionally, you can refresh the doctor data after rejection
    //     handleDoctorData();

    // };

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
                                handleDoctorData();
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


    const handleSendEmail = (doctorEmail: string, doctorName: string) => {
        toast.success(`Email sent to ${doctorName} (${doctorEmail})`, {
            duration: 3000,
            position: "top-right",
            style: {
                background: "#007BFF",
                color: "#fff",
            },
        });
    };


    return (
        <div className='w-full lg:w-[90%] lg:ml-14 h-[100vh] '>
            {/* Header */}
            <div className="flex justify-between items-center mt-2">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Doctors Management</h1>
                    <p className="text-muted-foreground">Manage and verify doctor registrations</p>
                </div>
            </div>
            {/* separator */}
            <div className='w-full m-0 h-[1px] bg-gray-300 mt-4 mb-4' />

            {/* Toaster for notifications */}
            <Toaster
                position="top-right"
                reverseOrder={false}
            />








            {/* Search & Filters */}
            <Card className='gap-0 py-1 mt-5'>
                <CardHeader className='pt-2'>
                    <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent className=''>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative w-full">
                            <Search className="absolute left-2 top-1 h-3 w-3 text-gray-400" />
                            <Input
                                placeholder="Search doctors..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-6 h-5 w-full text-sm"
                            />
                        </div>

                        <div className="w-full">
                            <Select value={filterStatus} onValueChange={setFilterStatus}>
                                <SelectTrigger className="w-full max-h-5 text-sm">
                                    <SelectValue placeholder="All Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="verified">Verified</SelectItem>
                                    <SelectItem value="unverified">Unverified</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="w-full mb-3">
                            <Select value={filterSpecialization} onValueChange={setFilterSpecialization}>
                                <SelectTrigger className="w-full max-h-5 text-sm">
                                    <SelectValue placeholder="All Specializations" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Specializations</SelectItem>
                                    {specializations.map((spec) => (
                                        <SelectItem key={spec} value={spec}>
                                            {spec}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>








            {/* Doctors Table */}
            <Card className='mt-5 gap-0'>
                <CardHeader>
                    <CardTitle>Doctors ({filteredDoctors.length})</CardTitle>
                </CardHeader>
                <CardContent className='pt-2'>

                {/* Table Review of Doctor */}
                    <div className="overflow-x-auto border rounded-lg">
                        <Table className="min-w-full text-xs">
                            <TableHeader>
                                <TableRow className="h-5">
                                    <TableHead className="px-2 py-1">Doctor</TableHead>
                                    <TableHead className="px-2 py-1">Contact</TableHead>
                                    <TableHead className="px-2 py-1">Specialization</TableHead>
                                    <TableHead className="px-2 py-1">Exp</TableHead>
                                    <TableHead className="px-2 py-1">Status</TableHead>
                                    <TableHead className="px-2 py-1">License</TableHead>
                                    <TableHead className="px-2 py-1">Actions</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {filteredDoctors.map((doctor) => (
                                    <TableRow key={doctor.id} className="h-5">
                                        <TableCell className="px-2 py-1">
                                            <div className="font-semibold leading-none">{doctor.doctorProfile.fullName}</div>
                                            <div className="text-[10px] text-gray-500 leading-none">
                                                {new Date(doctor.doctorProfile.createdAt).toLocaleDateString()}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-2 py-1">
                                            <div>{doctor.email}</div>
                                            <div className="text-[10px] text-gray-500">{doctor.doctorProfile.phone}</div>
                                        </TableCell>
                                        <TableCell className="px-2 py-1">{doctor.doctorProfile.specialization}</TableCell>
                                        <TableCell className="px-2 py-1">{doctor.doctorProfile.experience}y</TableCell>
                                        <TableCell className="px-2 py-1">
                                            <Badge className="text-[10px] px-1.5 py-0.5" variant={doctor.doctorProfile.verified ? "default" : "secondary"}>
                                                {doctor.doctorProfile.verified ? "Verified" : "Pending"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-2 py-1">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" size="icon" className="h-5 w-5 p-0">
                                                        <Eye className="h-3 w-3" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-xl">
                                                    <DialogHeader>
                                                        <DialogTitle className="text-sm">License - {doctor.doctorProfile.fullName}</DialogTitle>
                                                    </DialogHeader>
                                                    <div className="h-72  bg-gray-100 flex justify-center items-center text-center text-xs text-gray-500">
                                                        <iframe
                                                            src={doctor.doctorProfile.licenseDocument}
                                                            className="w-full h-full"
                                                            title="License Document"
                                                            allow ="fullscreen"
                                                        ></iframe>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </TableCell>
                                        <TableCell className="px-2 py-1">
                                            <div className="flex gap-1">
                                                <Link href={`/admin/doctors/${doctor.id}`}>
                                                    <Button variant="outline" size="icon" className="h-5 w-5 p-0">
                                                        <Eye className="h-3 w-3" />
                                                    </Button>
                                                </Link>
                                                {!doctor.doctorProfile.verified && (
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-5 w-5 p-0 text-green-600"
                                                        onClick={() => handleVerify(doctor.id, doctor.doctorProfile.fullName)}
                                                    >
                                                        <Check className="h-3 w-3" />
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-5 w-5 p-0 text-red-600"
                                                    onClick={() => handleReject(doctor.id, doctor.doctorProfile.fullName)}
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-5 w-5 p-0"
                                                    onClick={() => handleSendEmail(doctor.email, doctor.doctorProfile.fullName)}
                                                >
                                                    <Mail className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default page