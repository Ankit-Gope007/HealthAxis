"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Calendar, Phone, Mail } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useDoctorProfileStore } from "@/src/store/useDoctorProfileStore";
import { getStatusStyle } from "@/src/lib/statusStyle";
import Image from "next/image";


const Page = () => {
    const params = useParams<{ id: string }>();
    const patientId = params?.id as string;
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [data, setData] = useState<any>([]);
    const { profile } = useDoctorProfileStore();

    // Mock patient data - in real app, fetch based on patientId

    useEffect(() => {
        if (profile && profile.id) {
            fetchData(patientId, profile.id);
        } else {
            toast.error("Doctor profile not found");
        }
    }, [profile, patientId]);

    const fetchData = async (patientId: string, doctorId: string) => {
        try {
            setLoading(true)
            const response = await axios.post(`/api/appointment/getParticularAppointments`, {
                patientId: patientId,
                doctorId: doctorId
            });
            if (response.status === 200) {
                console.log("Patient data fetched successfully:", response.data);

                const receivedData = response.data;

                // 💡 Transform the whole array FIRST
                const transformed = receivedData.map((item: any) => ({
                    id: item.id,
                    patient: {
                        id: item.patient.id,
                        email: item.patient.email,
                        patientProfile: {
                            fullName: item.patient.patientProfile.fullName,
                            dob: item.patient.patientProfile.dob,
                            gender: item.patient.patientProfile.gender,
                            phone: item.patient.patientProfile.phone,
                            address: item.patient.patientProfile.address,
                            emergencyContact: item.patient.patientProfile.emergencyContact,
                            bloodType: item.patient.patientProfile.bloodGroup
,
                            imageUrl: item.patient.patientProfile.imageUrl || null,
                        },
                    },
                    date: item.date,
                    timeSlot: item.timeSlot,
                    reason: item.reason,
                    status: item.status,
                }));

                // ✅ Now set once!
                setData(transformed);

                setLoading(false);
            } else {
                toast.error("Failed to fetch patient data");
                setLoading(false);
            }
        } catch (error) {
            console.error("Error fetching patient data:", error);
            toast.error("Failed to fetch patient data");
        }
    }

const patient = data.length > 0 ? {
  id: data[0].patient.id,
  name: data[0].patient.patientProfile.fullName,
  age: new Date().getFullYear() - new Date(data[0].patient.patientProfile.dob).getFullYear(),
  gender: data[0].patient.patientProfile.gender,
  phone: data[0].patient.patientProfile.phone,
  email: data[0].patient.email,
  address: data[0].patient.patientProfile.address,
  emergencyContact: data[0].patient.patientProfile.emergencyContact||"N/A",
  bloodType: data[0].patient.patientProfile.bloodType,
  imageUrl: data[0].patient.patientProfile.imageUrl || null,
} : null;


    const appointments = data?.map((app: any) => ({
        id: app.id,
        date: new Date(app.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }),
        time: app.timeSlot,
        reason: app.reason,
        status: app.status,
        // doctorName: `${appointment.doctor.firstName} ${appointment.doctor.lastName}`,
    })) || [];


    return (
        <>
            {
                (loading || !patient ) ?
                    (
                        <div className="w-full lg:w-[90%] lg:ml-14 h-[100vh] flex-col gap-5 center " >
                            <div className="loading-animation h-12 w-12">
                            </div>
                            <div>
                                <p className="text-muted-foreground">Loading Patient data...</p>
                            </div>
                        </div>
                    )
                    :
                    (
                        
                        <div className="w-full lg:w-[90%] lg:ml-14 h-[100vh]  " >
                            <Toaster position="top-right" />
                            <header className="mb-3 mt-4">
                                <div className="flex items-center justify-start">

                                    {/* image */}
                                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mb-2 mr-2">
                                        {patient?.imageUrl ? (
                                            <Image src={patient.imageUrl} alt={patient.name} className="h-12 w-12 rounded-full object-cover" />
                                        ) : (
                                            <User className="h-6 w-6 text-gray-500" />
                                        )}
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900 mb-1">{patient.name}</h1>
                                        <p className="text-muted-foreground">{patient.age} years • {patient.gender}</p>
                                    </div>


                                </div>
                            </header>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                                <div className="lg:col-span-1 space-y-3">
                                    <Card className="health-card py-3">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <User className="h-5 w-5 text-health-600" />
                                                Patient Information
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">Phone</label>
                                                <p className="flex items-center gap-2 mt-1">
                                                    <Phone className="h-3 w-3 text-muted-foreground" />
                                                    {patient.phone}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">Email</label>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Mail className="h-3 w-3 text-muted-foreground" />
                                                    <p className="text-[15px]">{patient.email}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">Address</label>
                                                <p className="mt-1">{patient.address}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">Emergency Contact</label>
                                                <p className="mt-1">{patient.emergencyContact}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">Blood Type</label>
                                                <p className="mt-1 font-medium text-red-600">{patient.bloodType}</p>
                                            </div>
                                        </CardContent>
                                    </Card>

                                </div>

                                <div className="lg:col-span-2 space-y-2">
                                    <Card className="health-card">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Calendar className="h-5 w-5 text-health-600" />
                                                Appointment History
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-7 overflow-y-scroll max-h-[400px]">
                                                {appointments.map((appointment: any) => (
                                                    <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50  rounded-lg ">
                                                        <div>
                                                            <p className="font-medium">{appointment.reason}</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {appointment.date} at {appointment.time}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusStyle(appointment.status)}`}>
                                                                {appointment.status}
                                                            </span>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="health-green h-5"
                                                                onClick={() => router.push(`/doctor/prescriptions/${appointment.id}`)}
                                                            >
                                                                View Details
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                        </CardContent>
                                    </Card>


                                </div>
                            </div>
                        </div>
                    )
            }
        </>

    );
};

export default Page;
