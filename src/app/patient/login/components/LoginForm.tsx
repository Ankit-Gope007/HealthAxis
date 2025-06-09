"use client"
import React from 'react'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast, { Toaster } from 'react-hot-toast';
import { useState } from 'react';
import { signIn } from "next-auth/react";


const LoginForm = () => {
    // State to hold the email and password
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");




    // Function to validate the login credentials
    const validLogin = (email: string, password: string): boolean => {
        if (!email.trim() || !password.trim()) {
            toast.error("Please fill in all fields");
            return false;
        }

        // Basic format check 
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address");
            return false;
        }
        if (password.length < 8) {
            toast.error("Password must be at least 8 characters long");
            return false;
        }

        return true;
    };
    // Login Function via Credentials
    const handleCredentialLogin = async () => {
        // Validate the login credentials
        const isValid = validLogin(email, password);
        if (!isValid) {
            return;
        }
        // Here you can add your login logic, e.g., API call to authenticate the user
        try {
            await signIn("credentials", {
                email,
                password,
                callbackUrl: "/patient/dashboard", // Redirect to dashboard after login
            });
        } catch (error) {
            console.error("Login error:", error);
            toast.error("An unexpected error occurred, Please check your credentials and try again.");
        } finally {
            toast.success("Login successful!");
            setEmail("");
            setPassword("");
        }
        // Clear the input fields after login


    }

    // Login Function via Google
    const handleGoogleLogin = async () => {
        try {
            await signIn("google", {
                callbackUrl: "/patient/dashboard", // Redirect to dashboard after login
            });
        } catch (error) {
            console.error("Google login error:", error);
            toast.error("An unexpected error occurred, Please try again.");
        } 
    }



    return (
        <div className="space-y-4 w-full">
            {/* Login Form */}
            {/* heading /tagline */}
            <h2 className="text-2xl font-bold text-center mb-4">Welcome Back!</h2>
            {/* Email */}
            <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email"
                className="w-full h-[40px] " />
            {/* Password */}
            <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
                className=" h-[40px]
                   w-full" />
            {/* Credential login Button */}
            <Button
                onClick={handleCredentialLogin}
                className="w-full h-[40px] cursor-pointer bg-[#18AC4E] active:outline-cyan-600 hover:bg-[#119D56]">Log In</Button>
            {/* Google login Button */}
            <Button
                onClick={handleGoogleLogin}
                className="w-full h-[40px] cursor-pointer bg-blue-700 text-white hover:bg-blue-600 flex items-center justify-center gap-2">
                <img
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    alt="Google"
                    className="h-2 w-2"
                />
                Log In with Google
            </Button>
        </div>
    )
}

export default LoginForm