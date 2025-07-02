"use client";
import React from "react";
import { CiCalendar } from "react-icons/ci";
import { CiClock2 } from "react-icons/ci";
import { Button } from "@/components/ui/button";
import { GoArrowRight } from "react-icons/go";
import Link from "next/link";

interface UpcomingAppProps {
  id: string;
  doctorName: string;
  specialty: string;
  imageUrl: string;
  date: string;
  time: string;
  location: string;
  reason?: string;
  status: string;
}
import axios from "axios";
import  toast ,{Toaster} from "react-hot-toast";



const UpcomingAppointments: React.FC<UpcomingAppProps> = ({
  id,
  doctorName,
  specialty,
  imageUrl,
  date,
  time,
  location,
  reason,
  status,
}) => {

  const handleCancleAppointment = async () => {
    toast((t) => (
      <div className="text-sm p-3">
        <p className="font-semibold text-red-600">⚠️ Reject Dr. {doctorName}?</p>
        <p className="text-xs text-gray-600 mt-1">
          This will permanently cancle the appointment with Dr. {doctorName}. Are you sure you want to proceed?
        </p>
        <div className="mt-3 flex justify-end gap-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const rejection = await axios.delete(`/api/appointment/delete?appointmentId=${id}`);
                if (rejection.status !== 200) {
                  throw new Error("Rejection failed");
                }
                toast.success(`🗑️ Dr. ${doctorName}'s Appointment has been cancelled`, {
                  duration: 3000,
                  position: "top-right",
                  style: {
                    background: "#DC3545",
                    color: "#fff",
                  },
                });
                setTimeout(() => {
                  window.location.reload();
                }, 3000); // Optional delay before reloading
                
              } catch (error) {
                toast.error(`❌ Failed to reject Dr. ${doctorName}`, {
                  duration: 3000,
                  position: "top-right",
                  style: {
                    background: "#DC3545",
                    color: "#fff",
                  },
                });
              }
            }}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
          >
            Confirm
          </button>
        </div>
      </div>
    ), { duration: 10000 });
  }



  return (
    <div className="bg-white rounded-xl shadow-lg p-2 flex flex-col md:flex-row items-start md:items-center w-full   max-w-6xl">
      {/* Left Section: Doctor Info */}
      <Toaster position="top-right" reverseOrder={false} />
      <div className="flex center  w-full pt-2 flex-col  h-full items-center justify-center md:items-start md:w-1/4 mb-6 md:mb-0 md:pr-6 bg-[#F9FAFB] pb-6 md:pb-0">
        {/* Doctor Image */}
        {
          imageUrl ? (
            <img
              src={imageUrl}
              alt={doctorName}
              className="w-24 h-24 rounded-full object-cover mb-2"
            />
          ) : (
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-2">
              {/* Break the name and get the initials */}
              <span className="text-gray-500 text-2xl">
                {doctorName.split(" ").map((n) => n[0]).join(" ")}
              </span>
            </div>
          )
        }
        {/* Doctor Name */}
        <h3 className="text-lg font-semibold text-gray-800 text-center md:text-left">{doctorName}</h3>
        {/* Specialty */}
        <p className="text-sm text-gray-600 text-center md:text-left">{specialty}</p>
      </div>

      {/* Right Section: Appointment Details and Actions */}
      <div className="flex-1 md:pl-6 w-full">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
          {/* Date and Time */}
          <div className="flex items-center text-gray-700 mb-1 sm:mb-0">
            {/* Calendar Icon */}
            <CiCalendar className="text-xl font-bold mr-1" />
            <span className="font-medium text-gray-800">{date}</span>
            {/* Clock Icon */}
            <CiClock2 className="text-xl font-bold ml-4 mr-1" />
            <span className="font-medium text-gray-800">{time}</span>
          </div>
          {/* Status Tag */}
          <span
            className={`px-3 py-1 text-center rounded-full text-xs font-semibold ${status === 'CONFIRMED'
              ? 'bg-green-100 text-green-800'
              : status === 'PENDING'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
              }`}
          >
            {status}
          </span>
        </div>

        {/* Location */}
        <div className="mb-2">
          <p className="text-sm text-gray-500 mb-1">Location</p>
          <p className="text-base text-gray-800 font-medium">{location}</p>
        </div>

        {/* reason */}
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-1">reason</p>
          <p className="text-base text-gray-800 font-medium">{reason}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          {
            status === 'PENDING' && (
              <Button
                onClick={handleCancleAppointment}
                className="py-1 h-[50px] border-1 bg-red-100 text-red-700 rounded-sm hover:bg-red-200 transition-colors duration-200 active:shadow-sm flex items-center justify-center text-sm font-medium">
                Cancel Appointment
              </Button>
            )
          }
          {
            status === 'CONFIRMED' && (
              <Button className="py-1 h-[50px] border-1 bg-blue-100 text-blue-700 rounded-sm hover:bg-blue-200 transition-colors duration-200 active:shadow-sm flex items-center justify-center text-sm font-medium">
                Message Doctor
              </Button>
            )
          }
          <Button className=" py-1 h-[50px] border-1  bg-gray-100 text-gray-700 rounded-sm hover:bg-gray-200 transition-colors duration-200 active:shadow-sm flex items-center justify-center text-sm font-medium">
           <Link href= {`/patient/appointments/details/${id}`} className="flex items-center">
              View Details
           </Link>
            {/* Right Arrow Icon */}
            <GoArrowRight className="ml- text-sm" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UpcomingAppointments;