// "use client"
// import React, { useEffect } from 'react'
// import { useRef } from 'react';
// import { FaRegUser } from "react-icons/fa6";
// import { IoMdAdd } from "react-icons/io";
// import { CiCalendarDate } from "react-icons/ci";
// import { MdOutlineWaterDrop } from "react-icons/md";
// import { IoCallOutline } from "react-icons/io5";
// import { RiLogoutCircleLine } from "react-icons/ri";
// import { signOut } from "next-auth/react";
// // import './page.css';
// import { useUserStore } from '@/src/store/useUserStore';
// import { useSidebarStore } from '@/src/store/useSidebarStore';

// const page = () => {
//   const { setActiveItem } = useSidebarStore();
//   // Set the active item to "profile" when this page is accessed
//   useEffect(()=>{
//     setActiveItem("profile");
//   },[])


//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const { clearUser } = useUserStore();

//   // Function to handle logout
//   const handleLogout = () => {
//     signOut({ callbackUrl: "/patient/login" }); // Redirect to login page after logout
//     clearUser(); // Clear user data from the store
//   }




//   return (
//     <div className='patient-profile-container'>
//       <div className="profile-summary">
//         <div className="profile-info">
//           <div className="profile-info-header">
//             <h1>Patient Profile</h1>
//             <p>Manage your health information</p>
//           </div>
//           <div
//             onClick={() => fileInputRef.current?.click()}
//             className="profile-info-photo">
//             <IoMdAdd className='add-icon' />
//             <Input
//               ref={fileInputRef}
//               type="file"
//               id="file-upload"
//             />
//           </div>
//           <div className="profile-info-names">
//             <h2 className=''>Ankit Gope</h2>
//             <p>Patient ID: 123456HD-UKL</p>
//           </div>
//           <div className="profile-info-basicInfo">
//             <div className="profile-info-basicInfo-info">
//               <CiCalendarDate className='profile-info-basicInfo-logo' /> Age: 30 years
//             </div>
//             <div className="profile-info-basicInfo-info">
//               <MdOutlineWaterDrop className='profile-info-basicInfo-logo' />Blood Group: O+
//             </div>
//             <div className="profile-info-basicInfo-info">
//               <IoCallOutline className='profile-info-basicInfo-logo' />Phone: +1234567890
//             </div>
//           </div>
//           <div
//             onClick={handleLogout}
//             className="logOut-btn">
//             <RiLogoutCircleLine className='logOut-icon' />
//             Log Out
//           </div>

//         </div>



//         <div className="profile-data">
//           <div className='profile-data-heading'>
//             <h2>Your Latest Appoinment</h2>
//           </div>
//           <div className='profile-data-appoinment-list'>
//             No Latest Appoinments
//           </div>
//         </div>
//       </div>
//       <div className="profile-box">
//         <div className="profile-box-header">
//           <h2 className=''>Personal Information</h2>
//           <p>Update your personal and health details</p>
//         </div>
//         <div className="seperator">

//         </div>
//         <div className="profile-box-content">
//           <div className="info">
//             <form action="" className='form-grid'>
//               <div className="form-group">
//                 <label><FaRegUser className='green' />  Full Name*</label>
//                 <Input type="text" placeholder="" />
//               </div>
//               <div className="form-group">
//                 <label>Email*</label>
//                 <Input type="email" placeholder="" />
//               </div>
//               <div className="form-group">
//                 <label>Phone Number*</label>
//                 <Input type="text" placeholder="" />
//               </div>
//               <div className="form-group">
//                 <label>Gender*</label>
//                 <select>
//                   <option>Male</option>
//                   <option>Female</option>
//                   <option>Other</option>
//                 </select>
//               </div>
//               <div className="form-group">
//                 <label>Date of Birth*</label>
//                 <Input type="date" />
//               </div>
//               <div className="form-group">
//                 <label>Address</label>
//                 <Input type="text" placeholder="" />
//               </div>
//               <div className="form-group">
//                 <label>Blood Group</label>
//                 <select>
//                   <option>B+</option>
//                   <option>A+</option>
//                   <option>O+</option>
//                   <option>AB+</option>
//                   <option>Other</option>
//                 </select>
//               </div>
//               <div className="form-group">
//                 <label>Emergency Contact</label>
//                 <Input type="text" placeholder="" />
//               </div>
//               <div className="form-group full-width">
//                 <label>Medical History</label>
//                 <textarea placeholder=""></textarea>
//               </div>
//               <div className="form-group full-width">
//                 <label>Current Medications</label>
//                 <textarea></textarea>
//               </div>

