"use client";
import React from 'react'
import { signOut } from "next-auth/react";
import { useUserStore } from "@/src/store/useUserStore";
import axios from 'axios';


const SignOutButton = () => {
    const { clearUser } = useUserStore();
   
    const handleLogout = async () => {
        try {
            const response = await axios.post("/api/admin/logout");
            if (response.status === 200) {
                clearUser();
                localStorage.removeItem("adminProfile");
                signOut({ callbackUrl: "/admin/login" });
            }
        } catch (error) {
            console.error("Logout failed:", error);
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