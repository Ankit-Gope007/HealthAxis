"use client";
import React from 'react'
import { signOut } from "next-auth/react";
import { useUserStore } from "@/src/store/useUserStore";


const SignOutButton = () => {
    const { clearUser } = useUserStore();
    const handleLogout = () => {
        signOut({ callbackUrl: "/patient/login" });
        clearUser();
    };

    return (
        <span 
            onClick={handleLogout}
            className=' w-full py-1 px-2 '
         >Sign Out</span>
    )
}

export default SignOutButton