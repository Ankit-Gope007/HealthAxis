"use client";
import React from 'react'
import { signOut } from "next-auth/react";
import { useUserStore } from "@/src/store/useUserStore";
import { useDoctorProfileStore } from '@/src/store/useDoctorProfileStore';
import axios from 'axios';

const SignOutButton = () => {
    const { clearUser } = useUserStore();
    const { clearProfile } = useDoctorProfileStore();
    const handleLogout = async () => {
        const response = await axios.post("/api/doctor/logout");
        if (response.status === 200) {
        clearUser();
        clearProfile();
        localStorage.removeItem("doctorProfile");
        signOut({ callbackUrl: "/doctor/login" });
        }
    };

    return (
        <span 
            onClick={handleLogout}
            className=' w-full py-1 px-2 '
         >Sign Out</span>
    )
}

export default SignOutButton