//               <div className="form-group full-width">
//                 <button type="submit">Submit</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default page

"use client";

import React, { useEffect, useRef } from "react";
import { FaRegUser } from "react-icons/fa6";
import { IoMdAdd } from "react-icons/io";
import { CiCalendarDate } from "react-icons/ci";
import { MdOutlineWaterDrop } from "react-icons/md";
import { IoCallOutline } from "react-icons/io5";
import { RiLogoutCircleLine } from "react-icons/ri";
import { signOut } from "next-auth/react";
import { useUserStore } from "@/src/store/useUserStore";
import { useSidebarStore } from "@/src/store/useSidebarStore";
import { Input } from "@/components/ui/input";

const Page = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { clearUser } = useUserStore();
  const { setActiveItem } = useSidebarStore();

  useEffect(() => {
    setActiveItem("profile");
  }, []);

  const handleLogout = () => {
    signOut({ callbackUrl: "/patient/login" });
    clearUser();
  };

  return (
    <div className="flex flex-col lg:flex-row h-full lg:max-h-screen pr-7 xl:pl-15 lg:pr-0 w-full border border-gray-200 lg:overflow-y-hidden overflow-x-hidden overflow-y-auto ">
      {/* Profile Summary */}
      <div className="flex flex-col gap-4 m-4 lg:mr-0 w-full lg:w-1/3 h-auto lg:h-[96%] rounded-lg">
        {/* Profile Info */}
        <div className="flex flex-col items-center bg-[#ecf6f1] border-3 border-[#DBF4E3] shadow-[0_6px_30px_rgba(219,244,227,1)] rounded-lg w-full h-auto lg:h-2/3 p-4">
          {/* Header */}
          <div className="flex flex-col items-start gap-1 w-full  bg-[#EDF9EF] rounded-lg p-4 mb-2">
            <h1 className="text-2xl font-semibold text-[#1d9c54]">Patient Profile</h1>
            <p className="text-gray-600 font-normal">Manage your health information</p>
          </div>
          {/* Photo */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className=" w-[100px] h-[100px]  rounded-full bg-gray-300 border-5 border-white flex items-center justify-center cursor-pointer"
          >
            <IoMdAdd className="text-4xl text-gray-600" />
            <Input ref={fileInputRef} type="file" className="hidden" />
          </div>
          {/* Name & ID */}
          <div className="flex flex-col items-center gap-1  ">
            <h2 className="text-xl font-semibold text-[#1d9c54]">Ankit Gope</h2>
            <p className="text-[#018d32b2] font-normal">Patient ID: 123456HD-UKL</p>
          </div>
          {/* Basic Info */}
          <div className="flex flex-col gap-1 mt-1 text-[#018d32b2] font-semibold">
            <div className="flex items-center gap-2">
              <CiCalendarDate className="text-lg" />
              <span>Age: 30 years</span>
            </div>
            <div className="flex items-center gap-2">
              <MdOutlineWaterDrop className="text-lg" />
              <span>Blood Group: O+</span>
            </div>
            <div className="flex items-center gap-2">
              <IoCallOutline className="text-lg" />
              <span>Phone: +1234567890</span>
            </div>
            {/* <div className="flex items-center gap-2">
              <IoCallOutline className="text-lg" />
              <span>Phone: +1234567890</span>
            </div><div className="flex items-center gap-2">
              <IoCallOutline className="text-lg" />
              <span>Phone: +1234567890</span>
            </div> */}
          </div>
          {/* Logout Button */}
          {/* <button
            onClick={handleLogout}
            className="mt-7 flex items-center justify-center gap-2 bg-[#28a745dc] text-white border-3 border-[#DBF4E3] w-[90px] h-[40px] rounded-lg active:bg-[#218838] transition-colors"
          >
            <RiLogoutCircleLine className="text-lg" />
            <span>Log Out</span>
          </button> */}
        </div>

        {/* Latest Appointment */}
        <div className="bg-[#ecf6f1] border-3 border-[#DBF4E3] center flex-col shadow-[0_6px_30px_rgba(219,244,227,1)] rounded-lg w-full h-full  lg:h-1/3 p-2">
          <h2 className="text-lg font-medium text-[#1d9c54] mb-1">Your Latest Appointment</h2>
          <div className="flex items-center justify-center w-full h-full m-2 border border-[#DBF4E3] bg-gray-200 text-gray-600  rounded-md">
            No Latest Appointments
          </div>
        </div>
      </div>

      {/* Profile Form Box */}
      <div className="flex flex-col gap-0 m-4 w-full lg:w-2/3 h-auto lg:h-[96%] border-3 border-[#DBF4E3] shadow-[0_6px_30px_rgba(219,244,227,1)] rounded-lg p-3 overflow-auto">
        {/* Header */}
        <div className="p-3">
          <h2 className="text-xl font-semibold">Personal Information</h2>
          <p className="text-gray-600">Update your personal and health details</p>
        </div>
        <div className="w-full h-5px bg-[#DBF4E3] shadow-[0_6px_30px_rgba(219,244,227,227,1)] my-2"></div>
        {/* Form */}
        <div className="max-w-[900px] mx-0 bg-white rounded-lg shadow-md p-4">
          <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="flex flex-col gap-1">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FaRegUser className="text-green-600" />
                Full Name<span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                className="w-full  h-[20px] px-3 py-2 border border-[#DBF4E3] rounded-md focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Email<span className="text-red-500">*</span></label>
              <Input
                type="email"
                className="w-full  h-[20px] px-3 py-2 border border-[#DBF4E3] rounded-md focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>

            {/* Phone Number */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Phone Number<span className="text-red-500">*</span></label>
              <Input
                type="text"
                className="w-full  h-[20px] px-3 py-2 border border-[#DBF4E3] rounded-md focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>

            {/* Gender */}
            <div className="flex flex-col gap-1 text-gray-800">
              <label className="text-sm font-medium text-gray-700">Gender<span className="text-red-500">*</span></label>
              <select className="w-full text-gray-800  h-[33px] px-3  border border-[#DBF4E3] rounded-md focus:outline-none focus:ring-2 focus:ring-green-300">
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            {/* Date of Birth */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Date of Birth<span className="text-red-500">*</span></label>
              <Input
                type="date"
                className="w-full  h-[20px] px-3 py-2 border border-[#DBF4E3] rounded-md focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>


            {/* Blood Group */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Blood Group</label>
              <select className="w-full  h-[33px] px-3  border border-[#DBF4E3] rounded-md  focus:ring-2 focus:ring-green-300">
                <option>O+</option>
                <option>A+</option>
                <option>B+</option>
                <option>AB+</option>
                <option>Other</option>
              </select>
            </div>

            {/* Emergency Contact */}
            <div className="flex flex-col gap-1 sm:col-span-2">
              <label className="text-sm font-medium text-gray-700">Emergency Contact</label>
              <Input
                type="text"
                className="w-full h-[20px] px-3 py-2 border border-[#DBF4E3] rounded-md focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>

            {/* Address */}
            <div className="flex flex-col gap-1 sm:col-span-2">
              <label className="text-sm font-medium text-gray-700">Address</label>
              <textarea
                rows={4}
                className="w-full px-3 py-2 border border-[#DBF4E3] rounded-md focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>


            {/* Medical History */}
            <div className="flex flex-col gap-1 sm:col-span-2">
              <label className="text-sm font-medium text-gray-700">Medical History</label>
              <textarea
                rows={4}
                className="w-full px-3 py-2 border border-[#DBF4E3] rounded-md focus:outline-none focus:ring-2 focus:ring-green-300 resize-y"
              />
            </div>

            <div className="flex flex-col gap-2 col-span-full">
              <label className="text-sm font-semibold">Current Medications</label>
              <textarea className="w-full p-2 border-3 border-[#DBF4E3] rounded-md focus:outline-none resize-y" />
            </div>
            <div className="col-span-full ">
              <button
                type="submit"
                className="px-6 w-full cursor-pointer py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;