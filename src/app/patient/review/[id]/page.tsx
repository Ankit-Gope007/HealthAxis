"use client";
import React from "react";
import { useState } from "react";
import { redirect, useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star,  CheckCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import axios from "axios";
import { usePatientProfileStore } from "@/src/store/usePatientProfileStore";

type AppointmentData = {
    id: string;
    doctor: {
        doctorProfile: {
            fullName: string;
            specialty: string;
            imageUrl: string;
        }
    };
    date: string;
    timeSlot: string;
    reason: string;
};

const Page = () => {
    const params = useParams<{ id: string }>()
    const id = params?.id;
    const router = useRouter();
    const { profile } = usePatientProfileStore();
    const [AppointmentData, setAppointmentData] = useState<AppointmentData | null>(null);
    const [loading, setLoading] = useState(true);


    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [review, setReview] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDocReviewed, setIsDocReviewed] = useState(false);

    useEffect(() => {
        // Fetch appointment data based on the appointment ID
        if (id && profile?.patientId) {
            checkIfDocReviewed(profile.patientId, id)
            if(!isDocReviewed) {
                fetchAppointmentData(profile.patientId, id);
            }
            else {
                redirect("/patient/dashboard");
            }
        } 
    }, [id, profile?.id, isDocReviewed, profile?.patientId]);


    // Mock appointment and doctor data - in real app, fetch based on appointment ID
    const appointmentData = {
        id: id,
        doctor: {
            id: 1,
            name: AppointmentData?.doctor?.doctorProfile?.fullName,
            specialty: AppointmentData?.doctor?.doctorProfile?.specialty,
            image: AppointmentData?.doctor?.doctorProfile?.imageUrl,
        },
        date: AppointmentData?.date
            ? new Date(AppointmentData.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
            })
            : "",
        time: AppointmentData?.timeSlot,
        reason: AppointmentData?.reason,
    };

    const handleSubmitReview = async () => {
        if (rating === 0) {
            toast.error("Please select a rating before submitting your review.");
            return;
        }
        try {
            setIsSubmitting(true)
            const response = await axios.post(`/api/review/create`, {
                patientId: profile?.patientId,
                doctorId: id,
                comment: review,
                rating: rating,
            })

            if (response.status === 200) {
                setTimeout(() => {
                    router.push("/patient/dashboard")
                }, 2000);
                toast.success(
                    <div className="text-center">
                        <p className="text-base font-medium">Thanks for reviewing our doc!</p>
                    </div>,
                    {
                        duration: 2000,
                        position: "top-center",
                        style: {
                            borderRadius: "8px",
                            background: "#28A745",
                            color: "#fff",
                            padding: "12px 20px",
                        },
                        icon: "🙏",
                    }
                );

                console.log("The review was successfully saved:", response.data)
                setIsSubmitting(false)

            }
            else {
                console.error("something went wrong")
                setIsSubmitting(false)
            }

        } catch (error) {
            console.log(error);
            toast.error("Some error occured")
            setIsSubmitting(false)
        }
    };

    const checkIfDocReviewed = async (patientId: string, doctorId: string) => {
        try {
            setLoading(true);
            const response = await axios.post(`/api/review/check`, {
                patientId: patientId,
                doctorId: doctorId
            });

            if (response.status === 200) {
                setLoading(false);
                console.log("Review status checked successfully:", response.data.hasReviewed);
                setIsDocReviewed(response.data.hasReviewed);
            } else {
                console.error("Failed to check review status:", response.statusText);
                setLoading(false);
            }
            
        } catch (error) {
            console.error("Error checking if doctor is reviewed:", error);
            toast.error("Failed to check review status. Please try again later.");
            setLoading(false);
            
        }
    }


    const fetchAppointmentData = async (patientId: string, doctorId: string) => {
        try {
            setLoading(true);
            const response = await axios.post(`/api/appointment/getParticularAppointments`, {
                patientId: patientId,
                doctorId: doctorId
            })
            if (response.status === 200) {
                setLoading(false);
                console.log("Appointment data fetched successfully:", response.data[0]);
                setAppointmentData(response.data[0]);
            }


        } catch (error) {
            setLoading(false);
            console.error("Error fetching appointment data:", error);
            toast.error("Failed to fetch appointment data. Please try again later.");

        }
    }


    return (
        <>
            {
                loading ?
                    (
                        <div>
                            <div className="flex items-center justify-center h-screen">
                                <div className="loading-animation h-16 w-16 "></div>

                            </div>
                        </div>
                    )
                    :
                    (
                        <div className="p-2 md:p-6 h-full lg:mx-10 overflow-y-auto">
                            <Toaster
                                position="top-center"
                                toastOptions={{
                                    style: {
                                        animation: 'pop 0.5s ease',
                                    },
                                }}
                            />

                            <style jsx global>{`
  @keyframes pop {
    0% {
      transform: scale(0.5);
      opacity: 0;
    }
    60% {
      transform: scale(1.1);
      opacity: 1;
    }
    100% {
      transform: scale(1);
    }
  }
`}</style>
                            {/* <div className="flex items-center gap-4 mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => router("/appointments")}
                        className="text-gray-500 hover:text-foreground"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Appointments
                    </Button>
                </div> */}

                            <header className="mb-8">
                                <h1 className="text-2xl font-bold text-gray-900 mb-1">Review Your Appointment</h1>
                                <p className="text-gray-500">Share your experience with other patients</p>
                            </header>

                            <div className=" grid grid-cols-1 md:grid-cols-2 gap-2 md:p-4 rounded-lg bg-white ">
                                {/* Appointment Details */}
                                <Card className=" w-full">
                                    <CardHeader>
                                        <CardTitle className="flex  justify-start w-full gap-2 md:text-sm">
                                            <CheckCircle className="h-3 w-3  md:h-5 md:w-5 text-green-600" />
                                            Completed Appointment
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center gap-4">
                                            <Avatar className="md:h-16 md:w-16 h-7 w-7">
                                                <AvatarImage src={appointmentData.doctor.image} />
                                                <AvatarFallback className="bg-green-100 text-green-700">
                                                    {appointmentData.doctor.name
                                                        ? appointmentData.doctor.name.split(' ').map(n => n[0]).join('')
                                                        : "Dr"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h3 className="text-lg font-semibold">{appointmentData.doctor.name}</h3>
                                                <p className="text-gray-500">{appointmentData.doctor.specialty}</p>
                                                <p className="text-sm text-gray-500">
                                                    {appointmentData.date} at {appointmentData.time}
                                                </p>
                                                <p className="text-sm text-gray-500">{appointmentData.reason}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>



                                {/* Rating Section */}
                                <Card className="w-full row-span-2">
                                    <CardHeader>
                                        <CardTitle>Rate Your Experience</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-1">
                                        <div className="text-center">
                                            <p className="text-gray-500 mb-0">How was your appointment with {appointmentData.doctor.name}?</p>
                                            <div className="flex justify-center gap-1 md:gap-2 mb-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        onClick={() => setRating(star)}
                                                        onMouseEnter={() => setHoverRating(star)}
                                                        onMouseLeave={() => setHoverRating(0)}
                                                        className="p-1 transition-colors"
                                                    >
                                                        <Star
                                                            className={`h-2 w-2 md:h-5 md:w-5 ${star <= (hoverRating || rating)
                                                                ? "fill-yellow-400 text-yellow-400"
                                                                : "text-gray-300"
                                                                }`}
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                            <p className="text-sm text-gray-500">
                                                {rating > 0 && (
                                                    <>
                                                        {rating === 1 && "Poor"}
                                                        {rating === 2 && "Fair"}
                                                        {rating === 3 && "Good"}
                                                        {rating === 4 && "Very Good"}
                                                        {rating === 5 && "Excellent"}
                                                        {" "}({rating} star{rating !== 1 ? 's' : ''})
                                                    </>
                                                )}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-1">
                                                Write a Review (Optional)
                                            </label>
                                            <Textarea
                                                placeholder="Share details about your experience, the doctor's professionalism, wait time, and overall satisfaction..."
                                                value={review}
                                                onChange={(e) => setReview(e.target.value)}
                                                rows={5}
                                                className="resize-none"
                                            />
                                            <p className="text-xs text-gray-500 mt-2">
                                                Your review will help other patients make informed decisions.
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                                            <Button
                                                onClick={handleSubmitReview}
                                                disabled={isSubmitting || rating === 0}
                                                className="health-green flex-1"
                                            >
                                                {isSubmitting ? "Submitting..." : "Submit Review"}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={handleSubmitReview}
                                                className="flex-1"
                                            >
                                                Skip Review
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>



                                {/* Privacy Notice */}
                                <Card className="bg-blue-50 border-blue-200 ">
                                    <CardContent className="p-4">
                                        <p className="text-sm text-blue-800">
                                            <strong>Privacy Notice:</strong> Your review will be posted publicly to help other patients.
                                            Please do not include sensitive medical information in your review.
                                        </p>
                                    </CardContent>
                                </Card>

                            </div>
                        </div>
                    )
            }

        </>



    );
};

export default Page;
