"use client"
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast, { Toaster } from 'react-hot-toast';
import { useState } from 'react';
import { signIn } from "next-auth/react";
import axios from 'axios';
import { useRouter } from 'next/navigation';

const SignInForm = () => {
    // State to hold the email and password
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const router = useRouter();

    // Function to validate the sign-up credentials
    const validSignUp = (email: string, password: string, confirmPassword: string): boolean => {
        if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
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

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return false;
        }

        return true;
    };

    // Sign Up Function via Credentials
    const handleCredentialSignUp = async () => {
        // Validate the sign-up credentials
        const isValid = validSignUp(email, password, confirmPassword);
        if (!isValid) {
            return;
        }
        // Here my call to add the user to the database
        try {
            const response = await axios.post('/api/patient/registerCredential', {
                email,
                password,
            });

            if (response.status === 201) {
                toast.success("Sign up successful! You are now redirected to the dashboard.");
                // Optionally, redirect to the login page or clear the form
                setEmail("");
                setPassword("");
                setConfirmPassword("");
                // login the user automatically after sign up
                await signIn('credentials', {
                    email,
                    password,
                    callbackUrl: "/patient/dashboard",
                })
            } else {
                toast.error("Sign up failed. Please try again.");
            }

        } catch (error) {
            console.error("Error during sign up:", error);
            toast.error("An error occurred during sign up. Please try again.");
        }
    }

    // Sign Up Function via Google

    const handleGoogleSignUp = async () => {
        try {
            await signIn("google", {
                callbackUrl: "/patient/dashboard",
                role: "PATIENT" 
            });
           
           
        } catch (error) {
            console.error("Google sign-in error:", error);
            toast.error("Something went wrong during sign-up.");
        }
    };

    return (
        <div className="space-y-4 w-full">
            <Toaster position="top-center" reverseOrder={false} />
            {/* Sign Up Form */}
            {/* heading /tagline */}
            <h2 className="text-2xl font-bold text-center mb-4">Create an Account!</h2>
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
            {/* Confirm Password */}

            <Input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type="password"
                placeholder="Confirm Password"
                className=" h-[40px]
               w-full" />


            {/* Credential Sign up Button */}
            <Button
                onClick={handleCredentialSignUp}
                className="w-full h-[40px] cursor-pointer bg-[#18AC4E] active:outline-cyan-600 hover:bg-[#119D56]">Log In</Button>
            {/* Google Sign Up Button */}

            <Button
                onClick={handleGoogleSignUp}
                className="w-full h-[40px] cursor-pointer bg-blue-700 text-white hover:bg-blue-600 flex items-center justify-center gap-2">
                <img
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    alt="Google"
                    className="h-2 w-2"
                />
                Sign Up with Google
            </Button>

        </div>
    )
}

export default SignInForm