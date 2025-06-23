// "use client";
// import AdminLayout from "./components/AdminLayout"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Users, UserCheck, Calendar, Activity, UserPlus, Mail, FileText } from "lucide-react";
// import Link from "next/link";
// import { useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { Settings } from "lucide-react";
// import { 
//   LogOut, 
//   Menu, 
//   X,
//   LayoutDashboard,
//   Shield
// } from "lucide-react";



// const page = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const params = useParams();
//   const router = useRouter();
//   const stats = [
//     {
//       title: "Total Doctors",
//       value: 127,
//       icon: UserCheck,
//       trend: { value: "+12%", isPositive: true }
//     },
//     {
//       title: "Verified Doctors",
//       value: 89,
//       icon: Users,
//       trend: { value: "+8%", isPositive: true }
//     },
//     {
//       title: "Total Patients",
//       value: "2,845",
//       icon: Activity,
//       trend: { value: "+23%", isPositive: true }
//     },
//     {
//       title: "Today's Appointments",
//       value: 42,
//       icon: Calendar,
//       trend: { value: "-5%", isPositive: false }
//     }
//   ];

//   const quickActions = [
//     {
//       title: "Review Pending Doctors",
//       description: "38 doctors waiting for verification",
//       icon: UserPlus,
//       link: "/admin/doctors",
//       color: "bg-blue-500"
//     },
//     {
//       title: "Send Announcement",
//       description: "Notify all users about updates",
//       icon: Mail,
//       link: "/admin/email",
//       color: "bg-green-500"
//     },
//     {
//       title: "View All Users",
//       description: "Manage patient accounts",
//       icon: Users,
//       link: "/admin/users",
//       color: "bg-purple-500"
//     }
//   ];

//   const recentActivities = [
//     { action: "Dr. Smith verified", time: "2 hours ago", type: "verification" },
//     { action: "New doctor registration", time: "4 hours ago", type: "registration" },
//     { action: "Patient complaint resolved", time: "6 hours ago", type: "support" },
//     { action: "System maintenance completed", time: "1 day ago", type: "system" }
//   ];


//   const menuItems = [
//     { title: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
//     { title: "Doctors", icon: UserCheck, path: "/admin/doctors" },
//     { title: "Patients", icon: Users, path: "/admin/users" },
//     { title: "Send Email", icon: Mail, path: "/admin/email" },
//     { title: "Settings", icon: Settings, path: "/admin/settings" },
//   ];

//   const handleLogout = () => {
//     router.push("/admin/login");
//   };


//   return (

//       <div className="space-y-6">
//         {/* Header */}
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Welcome back, Admin!</h1>
//           <p className="text-muted-foreground">Here's what's happening with your platform today.</p>
//         </div>

//         {/* Main content */}
//         <div className="lg:pl-64">
//           {/* Mobile header */}
//           <div className="lg:hidden bg-white border-b px-4 py-2">
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => setSidebarOpen(true)}
//             >
//               <Menu className="h-6 w-6" />
//             </Button>
//           </div>

//           {/* <main className="p-6">
//             {children}
//           </main> */}
//         </div>

