

import React from "react";
import toast, { Toaster } from "react-hot-toast";
import Form from "./components/Form";
import ProfileInfo from "./components/ProfileInfo";

const Page = () => {

  return (
    <div className="flex flex-col lg:flex-row h-full lg:max-h-screen pr-7 xl:pl-15 lg:pr-0 w-full border border-gray-200 lg:overflow-y-hidden overflow-x-hidden overflow-y-auto ">
      {/* Profile Summary */}
      <Toaster />
      <div className="flex flex-col gap-4 m-4 lg:mr-0 w-full lg:w-1/3 h-auto lg:h-[96%] rounded-lg">
        {/* Profile Info */}
        <div className="flex flex-col items-center bg-[#ecf6f1] border-3 border-[#DBF4E3] shadow-[0_6px_30px_rgba(219,244,227,1)] rounded-lg w-full h-auto lg:h-2/3 p-4">
          <ProfileInfo />
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
        {/* Form */}
        <div className="max-w-[900px] mx-0 bg-white rounded-lg shadow-md p-4">
          <Form />
        </div>
      </div>
    </div>
  );
};

export default Page;