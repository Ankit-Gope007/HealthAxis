"use client";
import React, { useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useUserStore } from "@/src/store/useUserStore";
import axios from "axios";

const page = () => {
  const { data: session, status } = useSession();
  const { user, setUser } = useUserStore();
  


  useEffect(() => {
    const fetchUser = async () => {
      if (!session?.user?.id) return;

      console.log("Fetching user data for ID:", session.user.id);
      console.log("Session user data:", session.user);
      

      const res = await axios.post(`/api/patient/getPatientById`, {
        id: session.user.id,
      })

      console.log("Response from API:", res.data.user);

      if (res.data) {
        setUser(res.data);
      }
    };
    fetchUser();
  }, [session]);



  // Display a welcome toast message when the dashboard is accessed
  useEffect(() => {
    const hasShown = sessionStorage.getItem("dashboardToastShown");

    if (!hasShown) {
      toast.success(`Welcome back, ${user?.email}! 🎉`);
      sessionStorage.setItem("dashboardToastShown", "true");
    }
  }, []);
  return (
    <div>
      <Toaster />
      <div className="dashboard-container">
        <h1>Welcome to Your Dashboard {user?.email} </h1>
        <p>
          Here you can manage your health records, appointments, and more.
        </p>
        {/* Add more dashboard content here */}
      </div>
    </div>
  )
}

export default page