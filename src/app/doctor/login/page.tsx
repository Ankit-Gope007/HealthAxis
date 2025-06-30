"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Loader2, Stethoscope } from "lucide-react";
import toast, { Toaster } from 'react-hot-toast';
import axios from "axios";
import { useDoctorProfileStore } from "@/src/store/useDoctorProfileStore";

const page = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setProfile } = useDoctorProfileStore();

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
 
     const result = await axios.post("/api/doctor/login", {
       email: formData.email,
       password: formData.password
     });

     if (result.status === 200) {
      const doctor = result.data.data.doctorProfile;
      const doctorProfile = result.data.data.doctorProfile.doctorProfile;
      // console.log("Doctor Profile:", doctorProfile);
      // console.log("Doctor:", doctor);
      // Set the doctor profile in the store
      setProfile(
        {
          id: doctor.id,
          fullName: doctorProfile.fullName,
          specialization: doctorProfile.specialization,
          licenseNumber: doctorProfile.licenseNumber,
          email: doctor.email,
          phone: doctorProfile.phone,
          imageUrl: doctorProfile.imageUrl,
          clinicAddress: doctorProfile.clinicAddress,
          address: doctorProfile.address,
          dob: doctorProfile.dob,
          experience: doctorProfile.experience,
          consultationFee: doctorProfile.consultationFee,
          doctorId: doctor.id
        }
      );
       setIsLoading(false);
       setFormData({ email: "", password: "", rememberMe: false });
       toast.success("Login successful!");
       // Redirect to the dashboard or home page
       if (result.data.data.doctorProfile.profileSetup) {
         router.push("/doctor/dashboard");
       } else {
         router.push("/doctor/profile");
         toast.success("Please complete your profile setup.");
       }
      
     }
   } catch (error) {
      setIsLoading(false);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.error || "Login failed. Please try again.");
      } else {
        toast.error("An unexpected error occurred. Please try again later.");
      }
   }



  };

  return (
    <>
      <Toaster reverseOrder={false} />
      <div className="min-h-screen flex items-center justify-center bg-[#f4fcf7] px-4">
        <div className="w-full max-w-md border-2 h-auto flex flex-col bg-white rounded-xl shadow-md px-3 py-8">
          <div className="flex flex-col items-center  space-y-1 mb-1">
            <div className="h-12 w-12 bg-[#c6f3d9] rounded-full flex items-center justify-center">
              <Stethoscope className="h-5 w-5 text-[#28A745]" />
            </div>
            <h2 className="text-xl font-semibold text-[#1c7c36]">Doctor Login</h2>
            <p className="text-sm text-gray-500 mb-2">Welcome back to Health Axis</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="doctor@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                autoComplete="email"
                className="w-full h-5 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#28A745] focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  autoComplete="current-password"
                  className="w-full h-5 px-3 pr-10 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#28A745] focus:border-transparent"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

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

          <div className="mt-4 text-center space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase text-gray-400 bg-white px-2">
                New to Health Axis?
              </div>
            </div>
            <Link href="/doctor/register" className="text-[#28A745] text-sm font-medium hover:underline">
              Register as a Doctor
            </Link>
          </div>
        </div>
      </div>
    </>

  );
};

export default page;
