"use client"
import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { IoMdAdd } from 'react-icons/io'
import { CiCalendarDate } from 'react-icons/ci'
import { MdOutlineWaterDrop } from 'react-icons/md'
import { IoCallOutline } from 'react-icons/io5'
import { useUserStore } from '@/src/store/useUserStore'
import { useRef } from 'react'
import { useEffect } from 'react'
import { useSidebarStore } from '@/src/store/useSidebarStore'
import axios from 'axios'
import toast from 'react-hot-toast'
import { usePatientProfileStore } from '@/src/store/usePatientProfileStore'
import { CiMail } from "react-icons/ci";
import ImageUpload from './Image'




const ProfileInfo = () => {

    const { setActiveItem } = useSidebarStore();
    const { user } = useUserStore();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { profile, setProfile } = usePatientProfileStore();
    const [patientAge, setPatientAge] = useState<number>(0);




    const fetchPatientProfile = async () => {
        try {

            const response = await axios.post('/api/patient/getPatientProfile',
                { patientId: user?.id }
            );
            if (response.status === 200) {
                console.log("Patient profile fetched successfully:", response.data);
                setProfile(response.data);
                calculateAge(response.data.dob);

            }

        } catch (error) {
            console.error("Error fetching patient profile:", error);
            toast.error("Failed to fetch patient profile");
        }
    }
    const calculateAge = (dob: string) => {
        const birthDate = new Date(dob);
        const today = new Date();

        let age = today.getFullYear() - birthDate.getFullYear();
        const hasBirthdayPassed =
            today.getMonth() > birthDate.getMonth() ||
            (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

        if (!hasBirthdayPassed) {
            age--;
        }
        setPatientAge(age);


    }

    useEffect(() => {
        if (user) {
            fetchPatientProfile();

        }
        setActiveItem("profile");
    }, [user]);

    const handleImageUpload = async (url: string) => {
        try {
            const { user } = useUserStore.getState();
            const patientId = user?.id

            const res = await axios.patch("/api/patient/uploadImage", {
                patientId: patientId,
                imageUrl: url,
            });
            console.log("Image updated in DB:", res.data);
            toast.success("Profile picture updated!");



        } catch (err) {
            console.error("Failed to update image in DB", err);
            toast.error("Failed to save image URL.");
        }
    };


    return (
        <>
            {/* Header */}
            <div className="flex flex-col items-start gap-1 w-full  bg-[#EDF9EF] rounded-lg p-4 mb-2">
                <h1 className="text-2xl font-semibold text-[#1d9c54]">Patient Profile</h1>
                <p className="text-gray-600 font-normal">Manage your health information</p>
            </div>
            {/* Photo */}
            {profile?.imageUrl ? (
                <div className="w-[100px] h-[100px] rounded-full object-cover border-4 border-white shadow-md">
                    <img
                        src={profile.imageUrl}
                        alt="Profile"
                        className='w-full h-full rounded-full object-cover cursor-pointer'
                        onClick={() => fileInputRef.current?.click()}
                    />
                </div>

            ) : (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className=" w-[100px] h-[100px]  rounded-full bg-gray-300 border-5 border-white flex items-center justify-center cursor-pointer"
                >
                    <IoMdAdd className="text-5xl text-gray-600" />
                </div>
            )}

            {/* 🔥 Upload Widget Trigger */}
            <ImageUpload ref={fileInputRef} />
            {/* Name & ID */}
            <div className="flex flex-col items-center gap-1  ">
                <h2 className="text-xl font-semibold text-[#1d9c54]">{profile?.fullName}</h2>
                {/* <p className="text-[#018d32b2] font-normal">Patient ID:</p> */}
            </div>
            {/* Basic Info */}
            <div className="flex flex-col gap-1 mt-1 text-[#018d32b2] font-semibold">
                <div className="flex items-center gap-2">
                    <CiCalendarDate className="text-lg" />
                    <span>Age: {patientAge} years</span>
                </div>
                <div className="flex items-center gap-2">
                    <MdOutlineWaterDrop className="text-lg" />
                    <span>Blood Group:{profile?.bloodGroup}</span>
                </div>
                <div className="flex items-center gap-2">
                    <IoCallOutline className="text-lg" />
                    <span>Phone: {profile?.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                    <CiMail className="text-lg" />
                    <span className='text-xs'>Mail: {user?.email}</span>
                </div>

            </div>
        </>
    )
}

export default ProfileInfo



