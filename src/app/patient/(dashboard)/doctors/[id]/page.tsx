"use client";
import React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
    Star,
    MapPin,
    Phone,
    Mail,
    Calendar,
    ArrowLeft,
    Award,
    BookOpen,
    Users
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

type DoctorInfo = {
    id: string;
    email: string;
    doctorProfile: {
        fullName: string;
        specialization: string;
        rating: number;
        totalReviews: number;
        location: string;
        address: string;
        phone: string;
        email: string;
        availability: string;
        experience: string;
        education: string;
        certifications: string;
        languages: string;
        consultationFee: number;
        imageUrl: string;
        bio: string;
        reviews?: {
            id: number;
            patientName: string;
            patinetImage?: string;
            rating: number;
            date: string;
            review: string;
        }[];
    }
};


const page = () => {
    const params = useParams<{ id: string }>();
    const id = params?.id;
    const [loading, setLoading] = useState(false);
    const [doctorData, setDoctorData] = useState<DoctorInfo | null>(null)

    useEffect(() => {
        if (id) {
            console.log("Fetching doctor data for ID:", id);
            setLoading(true);
            fetchDoctorData(id);
            fetchReviews(id);
        } else {
            setLoading(false);
            toast.error("Doctor ID is missing.");
        }
    }, [id]);


    const fetchDoctorData = async (doctorId: string) => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/doctor/getById?doctorId=${doctorId}`);
            if (response.status === 200) {
                console.log("Doctor data fetched successfully:", response.data);
                setDoctorData(response.data.data);
                setLoading(false);
            } else {
                setLoading(false);
                toast.error("Failed to load doctor details. Please try again later.");
            }

        } catch (error) {
            console.error("Error fetching doctor data:", error);
            setLoading(false);
            toast.error("Failed to load doctor details. Please try again later.");
        }
    }

    const fetchReviews = async (doctorId: string) => {
        try {
            const response = await axios.get(`/api/review/get?doctorId=${doctorId}`);
            if (response.status === 200) {
                console.log("Reviews fetched successfully:", response.data);
                // Assuming the reviews are part of the doctorData structure
                setDoctorData(prevData => {
                    if (!prevData) return prevData;
                    return {
                        ...prevData,
                        doctorProfile: {
                            ...prevData.doctorProfile,
                            reviews: response.data.map((review: any) => ({
                                id: review.id,
                                patientName: review.patient.patientProfile?.fullName || "Anonymous",
                                patinetImage: review.patient.patientProfile?.imageUrl || "https://via.placeholder.com/50",
                                rating: review.rating,
                                date: new Date(review.createdAt).toLocaleDateString(),
                                review: review.comment
                            }))
                        }
                    };
                });
                // reload the page to reflect the new reviews
                


            }
             else {
                toast.error("Failed to load reviews. Please try again later.");
            }

        } catch (error) {
            console.error("Error fetching reviews:", error);

        }
    }

    // Mock doctor data with reviews
    const doctor = {
        id: id || "1",
        name: doctorData?.doctorProfile?.fullName || "N/A",
        specialty: doctorData?.doctorProfile?.specialization || "Cardiologist",
        rating: doctorData?.doctorProfile?.rating || 4.8,
        totalReviews: doctorData?.doctorProfile?.totalReviews || 120,
        location: doctorData?.doctorProfile?.location || "New York, NY",
        address: doctorData?.doctorProfile?.address || "123 Health St, New York, NY 10001",
        phone: doctorData?.doctorProfile?.phone || "N/A",
        email: doctorData?.email || "N/A",
        availability: "Available Today",
        experience: doctorData?.doctorProfile?.experience || "N/A",
        education: Array.from(doctorData?.doctorProfile?.education?.split(",") || []).map(edu => edu.trim()) || "N/A",
        certifications:doctorData?.doctorProfile?.certifications? Array.from(doctorData?.doctorProfile?.certifications.split(",") || []).map(cert => cert.trim()): ["N/A"],
        languages: Array.from(doctorData?.doctorProfile?.languages?.split(",") || []).map(lang => lang.trim())|| "N/A",
        consultationFee: doctorData?.doctorProfile?.consultationFee || 100,
        image: doctorData?.doctorProfile?.imageUrl || "https://via.placeholder.com/150",
        bio: doctorData?.doctorProfile?.bio || "N/A",
        reviews: Array.from(doctorData?.doctorProfile?.reviews || []),
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`h-4 w-4 ${i < Math.floor(rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : i < rating
                        ? "fill-yellow-200 text-yellow-400"
                        : "text-gray-300"
                    }`}
            />
        ));
    };

    const getRatingDistribution = () => {
        const distribution: Record<number, number> = {
            5: 0,
            4: 0,
            3: 0,
            2: 0,
            1: 0,
        };

        if (!doctor.reviews || doctor.reviews.length === 0) {
            return distribution;
        }

        doctor.reviews.forEach(review => {
            if (review.rating >= 1 && review.rating <= 5) {
                distribution[review.rating]++;
            }
        });

        return distribution;
    };

    const totalReviews = doctorData?.doctorProfile?.reviews?.length || 0;

    const avgRating = totalReviews ?
        (doctorData?.doctorProfile?.reviews?.reduce((sum, review) => sum + review.rating, 0) || 0) / totalReviews
        : 0;

    const ratingDistribution = getRatingDistribution();

    return (
        <>

            {
                loading ?
                    (

                        <div className='w-full lg:w-[90%] lg:ml-14 h-[100vh] center flex-col gap-2'>
                            <div className="loading-animation h-15 w-15"></div>
                            <div className="ml-4 text-xl mt-2 text-gray-500">Loading doctor details...</div>
                        </div>

                    )
                    :
                    (
                        <div className='w-full lg:w-[90%] lg:ml-14 h-[100vh] bg-[#F9FAFC] '>
                            <Toaster position="top-right" reverseOrder={false} />


                            <div className="flex items-center gap-4 mb-3">
                                <Button
                                    variant="ghost"
                                    asChild
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    <Link href="/patient/doctors">
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        Back to Doctors
                                    </Link>
                                </Button>
                            </div>

                            <div className="grid grid-cols-1  lg:grid-cols-3 gap-4">
                                {/* Doctor Info */}
                                <div className=" lg:col-span-2 space-y-6 ">
                                    <Card className=" py-2 mb-1">
                                        <CardContent className="p-4">

                                            <div className="flex flex-col md:flex-row gap-6">
                                                <Avatar className="h-22 w-22 mx-auto md:mx-0">
                                                    <AvatarImage src={doctor.image} />
                                                    <AvatarFallback className="bg-green-100 text-green-700 text-2xl">
                                                        {doctor.name.split(' ').map(n => n[0]).join('')}
                                                    </AvatarFallback>
                                                </Avatar>

                                                <div className="flex-1 text-center md:text-left">
                                                    <h1 className="text-2xl font-bold mb-2">{doctor.name}</h1>
                                                    <p className="text-lg text-muted-foreground mb-3">{doctor.specialty}</p>

                                                    <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                                                        <div className="flex items-center gap-1">
                                                            {renderStars(avgRating)}
                                                        </div>
                                                        <span className="font-semibold">{avgRating}</span>
                                                        <span className="text-muted-foreground">({totalReviews} reviews)</span>
                                                    </div>

                                                    <div className="flex flex-col md:flex-row gap-2 mb-4">
                                                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                                                            {doctor.experience} years experience
                                                        </Badge>

                                                    </div>

                                                    <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground mb-4">
                                                        <div className="flex  items-center gap-1">
                                                            <MapPin className="h-3 w-3" />
                                                            {doctor.location}
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Users className="h-3 w-3" />
                                                            {totalReviews} patients
                                                        </div>
                                                    </div>

                                                    <p className="text-muted-foreground text-sm">{doctor.bio}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Tabs for detailed information */}
                                    <Tabs defaultValue="about" className="w-full h-5 mt-2">
                                        <TabsList className="grid w-full grid-cols-2">
                                            <TabsTrigger value="about">About</TabsTrigger>
                                            <TabsTrigger value="reviews">Reviews</TabsTrigger>

                                        </TabsList>
                                        <div>
                                        <TabsContent value="about" className="space-y-2">
                                            <Card className="py-4">
                                                <CardHeader className="mb-0">
                                                    <CardTitle className="flex items-center gap-2">
                                                        <BookOpen className="h-5 w-5 text-green-600" />
                                                        Education & Certifications
                                                    </CardTitle>
                                                    <Separator className="my-0" />
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    <div>
                                                        <h4 className="font-medium mb-2">Education</h4>
                                                        <p className="text-muted-foreground">
                                                            {
                                                                doctor.education.length > 1 ?
                                                                    doctor.education.map((edu, index) => (
                                                                        // bullet points for each education entry
                                                                        <span key={index} className="block">
                                                                            <span className="text-green-600">•</span> {edu}
                                                                        </span>
                                                                    )) :
                                                                    doctor.education

                                                            }
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium mb-2">Certifications</h4>
                                                        <div className="space-y-1">
                                                            {doctor.certifications.map((cert, index) => (
                                                                <div key={index} className="flex items-center gap-2">
                                                                    <Award className="h-4 w-4 text-green-600" />
                                                                    <span className="text-muted-foreground">{cert}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        {
                                                            doctor.languages.length > 0 &&
                                                            <>
                                                                <h4 className="font-medium mb-2">Languages</h4>
                                                                <div className="flex gap-2">
                                                                    {doctor.languages.map((lang, index) => (
                                                                        <Badge key={index} variant="outline">{lang}</Badge>
                                                                    ))}
                                                                </div>
                                                            </>
                                                        }
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </TabsContent>

                                        <TabsContent value="reviews" className="space-y-4">
                                            <Card className="">
                                                <CardHeader>
                                                    <CardTitle>Patient Reviews</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    {/* Rating Summary */}
                                                    <div className="flex items-center gap-8 mb-6 p-4 bg-gray-50 rounded-lg">
                                                        <div className="text-center">
                                                            <div className="text-3xl font-bold text-green-600">{avgRating}</div>
                                                            <div className="flex items-center gap-1 mb-1">
                                                                {renderStars(avgRating)}
                                                            </div>
                                                            <div className="text-sm text-muted-foreground">{totalReviews} reviews</div>
                                                        </div>
                                                        <div className="flex-1">
                                                            {Object.entries(ratingDistribution).reverse().map(([rating, count]) => (
                                                                <div key={rating} className="flex items-center gap-2 mb-1">
                                                                    <span className="text-sm w-6">{rating}★</span>
                                                                    <div className="flex-1 bg-gray-200 h-2 rounded-full">
                                                                        <div
                                                                            className="bg-yellow-400 h-2 rounded-full"
                                                                            style={{ width: `${(count / doctor.reviews.length) * 100}%` }}
                                                                        />
                                                                    </div>
                                                                    <span className="text-sm text-muted-foreground w-8">{count}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Individual Reviews */}
                                                    <div className="space-y-4">
                                                        {doctor.reviews.map((review) => (
                                                            <div key={review.id} className="border-b pb-4 last:border-b-0">
                                                                <div className="flex items-start justify-between mb-2">
                                                                    <div>
                                                                        <div className="flex items-center gap-2 mb-1">
                                                                            <span className="font-medium">{review.patientName}</span>
                                                                            <div className="flex items-center gap-1">
                                                                                {renderStars(review.rating)}
                                                                            </div>
                                                                        </div>
                                                                        <span className="text-sm text-muted-foreground">{review.date}</span>
                                                                    </div>
                                                                </div>
                                                                <p className="text-muted-foreground">{review.review}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </TabsContent>
                                        </div>


                                    </Tabs>
                                </div>

                                {/* Sidebar */}
                                <div className="space-y-3 relative">
                                    {/* Contact Info */}
                                    <Card className="">
                                        <CardHeader>
                                            <CardTitle>Contact Information</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <Phone className="h-3 w-3 text-muted-foreground" />
                                                <span>{doctor.phone}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Mail className="h-3 w-3 text-muted-foreground" />
                                                <span className="text-xs">{doctor.email}</span>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                                                <span className="text-sm">{doctor.address}</span>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Consultation Fee */}
                                    <Card className="py-3">
                                        <CardContent>
                                            <CardTitle className="mb-2">Consultation Fee</CardTitle>
                                            <div className="text-2xl font-bold text-green-600 mb-2">
                                                ₹{doctor.consultationFee}
                                            </div>
                                            <p className="text-sm text-muted-foreground">Per consultation</p>
                                        </CardContent>
                                    </Card>

                                    {/* Book Appointment */}
                                    <Card className="py-4">
                                        <CardContent className="px-4 ">
                                            <Button asChild className="w-full health-green h-5 flex center gap-1">
                                                <Link href={`/patient/appointments/book/${doctor.id}`}>
                                                    <Calendar className="py-1" />
                                                    Book Appointment
                                                </Link>
                                            </Button>
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

export default page;