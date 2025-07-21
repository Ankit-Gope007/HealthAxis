"use client";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Shield } from "lucide-react";
import toast, { Toaster } from 'react-hot-toast';
import axios from "axios";


const Page = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const validateForm = () => {
        if (!formData.email.includes("@")) {
            toast.error("Please enter a valid email address");
            return false;
        }
        if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            setIsLoading(true);

            const result = await axios.post("/api/admin/login", {
                email: formData.email,
                password: formData.password
            });
            if (result.status === 200) {
                setIsLoading(false);
                setFormData({ email: "", password: "", rememberMe: false });
                toast.success("Login successful!");
                // Store token in localStorage or cookies if needed
                localStorage.setItem("adminToken", result.data.token);
                // Redirect to the dashboard or home page
                setTimeout(() => {
                    router.push("/admin/dashboard");
                }, 2500);

            } else {
                setIsLoading(false);
                toast.error("Login failed. Please check your credentials.");
            }

        } catch (error) {
            setIsLoading(false);
            toast.error("An error occurred while processing your request");
            console.error("Login error:", error);
            return;

        }

    };

    return (

        <div className="min-h-screen flex items-center justify-center bg-[#f4fcf7] px-4 py-10">
            <Toaster position="top-right" />
            <div className="w-full max-w-md bg-white rounded-xl shadow-md px-6 py-3">
                <div className="flex flex-col items-center space-y-3 mb-6 text-center">
                    <div className="h-12 w-12 bg-[#c6f3d9] rounded-full flex items-center justify-center">
                        <Shield className="h-5 w-5 text-[#28A745]" />
                    </div>
                    <h2 className="text-xl font-semibold text-[#1c7c36]">
                        Admin Login
                    </h2>
                    <p className="text-sm text-gray-500">
                        Access Health Axis Admin Panel
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="admin@healthaxis.com"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            className="w-full h-5 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#28A745]"
                            autoComplete="email"
                        />
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={(e) => handleInputChange("password", e.target.value)}
                            className="w-full h-5 px-3 pr-10 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#28A745]"
                            autoComplete="current-password"
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-[38px] text-gray-500"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </button>
                    </div>

                    {/* <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                className="h-3 w-3 flex items-center justify-center"
                                id="rememberMe"
                                
                                checked={formData.rememberMe}
                                onCheckedChange={(checked) => handleInputChange("rememberMe", checked as boolean)}
                            />
                            <label htmlFor="rememberMe" className="text-sm text-gray-700">
                                Remember me
                            </label>
                        </div>
                        <span className="text-sm text-[#28A745] hover:underline cursor-pointer">
                            Forgot password?
                        </span>
                    </div> */}

                    <button
                        type="submit"
                        className="w-full h-5 bg-[#28A745] hover:bg-[#23913f] text-white text-sm font-medium rounded-md transition"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Signing in...
                            </span>
                        ) : (
                            "Log In"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Page;
