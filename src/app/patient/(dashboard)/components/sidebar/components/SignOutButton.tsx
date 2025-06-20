"use client";
import React from 'react'
import { signOut } from "next-auth/react";
import { useUserStore } from "@/src/store/useUserStore";
import { usePatientProfileStore } from '@/src/store/usePatientProfileStore';


const SignOutButton = () => {
    const { clearUser } = useUserStore();
    const { clearProfile } = usePatientProfileStore();
    const handleLogout = () => {
        signOut({ callbackUrl: "/patient/login" });
        clearUser();
        clearProfile();
        localStorage.removeItem("patientProfileId");
    };

    return (
        <span 
            onClick={handleLogout}
            className=' w-full py-1 px-2 '
         >Sign Out</span>
    )
}

export default SignOutButton