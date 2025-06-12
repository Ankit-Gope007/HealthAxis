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

    return (
        <>
            {/* Header */}
            <div className="flex flex-col items-start gap-1 w-full  bg-[#EDF9EF] rounded-lg p-4 mb-2">
                <h1 className="text-2xl font-semibold text-[#1d9c54]">Patient Profile</h1>
                <p className="text-gray-600 font-normal">Manage your health information</p>
            </div>
            {/* Photo */}
            <div
                onClick={() => fileInputRef.current?.click()}
                className=" w-[100px] h-[100px]  rounded-full bg-gray-300 border-5 border-white flex items-center justify-center cursor-pointer"
            >
                
                <IoMdAdd className="text-4xl text-gray-600" />
                <Input ref={fileInputRef} type="file" className="hidden" />
            </div>
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