//         {/* Quick Actions */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {quickActions.map((action, index) => (
//             <Card key={index} className="hover:shadow-md transition-shadow">
//               <CardContent className="p-6">
//                 <div className="flex items-start space-x-4">
//                   <div className={`${action.color} p-3 rounded-lg`}>
//                     <action.icon className="h-6 w-6 text-white" />
//                   </div>
//                   <div className="flex-1">
//                     <h3 className="font-semibold text-gray-900">{action.title}</h3>
//                     <p className="text-sm text-muted-foreground mb-3">{action.description}</p>
//                     <Link href={action.link}>
//                       <Button size="sm" variant="outline">
//                         Take Action
//                       </Button>
//                     </Link>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//         {/* Recent Activity */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center">
//                 <Activity className="mr-2 h-5 w-5" />
//                 Recent Activity
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {recentActivities.map((activity, index) => (
//                   <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
//                     <div className="flex items-center space-x-3">
//                       <div className={`w-2 h-2 rounded-full ${activity.type === 'verification' ? 'bg-green-500' :
//                         activity.type === 'registration' ? 'bg-blue-500' :
//                           activity.type === 'support' ? 'bg-yellow-500' : 'bg-gray-500'
//                         }`} />
//                       <span className="text-sm">{activity.action}</span>
//                     </div>
//                     <span className="text-xs text-muted-foreground">{activity.time}</span>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center">
//                 <FileText className="mr-2 h-5 w-5" />
//                 System Status
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm">Server Status</span>
//                   <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Online</span>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm">Database</span>
//                   <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Healthy</span>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm">API Response</span>
//                   <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">125ms</span>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm">Storage Usage</span>
//                   <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">68%</span>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//   );
// };

// export default page;

// 


"use client";

import { useState,useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users, UserCheck, Calendar, Activity, UserPlus, Mail,
  FileText, Settings, LogOut, Menu, X, LayoutDashboard, Shield
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSidebarStore } from '@/src/store/useSidebarStore';

const Page = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {setActiveItem} = useSidebarStore();
  const router = useRouter();

  useEffect(() => {
    setActiveItem("Dashboard"); // Set the active item to "Dashboard" when the component mounts
  }, [])
  

  const insights = [
    {
      title: "Total Doctors",
      value: 127,
      icon: UserCheck,
      trend: { value: "+12%", isPositive: true }
    },
    {
      title: "Verified Doctors",
      value: 89,
      icon: Users,
      trend: { value: "+8%", isPositive: true }
    },
    {
      title: "Total Patients",
      value: "2,845",
      icon: Activity,
      trend: { value: "+23%", isPositive: true }
    },
    {
      title: "Today's Appointments",
      value: 42,
      icon: Calendar,
      trend: { value: "-5%", isPositive: false }
    }
  ];


  const quickActions = [
    {
      title: "Review Pending Doctors",
      description: "38 doctors waiting for verification",
      icon: UserPlus,
      link: "/admin/doctors",
      color: "bg-blue-500"
    },
    {
      title: "Send Announcement",
      description: "Notify all users about updates",
      icon: Mail,
      link: "/admin/email",
      color: "bg-green-500"
    },
    {
      title: "View All Users",
      description: "Manage patient accounts",
      icon: Users,
      link: "/admin/users",
      color: "bg-purple-500"
    }
  ];

  const recentActivities = [
    { action: "Dr. Smith verified", time: "2 hours ago", type: "verification" },
    { action: "New doctor registration", time: "4 hours ago", type: "registration" },
    { action: "Patient complaint resolved", time: "6 hours ago", type: "support" },
    { action: "System maintenance completed", time: "1 day ago", type: "system" },
    { action: "Dr. Smith verified", time: "2 hours ago", type: "verification" },
    { action: "New doctor registration", time: "4 hours ago", type: "registration" },
    { action: "Patient complaint resolved", time: "6 hours ago", type: "support" },
    { action: "System maintenance completed", time: "1 day ago", type: "system" },
    { action: "Dr. Smith verified", time: "2 hours ago", type: "verification" },
    { action: "New doctor registration", time: "4 hours ago", type: "registration" },
    { action: "Patient complaint resolved", time: "6 hours ago", type: "support" },
    { action: "System maintenance completed", time: "1 day ago", type: "system" }
  ];

  return (
    <div className="w-full lg:w-[90%] lg:ml-14 h-[100vh] bg-[#f9fdfb] ">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Welcome back, Admin!</h1>
        <p className="text-gray-500">Here's what's happening with your platform today.</p>
      </header>

      {/* separator */}
      <div className="w-full h-[1px] bg-gray-300 my-4" />


      {/* Quick Actions */}
      <section className="grid grid-cols-1  mt-5 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {quickActions.map((action, index) => (
          <Card key={index} className="hover:shadow-md  py-1 flex justify-center items-center transition-shadow">
            <CardContent className="p-2 w-full ">
              <div className="flex items-start gap-2">
                <div className={`${action.color} p-2 rounded-lg`}>
                  <action.icon className="h-3 w-3 text-white" />
                </div>
                <div className="flex-1 ">
                  <h3 className="font-semibold text-gray-900 text-base">{action.title}</h3>
                  <p className="text-sm text-gray-500 mb-3">{action.description}</p>
                  <Link href={action.link}>
                    <Button size="sm" variant="outline">Take Action</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>


      {/* Recent Activities and Platform Insights */}
      <section className="grid  mt-4 grid-cols-1 md:grid-cols-2 gap-3">
        {/* Recent Activities */}
        <Card className="gap-0">
          <CardHeader className="">
            <CardTitle className="flex items-center gap-2">
              <div className="bg-[#28A745] text-white p-2 rounded-lg">
                <Activity className="h-4 w-4" />
              </div>
              <h2>Recent Activities</h2>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 bg-gray-50  overflow-y-auto show-scrollbar max-h-[250px]">
            {recentActivities.map((activity, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b last:border-b-0">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${activity.type === 'verification' ? 'bg-green-500' :
                    activity.type === 'registration' ? 'bg-blue-500' :
                      activity.type === 'support' ? 'bg-yellow-500' : 'bg-gray-500'
                    }`} />
                  <span className="text-sm text-gray-800">{activity.action}</span>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Platform Insights */}
        <Card className="gap-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="bg-[#28A745] text-white p-2 rounded-lg">
                <FileText className="h-4 w-4" />
              </div>
              <h2>Platform Insights</h2>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-2 bg-gray-50 max-h-[250px] overflow-y-auto show-scrollbar">
            {insights.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b last:border-b-0">
                <div className="flex items-center gap-3">
                  <item.icon className="h-4 w-4 text-[#28A745]" />
                  <span className="text-sm text-gray-800">{item.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                  <span className={`text-xs font-medium ${item.trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {item.trend.value}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Page;
