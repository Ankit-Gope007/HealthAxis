"use client"
import React from 'react'
import axios from 'axios';
import { useUserStore } from '@/src/store/useUserStore'
import { toast } from 'react-hot-toast';
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { FaRegUser } from 'react-icons/fa';



const Form = () => {
    const { user, setUser } = useUserStore();
    const userEmail = user?.email || ""; // Get the email from the user store, default to empty string if not available

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const data = {
            fullName: formData.get("fullName"),
            phone: formData.get("phone"),
            gender: formData.get("gender"),
            dob: formData.get("dob"),
            bloodGroup: formData.get("bloodGroup"),
            emergencyContactNumber: formData.get("emergencyContactNumber"),
            address: formData.get("address"),
            medicalHistory: formData.get("medicalHistory"),
            currentMedications: formData.get("currentMedications"),
            patientId: user?.id, // you must fetch this from session/auth
        };

        try {
            const res = await axios.post("/api/patient/upsertProfile", data);

            if (res.status === 200) {
                toast.success("Profile updated successfully!");
                console.log("Profile updated successfully:", res.data);
                if (user) {
                    const newPatientProfileId: string = res.data.id;
                    const updatedUser = {
                        ...user,
                        patientProfileId: newPatientProfileId,
                    }
                    setUser(updatedUser);
                    console.log("Updated user in store:", updatedUser);
                    console.log("Updated patient", user);
                }

            } else {
                toast.error("Failed to update profile. Please try again.");
            }

        } catch (error: any) {
            console.error("Error updating profile:", error);
            toast.error(error.response?.data?.error || "An error occurred while updating the profile.");

        }

    }

    return (
        <form onSubmit={handleFormSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="flex flex-col gap-1">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <FaRegUser className="text-green-600" />
                    Full Name<span className="text-red-500">*</span>
                </label>
                <Input
                    name="fullName"
                    type="text"
                    className="w-full  h-[20px] px-3 py-2 border border-[#DBF4E3] rounded-md focus:outline-none focus:ring-2 focus:ring-green-300"
                />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Email<span className="text-red-500">*</span></label>
                <Input
                    value={userEmail}
                    name="email"
                    type="email"
                    className="w-full h-[20px] px-3 py-2 border border-[#DBF4E3] rounded-md focus:outline-none focus:ring-2 focus:ring-green-300"
                    readOnly // <--- Add this prop
                />
            </div>

            {/* Phone Number */}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Phone Number<span className="text-red-500">*</span></label>
                <Input
                    name="phone"

                    type="text"
                    className="w-full  h-[20px] px-3 py-2 border border-[#DBF4E3] rounded-md focus:outline-none focus:ring-2 focus:ring-green-300"
                />
            </div>

            {/* Gender */}
            <div className="flex flex-col gap-1 text-gray-800">
                <label className="text-sm font-medium text-gray-700">Gender<span className="text-red-500">*</span></label>
                <select
                    name="gender"
                    className="w-full text-gray-800  h-[33px] px-3  border border-[#DBF4E3] rounded-md focus:outline-none focus:ring-2 focus:ring-green-300">
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                </select>
            </div>

            {/* Date of Birth */}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Date of Birth<span className="text-red-500">*</span></label>
                <Input
                    name="dob"
                    type="date"
                    className="w-full  h-[20px] px-3 py-2 border border-[#DBF4E3] rounded-md focus:outline-none focus:ring-2 focus:ring-green-300"
                />
            </div>


            {/* Blood Group */}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Blood Group</label>
                <select
                    name="bloodGroup"
                    className="w-full  h-[33px] px-3  border border-[#DBF4E3] rounded-md  focus:ring-2 focus:ring-green-300">
                    <option>O+</option>
                    <option>A+</option>
                    <option>B+</option>
                    <option>AB+</option>
                    <option>Other</option>
                </select>
            </div>

            {/* Emergency Contact */}
            <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-sm font-medium text-gray-700">Emergency Contact</label>
                <Input
                    name="emergencyContactNumber"
                    type="text"
                    className="w-full h-[20px] px-3 py-2 border border-[#DBF4E3] rounded-md focus:outline-none focus:ring-2 focus:ring-green-300"
                />
            </div>

            {/* Address */}
            <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-sm font-medium text-gray-700">Address</label>
                <textarea
                    name="address"
                    rows={4}
                    className="w-full px-3 py-2 border border-[#DBF4E3] rounded-md focus:outline-none focus:ring-2 focus:ring-green-300"
                />
            </div>


            {/* Medical History */}
            <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-sm font-medium text-gray-700">Medical History</label>
                <textarea
                    name="medicalHistory"
                    rows={4}
                    className="w-full px-3 py-2 border border-[#DBF4E3] rounded-md focus:outline-none focus:ring-2 focus:ring-green-300 resize-y"
                />
            </div>

            <div className="flex flex-col gap-2 col-span-full">
                <label className="text-sm font-semibold">Current Medications</label>
                <textarea
                    name="currentMedications"
                    rows={4}
                    className="w-full p-2 border-3 border-[#DBF4E3] rounded-md focus:outline-none resize-y" />
            </div>
            <div className="col-span-full ">
                <Button
                    type="submit"
                    className="px-6 w-full cursor-pointer py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                    Submit
                </Button>
            </div>
        </form>
    )
}

export default Form