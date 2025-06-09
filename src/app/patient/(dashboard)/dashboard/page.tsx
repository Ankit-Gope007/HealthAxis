// import { isUserAuth } from "@/src/lib/isUserAuth";
// import Dashboard from "./Dashboard";

// export default async function Page() {
//   const session = await isUserAuth();

//   return <Dashboard session={session} />;
// }

"use client";
import React, { useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useSessionStore } from "@/src/store/useSessionStore";
import { useSession } from "next-auth/react";

const page = () => {
  const { setSessionStore, sessionStore } = useSessionStore();
  const { data: session } = useSession();

  useEffect(() => {
    const user = session?.user;
    // If user data is available, set it in the session store
    if (user?.email && user?.id) {
      setSessionStore({
        email: user.email,
        id: user.id,
      });

    }
    // If user data is not available, clear the session store
    else {
      setSessionStore(null);
    }
  }, [session, setSessionStore]);


  // Display a welcome toast message when the dashboard is accessed
  useEffect(() => {
    const hasShown = sessionStorage.getItem("dashboardToastShown");

    if (!hasShown) {
      toast.success(`Welcome back, ${sessionStore?.email}! 🎉`);
      sessionStorage.setItem("dashboardToastShown", "true");
    }
  }, []);
  return (
    <div>
      <Toaster />
      <div className="dashboard-container">
        <h1>Welcome to Your Dashboard {sessionStore?.email} </h1>
        <p>
          Here you can manage your health records, appointments, and more.
        </p>
        {/* Add more dashboard content here */}
      </div>
    </div>
  )
}

export default page