"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, Eye, EyeOff, Loader2, Stethoscope } from "lucide-react";
import toast, { Toaster } from 'react-hot-toast';
import axios from "axios";
import { doctorRegisterSchemaWithPasswordMatch } from "@/src/utils/doctorFormValidator";
import "./page.css";

const page = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
        specialization: "",
        yearsOfExperience: "",
        licenseNumber: "",
        licenseDocument: null as File | null
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(false);

    const router = useRouter();

    const specializations = [
        "General Medicine", "Cardiology", "Dermatology", "Endocrinology",
        "Gastroenterology", "Neurology", "Oncology", "Orthopedics",
        "Pediatrics", "Psychiatry", "Radiology", "Surgery"
    ];

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast("File too large\nPlease upload a file smaller than 5MB");
                return;
            }
            setFormData(prev => ({ ...prev, licenseDocument: file }));
            toast.success("File uploaded successfully");
        }
    };

    const validateForm = () => {
        const result = doctorRegisterSchemaWithPasswordMatch.safeParse({
            ...formData,
            agreeToTerms,
            licenseDocument: formData.licenseDocument,
        });

        if (!result.success) {
            // Show all errors as pretty green-themed toast notifications
            result.error.errors.forEach((err) => {
                toast.custom((t) => (
                    <div
                        className={`${t.visible ? "animate-enter" : "animate-leave"
                            } max-w-md w-full  bg-white shadow-lg rounded-lg border-l-4 border-[#28A745] pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
                    >
                        <div className="flex-1 w-0 p-4">
                            <p className="text-sm font-medium text-gray-900">
                                Validation Error
                            </p>
                            <p className="mt-1 text-sm text-gray-500">{err.message}</p>
                        </div>
                        <div className="flex border-l border-gray-200">
                            <button
                                onClick={() => toast.dismiss(t.id)}
                                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-[#28A745] hover:text-green-700"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                ));
            });
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsLoading(true);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append("fullName", formData.fullName);
            formDataToSend.append("email", formData.email);
            formDataToSend.append("password", formData.password);
            formDataToSend.append("confirmPassword", formData.confirmPassword);
            formDataToSend.append("phoneNumber", formData.phoneNumber);
            formDataToSend.append("specialization", formData.specialization);
            formDataToSend.append("yearsOfExperience", formData.yearsOfExperience);
            formDataToSend.append("licenseNumber", formData.licenseNumber);
            if (formData.licenseDocument) {
                formDataToSend.append("licenseDocument", formData.licenseDocument);
            }
            const response = await axios.post("/api/doctor/registerDoctor", formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            if (response.status === 201) {
                toast.success(
                    "🎉 Registration successful!\nWe've received your details. You will receive an email shortly confirming whether your profile has been verified. Once approved, you'll be able to log in.",
                    {
                        style: {
                            borderLeft: '4px solid #28A745',
                            padding: '16px',
                            color: '#333',
                            background: '#f0fff4',
                            fontSize: '14px',
                        },
                        duration: 7000,
                    }
                );
                setIsLoading(false);
                setTimeout(() => {
                    router.push("/doctor/login");
                }, 7000); // delay to let them read the toast
            }

        } catch (error) {
            setIsLoading(false);
            console.error("Error during registration:", error);
            toast.error("Registration failed. Please try again.");
        }

    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f4fcf7] px-4 py-5">
            <Toaster reverseOrder={false} />
            <div className="w-full max-w-3xl bg-white rounded-xl shadow-md px-8 py-2 overflow-y-scroll h-[85vh]">
                <div className="flex flex-col items-center space-y-3 mb-6 text-center">
                    <div className="h-12 w-12 bg-[#c6f3d9] rounded-full flex items-center justify-center">
                        <Stethoscope className="h-5 w-5 text-[#28A745]" />
                    </div>
                    <h2 className="text-xl font-semibold text-[#1c7c36]">
                        Become a Certified Doctor with Health Axis
                    </h2>
                    <p className="text-sm text-gray-500">
                        Join our network of healthcare professionals
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                placeholder="Dr. John Smith"
                                value={formData.fullName}
                                onChange={(e) => handleInputChange("fullName", e.target.value)}
                                className="w-full h-5 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#28A745]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address *
                            </label>
                            <input
                                type="email"
                                id="email"
                                placeholder="doctor@example.com"
                                value={formData.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                className="w-full h-5 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#28A745]"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password *
                            </label>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Minimum 8 characters"
                                value={formData.password}
                                onChange={(e) => handleInputChange("password", e.target.value)}
                                className="w-full h-5 px-3 pr-5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#28A745]"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-[38px] text-gray-500"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                            </button>
                        </div>
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm Password *
                            </label>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                                className="w-full h-5 px-3 pr-5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#28A745]"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-[38px] text-gray-500"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number
                            </label>
                            <input
                                type="text"
                                placeholder="+1 (555) 123-4567"
                                value={formData.phoneNumber}
                                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                                className="w-full h-5 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#28A745]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Specialization *
                            </label>
                            <Select
                                value={formData.specialization}
                                onValueChange={(value) => handleInputChange("specialization", value)}
                            >
                                <SelectTrigger className="w-full  max-h-5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#28A745]">
                                    <SelectValue placeholder="Select your specialization" />
                                </SelectTrigger>
                                <SelectContent>
                                    {specializations.map(spec => (
                                        <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Years of Experience
                            </label>
                            <input
                                type="number"
                                placeholder="5"
                                min="0"
                                value={formData.yearsOfExperience}
                                onChange={(e) => handleInputChange("yearsOfExperience", e.target.value)}
                                className="w-full h-5 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#28A745]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Medical License Number *
                            </label>
                            <input
                                type="text"
                                placeholder="MD123456789"
                                value={formData.licenseNumber}
                                onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                                className="w-full h-5 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#28A745]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Upload License Document
                        </label>
                        <label
                            htmlFor="licenseDocument"
                            className="flex items-center justify-center h-5 border border-gray-300 rounded-md cursor-pointer text-sm text-gray-600 hover:bg-gray-50"
                        >
                            <Upload className="h-3 w-3 mr-2" />
                            {formData.licenseDocument ? formData.licenseDocument.name : "Choose file (PDF, JPG, PNG)"}
                        </label>
                        <input
                            type="file"
                            id="licenseDocument"
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleFileUpload}
                        />
                    </div>

                    <div className="flex justify-start items-center gap-2 text-sm">
                        <Checkbox
                            className="h-3 w-3 flex items-center justify-center"
                            id="terms"
                            checked={agreeToTerms}
                            onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                        />
                        <label htmlFor="terms" className="text-gray-700">
                            I agree to the{" "}
                            <Link href="/terms" className="text-[#28A745] underline">
                                Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link href="/privacy" className="text-[#28A745] underline">
                                Privacy Policy
                            </Link>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full h-5 bg-[#28A745] hover:bg-[#23913f] text-white text-sm font-medium rounded-md transition"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating Account...
                            </span>
                        ) : (
                            "Register as Doctor"
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                        Already have an account?{" "}
                        <Link href="/doctor/login" className="text-[#28A745] hover:underline font-medium">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default page;
