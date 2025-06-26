"use client";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, MapPin } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useDoctorProfileStore } from "@/src/store/useDoctorProfileStore";
import { get } from "http";

type DoctorProfile = {
  id: string;
  fullName: string;
  specialization: string;
  licenseNumber: string;
  email: string;
  phone: string;
  imageUrl?: string;
  clinicAddress?: string;
  address?: string;
  dob: string;
  experience?: number; // in years
  consultationFee?: number;
}

const Page = () => {
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {

    getCurrentDoctorData();

  }, [])

  const getCurrentDoctorData = async () => {
    try {
      const response = await axios.get("/api/doctor/getByToken");

      if (response.status === 200) {
        const doctor = response.data.data;
        const docProf = doctor.doctorProfile;

        setDoctorProfile(
          {
            id: doctor.id,
            fullName: docProf.fullName,
            specialization: docProf.specialization,
            licenseNumber: docProf.licenseNumber,
            email: doctor.email,
            phone: docProf.phone,
            imageUrl: docProf.imageUrl,
            clinicAddress: docProf.clinicAddress,
            address: docProf.address,
            dob: docProf.dob,
            experience: docProf.experience,
            consultationFee: docProf.consultationFee
          }
        );
        console.log("Doctor Profile:", docProf);
        console.log("Doctor :", doctor);

        // console.log("Doctor Profile:", data);
      } else {
        toast.error("Failed to fetch doctor data");
      }

    } catch (error) {
      console.error("Error fetching doctor data:", error);
      toast.error("Failed to fetch doctor data");

    }
  }


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return; // prevent double submission

    const form = e.currentTarget;
    const clinicAddress = (form.elements.namedItem("clinicAddress") as HTMLInputElement).value;
    const consultationFee = (form.elements.namedItem("fee") as HTMLInputElement).value;
    const profileImage = (form.elements.namedItem("profileImage") as HTMLInputElement).files?.[0];

    if (!clinicAddress || !consultationFee) {
      toast.error("Please fill in all required fields.", {
        duration: 3000,
        style: { background: "#DC3545", color: "#fff" },
      });
      return;
    }

    const formData = new FormData();
    formData.append("address", clinicAddress);
    formData.append("consultationFee", consultationFee);
    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    setIsLoading(true);
    const toastId = toast.loading("Updating your profile...", {
      style: { background: "#333", color: "#fff" },
    });

    try {
      const response = await axios.post("/api/doctor/updateProfile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        toast.success("Profile updated successfully!", {
          id: toastId,
          duration: 3000,
          style: { background: "#28A745", color: "#fff" },
        });
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile", {
        id: toastId,
        duration: 3000,
        style: { background: "#DC3545", color: "#fff" },
      });
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="w-full lg:w-[90%] lg:ml-14 h-[100vh]  ">
      <Toaster position="top-right" reverseOrder={false} />
      {/* Heading */}
      <header className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Doctor Profile</h1>
        <p className="text-sm text-muted-foreground">Manage your professional information</p>
      </header>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Profile Picture */}
          {/* <Card className="lg:col-span-1 shadow-lg ">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Profile Picture</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="h-24 w-24 bg-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-10 w-10 text-white" />
              </div>
              <p className="text-sm text-muted-foreground mb-2">Upload a professional photo</p>
              <input type="file" name="profileImage" /> 
              <Button variant="outline" size="sm">Change Photo</Button>
            </CardContent>
          </Card> */}
          <Card className="lg:col-span-1 shadow-lg ">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Profile Picture</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="h-24 w-24 bg-gray-100 rounded-full overflow-hidden mx-auto mb-4 flex items-center justify-center">
                {doctorProfile?.imageUrl ? (
                  <img
                    src={doctorProfile.imageUrl}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-10 w-10 text-white bg-gray-400 rounded-full p-2" />
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-2">Upload a professional photo</p>

              <input
                type="file"
                name="profileImage"
                accept="image/*"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 hover:file:bg-gray-200 mb-3"
              />
            </CardContent>
          </Card>

          {/* Profile Form */}
          <Card className="lg:col-span-2 shadow-xl">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Professional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    readOnly
                    value={doctorProfile?.fullName?.split(" ")[0] || ""}
                    id="firstName" className="h-5 mt-1 text-sm" />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    readOnly
                    value={doctorProfile?.fullName?.split(" ")[1] || ""}
                    id="lastName"
                    className="h-5 mt-1 text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input
                    value={doctorProfile?.specialization || ""}
                    readOnly
                    id="specialization" className="h-5 mt-1 text-sm" />
                </div>
                <div>
                  <Label htmlFor="experience">Experience (Years)</Label>
                  <Input
                    value={doctorProfile?.experience || ""}
                    readOnly
                    id="experience" type="number" className="h-5 mt-1 text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Label htmlFor="email"><Mail className="h-2 w-2 " />Email</Label>

                  <Input id="email"
                    value={doctorProfile?.email || ""}
                    readOnly

                    className=" h-5 mt-1 text-sm" />
                </div>
                <div className="relative">
                  <Label htmlFor="phone"><Phone className="h-2 w-2" />Phone</Label>

                  <Input
                    value={doctorProfile?.phone || ""}
                    readOnly
                    id="phone" className=" h-5 mt-1 text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Label htmlFor="clinicAddress"><MapPin className="h-2 w-2" />Clinic Address</Label>
                  <Input
                    defaultValue={doctorProfile?.address || ""}
                    required
                    type="text"
                    name="clinicAddress" id="clinicAddress"
                    className="h-5 mt-1 text-sm" />
                </div>
                <div>
                  <Label htmlFor="fee">Consultation Fee ($)</Label>
                  <Input
                    defaultValue={doctorProfile?.consultationFee || ""}
                    required
                    name="fee" id="fee" type="number" className="h-5 mt-1 text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Label htmlFor="licenseNumber"><MapPin className="h-2 w-2" />License No.</Label>
                  <Input
                    value={doctorProfile?.licenseNumber || ""}
                    readOnly
                    id="licenseNumber" className="h-5 mt-1 text-sm" />
                </div>
                {/* <div>
                  <Label htmlFor="address"><MapPin className="h-2 w-2" />Address</Label>
                  <Input
                    value={doctorProfile?.address || ""}
                    readOnly
                    id="address" className="h-5 mt-1 text-sm" />
                </div> */}
              </div>

              <div className="pt-4">
                {/* <Button
                  type="submit"
                  className="w-full h-5 mt-1 active:shadow-xl bg-[#28A745] hover:bg-[#28A745] text-white text-sm">Save Changes</Button> */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-5 mt-1 active:shadow-xl bg-[#28A745] hover:bg-[#28A745] text-white text-sm"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>
      </form>
    </div>

  );
};

export default Page;