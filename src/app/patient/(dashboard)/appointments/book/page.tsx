"use client";
import React from "react";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Search, MapPin, Calendar as CalendarIcon, ArrowRight, CheckCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { useCallback } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useEffect } from "react";
// import { useSearchParams } from "next/navigation";
import { usePatientProfileStore } from "@/src/store/usePatientProfileStore";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from "@/components/ui/pagination";
import { parse } from 'date-fns';
// import { enUS } from 'date-fns/locale';

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
        specialization: string
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

type AppointmentType = {
    patientId: string;
    doctorId: string;
    date: Date;
    timeSlot: string;
    reason: string;
}


const Page = () => {

    const { profile } = usePatientProfileStore();
    // const searchParams = useSearchParams();
    // const preselectedDoctorId = searchParams?.get("doctorId");

    const [searchQuery, setSearchQuery] = useState("");
    // const [selectedDoctor, setSelectedDoctor] = useState<string | null>(preselectedDoctorId || null);
    const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
    const [appointmentReason, setAppointmentReason] = useState("");
    // const [isoStringForDb, setIsoStringForDb] = useState<string | null>(null);
    // const [currentStep, setCurrentStep] = useState<'select-doctor' | 'select-time' | 'confirm'>(
    //     selectedDoctor ? 'select-time' : 'select-doctor'
    // );
    const [currentStep, setCurrentStep] = useState<'select-doctor' | 'select-time' | 'confirm'>('select-doctor');
    const [doctorsData, setDoctorsData] = useState<DoctorInfo[]>([]);
    const [loading, setLoading] = useState(false);

    // pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const doctorsPerPage = 5;

    // Filter doctors based on search
    const filteredDoctors = doctorsData.filter(doctor =>
        doctor.doctorProfile.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.doctorProfile.specialization.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);

    // Slice the doctors for current Page
    const indexOfLastDoctor = currentPage * doctorsPerPage;
    const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
    const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);


    // const handleDoctorData = useCallback(async () => {
    //     try {
    //         setLoading(true);
    //         const response = await axios.get('/api/doctor/getAll');
    //         if (response.status === 200) {
    //             console.log("Doctors data fetched successfully:", response.data.doctors.data);
    //             setDoctorsData(response.data.doctors.data);
    //             // console.log("Doctors data:", doctorsData); // Note: doctorsData here might not be immediately updated due to closure, but setDoctorsData will work
    //             setLoading(false);
    //         } else {
    //             console.error("Failed to fetch doctors data:", response.statusText);
    //             toast.error("Failed to fetch doctors data", {
    //                 duration: 3000,
    //                 position: "top-right",
    //                 style: {
    //                     background: "#DC3545",
    //                     color: "#fff",
    //                 },
    //             });
    //             setLoading(false);
    //         }
    //     } catch (error) {
    //         console.error("Error fetching doctors data:", error);
    //         toast.error("Failed to fetch doctors data", {
    //             duration: 3000,
    //             position: "top-right",
    //             style: {
    //                 background: "#DC3545",
    //                 color: "#fff",
    //             },
    //         });
    //         setLoading(false);
    //     }
    // }, []);

    // useEffect(() => {
    //     // Fetch doctor data when the component mounts
    //     handleDoctorData();

    // }, [handleDoctorData]);





    // Get selected doctor details

    const handleDoctorData = useCallback(async () => {
        console.count("handleDoctorData called"); // Add this
        try {
            setLoading(true);
            const response = await axios.get('/api/doctor/getAll');
            if (response.status === 200) {
                console.log("Doctors data fetched successfully:", response.data.doctors.data);
                setDoctorsData(response.data.doctors.data);
                setLoading(false);
            } else {
                console.error("Failed to fetch doctors data:", response.statusText);
                toast.error("Failed to fetch doctors data");
                setLoading(false);
            }
        } catch (error) {
            console.error("Error fetching doctors data:", error);
            toast.error("Failed to fetch doctors data");
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        console.count("useEffect for handleDoctorData called"); // Add this
        handleDoctorData();
    }, [handleDoctorData]);




    const selectedDoctorDetails = doctorsData.find(doctor => doctor.id === selectedDoctor?.toString());

    // Mock available time slots
    const availableTimeSlots = [
        "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
        "11:00 AM", "11:30 AM", "01:30 PM", "02:00 PM",
        "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM"
    ];

    const handleTime = (time: string) => {
        setSelectedTimeSlot(time);
        // We will construct the final ISO string in handleSubmit
    }

    const handleContinue = () => {
        if (currentStep === 'select-doctor' && selectedDoctor) {
            setCurrentStep('select-time');
        } else if (currentStep === 'select-time' && selectedDate && selectedTimeSlot) {
            setCurrentStep('confirm');
        }
    };

    const handleBack = () => {
        if (currentStep === 'select-time') {
            setCurrentStep('select-doctor');
        } else if (currentStep === 'confirm') {
            setCurrentStep('select-time');
        }
    };

    // const handleSubmit = async () => {
    //     // Here you would handle the appointment booking


    //     try {

    //         const appointmentData: AppointmentType = {
    //             patientId: profile?.patientId || "",
    //             doctorId: selectedDoctor || "",
    //             date: selectedDate || new Date(),
    //             timeSlot: selectedTimeSlot || "",
    //             reason: appointmentReason || "No reason provided"
    //         };

    //         const response = await axios.post('/api/appointment/create', appointmentData);
    //         if (response.status === 201) {
    //             console.log("Appointment booked successfully:", response.data);
    //             toast.success("Appointment booked successfully!", {
    //                 duration: 3000,
    //                 position: "top-right",
    //                 style: {
    //                     background: "#28A745",
    //                     color: "#fff",
    //                 },
    //             });
    //             // Reset form or redirect as needed
    //             setSelectedDoctor(null);
    //             setSelectedDate(undefined);
    //             setSelectedTimeSlot(null);
    //             setAppointmentReason("");
    //             setCurrentStep('select-doctor');
    //         }

    //     } catch (error) {
    //         console.error("Error submitting appointment:", error);
    //         toast.error("Failed to book appointment", {
    //             duration: 3000,
    //             position: "top-right",
    //             style: {
    //                 background: "#DC3545",
    //                 color: "#fff",
    //             },
    //         });

    //     }
    // };

    const handleSubmit = async () => {
        if (!profile?.patientId || !selectedDoctor || !selectedDate || !selectedTimeSlot) {
            toast.error("Please fill all required appointment details.");
            return;
        }

        let combinedDateTimeObject: Date;

        try {
            // 1. Get the date components from selectedDate
            const year = selectedDate.getFullYear();
            const month = selectedDate.getMonth(); // 0-indexed
            const day = selectedDate.getDate();

            // 2. Parse the time slot string (e.g., "11:00 AM") into a temporary Date object
            const parsedTime = parse(selectedTimeSlot, 'hh:mm a', new Date());

            // 3. Create a NEW Date object by combining the date components with the parsed time components
            combinedDateTimeObject = new Date(
                year,
                month,
                day,
                parsedTime.getHours(),
                parsedTime.getMinutes(),
                parsedTime.getSeconds(),
                parsedTime.getMilliseconds() // Include milliseconds for full precision
            );

            // 4. Validate the constructed Date object
            if (isNaN(combinedDateTimeObject.getTime())) {
                console.error("Failed to construct a valid Date object from selectedDate and selectedTimeSlot.", {
                    selectedDate: selectedDate.toISOString(), // Log as ISO string for clarity
                    selectedTimeSlot: selectedTimeSlot,
                    parsedTimeHours: parsedTime.getHours(),
                    parsedTimeMinutes: parsedTime.getMinutes(),
                    combinedResult: combinedDateTimeObject.toString()
                });
                toast.error("Internal error: Could not generate valid appointment date.");
                return;
            }

        } catch (error) {
            console.error("Error processing date and time for appointment:", error);
            toast.error("Failed to process appointment date/time.");
            return;
        }

        try {
            const appointmentData: AppointmentType = {
                patientId: profile.patientId,
                doctorId: selectedDoctor,
                date: combinedDateTimeObject, // <-- NOW SENDING A PROPER DATE OBJECT
                timeSlot: selectedTimeSlot,
                reason: appointmentReason || "No reason provided"
            };

            const response = await axios.post('/api/appointment/create', appointmentData);
            if (response.status === 201) {
                console.log("Appointment booked successfully:", response.data);
                toast.success("Appointment booked successfully!", {
                    duration: 3000,
                    position: "top-right",
                    style: {
                        background: "#28A745",
                        color: "#fff",
                    },
                });
                // Reset form or redirect as needed
                setSelectedDoctor(null);
                setSelectedDate(undefined);
                setSelectedTimeSlot(null);
                setAppointmentReason("");
                setCurrentStep('select-doctor');
            }

        } catch (error) {
            console.error("Error submitting appointment:", error);
            toast.error("Failed to book appointment", {
                duration: 3000,
                position: "top-right",
                style: {
                    background: "#DC3545",
                    color: "#fff",
                },
            });

        }
    }


    return (

        <>
            {
                loading ?
                    (
                        <div className="flex items-center justify-center h-screen">
                            <div className="loading-animation h-16 w-16 "></div>
                        </div>
                    ) :
                    (
                        <div className='w-full lg:w-[90%] lg:ml-14 h-[100vh]'>
                            <Toaster />
                            <header className="mb-6 mt-2">
                                <h1 className="text-xl md:text-2xl font-bold text-gray-900">Book an Appointment</h1>
                                <div className="flex flex-wrap items-center text-sm text-gray-500 mt-2">
                                    {["select-doctor", "select-time", "confirm"].map((step, i) => (
                                        <div className="flex items-center" key={step}>
                                            <div
                                                className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-semibold ${currentStep === step
                                                    ? "bg-[#28A745] text-white"
                                                    : "bg-[#DFF5E1] text-[#166534]"
                                                    }`}
                                            >
                                                {i + 1}
                                            </div>
                                            <span className="ml-2 capitalize hidden sm:inline">
                                                {step.replace("-", " ")}
                                            </span>
                                            {i < 2 && <div className="h-0.5 w-4 bg-gray-200 mx-2"></div>}
                                        </div>
                                    ))}
                                </div>
                            </header>

                            {/* Steps */}
                            <div className="space-y-3">
                                {/* Step 1 */}
                                {currentStep === 'select-doctor' && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-base font-semibold">Find a Doctor</CardTitle>
                                            <CardDescription>Select a healthcare provider</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="relative mb-4">
                                                <Search className="absolute left-3 top-1 h-3 w-3 text-muted-foreground" />
                                                <Input
                                                    placeholder="Search by name or specialty"
                                                    className="pl-10 h-5 text-sm"
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                />
                                            </div>
                                            {currentDoctors.length > 0 ? (
                                                <RadioGroup value={selectedDoctor?.toString() || ""}
                                                    onValueChange={(value) => setSelectedDoctor(value)}
                                                    className="space-y-4"
                                                >
                                                    <div className="space-y-3">

                                                        {currentDoctors.map((doctor) => (

                                                            <div key={doctor.id} className={`rounded-md border px-4 py-3 flex items-center gap-4 ${selectedDoctor === doctor.id ? 'botext-[#166534] bg-[#F0FFF5]' : 'border-gray-200 hover:border-gray-300'}`}>
                                                                <RadioGroupItem
                                                                    value={doctor.id.toString()}
                                                                    id={`doctor-${doctor.id}`}
                                                                    className="h-3 w-3 mt-1"
                                                                />
                                                                <Label htmlFor={`doctor-${doctor.id}`} className="flex flex-col md:flex-row md:items-center w-full cursor-pointer pl-2">
                                                                    <Avatar className="h-10 w-10 mr-3">
                                                                        <AvatarImage src={doctor.doctorProfile.imageUrl || ""} />
                                                                        <AvatarFallback className="bg-[#DFF5E1] text-[#166534]">{doctor.doctorProfile.fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                                                    </Avatar>
                                                                    <div className="flex-1">
                                                                        <div className="text-sm font-medium">{doctor.doctorProfile.fullName}</div>
                                                                        <div className="text-xs text-muted-foreground">{doctor.doctorProfile.specialization}</div>
                                                                    </div>
                                                                    <div className="flex items-center text-xs text-muted-foreground">
                                                                        <MapPin className="h-3 w-3 mr-1" />{doctor.doctorProfile.address || "No address provided"}
                                                                    </div>
                                                                </Label>
                                                            </div>
                                                        ))}

                                                    </div>
                                                </RadioGroup>

                                            ) : (
                                                <p className="text-center text-sm py-6">No doctors found.</p>
                                            )}
                                            <Pagination>
                                                <PaginationContent className="mt-2 h-5 ">
                                                    <PaginationItem>
                                                        <PaginationPrevious
                                                            href="#"
                                                            onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                                                            aria-disabled={currentPage === 1}
                                                            className="h-5 w-fit"
                                                        />
                                                    </PaginationItem>

                                                    {Array.from({ length: totalPages }).map((_, index) => (
                                                        <PaginationItem

                                                            key={index}>
                                                            <PaginationLink
                                                                href="#"
                                                                isActive={currentPage === index + 1}
                                                                onClick={() => setCurrentPage(index + 1)}
                                                                className="h-5 w-5"
                                                            >
                                                                {index + 1}
                                                            </PaginationLink>
                                                        </PaginationItem>
                                                    ))}

                                                    {totalPages > 5 && (
                                                        <PaginationItem>
                                                            <PaginationEllipsis />
                                                        </PaginationItem>
                                                    )}

                                                    <PaginationItem>
                                                        <PaginationNext
                                                            href="#"
                                                            onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                                                            aria-disabled={currentPage === totalPages}
                                                            className="h-5 w-fit"
                                                        />
                                                    </PaginationItem>
                                                </PaginationContent>
                                            </Pagination>

                                        </CardContent>
                                        <CardFooter className="flex justify-end">
                                            <Button size="sm" className="bg-[#28A745] h-5 hover:bg-[#218838] text-white" onClick={handleContinue} disabled={!selectedDoctor}>
                                                Continue <ArrowRight className="ml-2 h-3 w-3" />
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                )}

                                {/* Step 2 */}
                                {currentStep === 'select-time' && selectedDoctorDetails && (

                                    <Card className="p-0">
                                        <CardHeader className="pt-2">
                                            <div className="flex items-center">
                                                <Avatar className="h-8 w-8 mr-2">
                                                    <AvatarImage src={selectedDoctorDetails.doctorProfile.imageUrl || ""} />
                                                    <AvatarFallback className="bg-[#DFF5E1] text-[#166534]">
                                                        {selectedDoctorDetails.doctorProfile.fullName
                                                            .split(" ")
                                                            .map((n) => n[0])
                                                            .join("")}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <CardTitle className="text-sm leading-tight">
                                                        {selectedDoctorDetails.doctorProfile.fullName}
                                                    </CardTitle>
                                                    <CardDescription className="text-xs text-muted-foreground">
                                                        {selectedDoctorDetails.doctorProfile.specialization}
                                                    </CardDescription>
                                                </div>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="flex flex-col gap-4 p-4 pt-0">
                                            <div className="flex flex-col md:flex-row md:gap-6 gap-4">
                                                <div className="w-fit">
                                                    <h3 className="text-xs font-semibold mb-2">Select Date</h3>
                                                    <div className="scale-90 origin-top-left rounded ">
                                                        <Calendar
                                                            mode="single"
                                                            selected={selectedDate}
                                                            onSelect={setSelectedDate}
                                                            className="rounded border"

                                                            disabled={(date) => {
                                                                const today = new Date();
                                                                today.setHours(0, 0, 0, 0); // zero time for today
                                                                const compareDate = new Date(date);
                                                                compareDate.setHours(0, 0, 0, 0); // zero time for the date too

                                                                return compareDate < today || compareDate.getDay() === 0 || compareDate.getDay() === 6;
                                                            }}
                                                            classNames={{
                                                                table: "w-full text-xs",
                                                                cell: "w-8 h-8 text-xs",
                                                                head_row: "text-xs",
                                                                row: "text-xs",
                                                                day_selected: "bg-[#28A745] text-white hover:bg-[#218838]"
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex-1">
                                                    <h3 className="text-xs font-medium mb-2">
                                                        {selectedDate
                                                            ? `Available Time (${format(selectedDate, "MMM d")})`
                                                            : "Select a Date First"}
                                                    </h3>
                                                    {selectedDate ? (
                                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                                            {availableTimeSlots.map((time) => (
                                                                <Button
                                                                    key={time}
                                                                    size="sm"
                                                                    variant={selectedTimeSlot === time ? "default" : "outline"}
                                                                    className={
                                                                        selectedTimeSlot === time
                                                                            ? "bg-[#28A745] hover:bg-[#218838] text-white"
                                                                            : ""
                                                                    }
                                                                    onClick={() => handleTime(time)}
                                                                >
                                                                    {time}
                                                                </Button>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="p-3 text-center text-xs text-muted-foreground border rounded bg-gray-50">
                                                            <CalendarIcon className="h-4 w-4 mx-auto mb-1" /> Select a date first
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-1">
                                                <Label htmlFor="reason" className="text-xs font-medium">
                                                    Reason for Visit
                                                </Label>
                                                <Textarea
                                                    id="reason"
                                                    placeholder="Brief reason..."
                                                    className="h-20 text-xs"
                                                    value={appointmentReason}
                                                    onChange={(e) => setAppointmentReason(e.target.value)}
                                                />
                                            </div>
                                        </CardContent>

                                        <CardFooter className="flex justify-between px-4 py-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={handleBack}
                                                className="text-xs"
                                            >
                                                Back
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="bg-[#28A745] hover:bg-[#218838] text-white text-xs"
                                                onClick={handleContinue}
                                                disabled={!selectedDate || !selectedTimeSlot}
                                            >
                                                Continue <ArrowRight className="ml-2 h-3 w-3" />
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                )}

                                {/* Step 3 */}
                                {currentStep === 'confirm' && selectedDoctorDetails && selectedDate && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-base font-semibold">Confirm Appointment</CardTitle>
                                            <CardDescription className="text-sm">Review your details</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage src={selectedDoctorDetails.doctorProfile.imageUrl || ""} />
                                                    <AvatarFallback>{selectedDoctorDetails.doctorProfile.fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium text-sm">{selectedDoctorDetails.doctorProfile.fullName}</p>
                                                    <p className="text-xs text-muted-foreground">{selectedDoctorDetails.doctorProfile.specialization}</p>
                                                </div>
                                            </div>

                                            <Separator />

                                            <div className="text-sm space-y-2">
                                                <div className="flex justify-between"><span>Date:</span><span>{format(selectedDate, 'PPP')}</span></div>
                                                <div className="flex justify-between"><span>Time:</span><span>{selectedTimeSlot}</span></div>
                                                <div className="flex justify-between"><span>Location:</span><span>{selectedDoctorDetails.doctorProfile.address}</span></div>
                                            </div>

                                            {appointmentReason && (
                                                <div className="pt-3">
                                                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Reason</h4>
                                                    <p className="text-sm">{appointmentReason} </p>
                                                </div>
                                            )}

                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3 text-sm text-blue-800">
                                                <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                                                Appointment request will be sent to the doctor. You’ll get confirmation via email.
                                            </div>
                                        </CardContent>
                                        <CardFooter className="flex justify-between">
                                            <Button size="sm" variant="outline" onClick={handleBack}>Back</Button>
                                            <Button size="sm" className="bg-[#28A745] hover:bg-[#218838] text-white" onClick={handleSubmit}>
                                                Confirm
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                )}

                                {/* View all doctors */}
                                <div className="text-center pt-4">
                                    <Link href="/" className="text-[#28A745] hover:text-[#166534] text-sm inline-flex items-center">
                                        View all doctors <ArrowRight className="ml-1 h-3 w-3" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )
            }
        </>



    );
};

export default Page;
