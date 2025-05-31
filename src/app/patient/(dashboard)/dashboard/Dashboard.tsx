// "use client";

// import React, { useEffect } from "react";
// import { toast, Toaster } from "react-hot-toast";
// import { Session } from "next-auth"; // ✅ Import Session type

// // ✅ Define the prop type
// interface DashboardProps {
//   session: Session;
// }

// const Dashboard: React.FC<DashboardProps> = ({ session }) => {
//   useEffect(() => {
//     const hasShown = sessionStorage.getItem("dashboardToastShown");

//     if (!hasShown) {
//       toast.success(`Welcome back, ${session?.user?.name || "User"}! 🎉`);
//       sessionStorage.setItem("dashboardToastShown", "true");
//     }
//   }, []);

//   return (
//     <div>
//       <Toaster />
//       <div className="dashboard-container">
//         <h1>Welcome to Your Dashboard {session?.user?.name}</h1>
//         <p>
//           Here you can manage your health records, appointments, and more.
//         </p>
//         {/* Add more dashboard content here */}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;