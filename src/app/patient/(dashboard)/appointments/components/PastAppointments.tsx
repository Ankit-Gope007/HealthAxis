
import React from "react";
import { CiCalendar } from "react-icons/ci";
import { CiClock2 } from "react-icons/ci";
import { getStatusStyle } from "@/src/lib/statusStyle";

interface PastAppProps {
  id: string;
  doctorName: string;
  specialty: string;
  imageUrl: string;
  date: string;
  time: string;
  location: string;
  notes?: string;
  status: string;
  reason?: string;
}


const PastAppointments: React.FC<PastAppProps> = ({
  doctorName,
  specialty,
  imageUrl,
  date,
  time,
  location,
  notes,
  status,
  id,
  reason = "No reason provided",

}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-2 flex flex-col md:flex-row items-start md:items-center w-full   max-w-6xl">
      {/* Left Section: Doctor Info */}
      <div className="flex center w-full pt-2 flex-col  h-full items-center justify-center md:items-start md:w-1/4 mb-6 md:mb-0 md:pr-6 bg-[#F9FAFB] pb-6 md:pb-0">
        {/* Doctor Image */}
        <img
          src={imageUrl}
          alt={doctorName}
          className="w-10 h-10 rounded-full  object-cover mb-4 shadow-md"
         
        />
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
            <CiCalendar className="text-xl font-bold mr-1"/>
            <span className="font-medium text-gray-800">{date}</span>
            {/* Clock Icon */}
            <CiClock2 className="text-xl font-bold ml-4 mr-1"/>
            <span className="font-medium text-gray-800">{time}</span>
          </div>
          {/* Status Tag */}
          <span
            className={`px-3 py-1 text-center rounded-full text-xs font-semibold ${getStatusStyle(status)}`}
          >
            {status}
          </span>
        </div>

        {/* Location */}
        <div className="mb-2">
          <p className="text-sm text-gray-500 mb-1">Location</p>
          <p className="text-base text-gray-800 font-medium">{location}</p>
        </div>

        {/* Reason */}
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-1">Reason For the Visit</p>
          <p className="text-base text-gray-800 font-medium">{reason}</p>
        </div>
        {/* Notes */}
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-1">Doctor's Notes</p>
          <p className="text-base text-gray-800 font-medium">{notes}</p>
        </div>

       
      </div>
    </div>
  );
};

export default PastAppointments;