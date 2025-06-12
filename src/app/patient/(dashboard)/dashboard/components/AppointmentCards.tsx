import React from 'react'
import Link from 'next/link';

type Status = {
    status: string;
    bgColor: string;
    textColor: string;
}

const AppointmentCards = () => {
    const appointmentStatus: Status[] = [
        { status: 'Pending', bgColor: 'bg-yellow-300', textColor: 'text-yellow-800' },
        { status: 'Confirmed', bgColor: 'bg-green-300', textColor: 'text-green-800' },
        { status: 'Cancelled', bgColor: 'bg-red-300', textColor: 'text-red-800' },
    ];
    return (
        <div className='bg-white h-[180px] rounded-2xl shadow-lg'>
            <div className='w-[350px]'>
                {/* Image + doctor names */} 
                <div className='flex items-center justify-between p-4'>
                    {/* Image */}
                    <div>
                        <img src="https://via.placeholder.com/150" alt="Doctor" className="w-6 h-6 border-2 rounded-full" />
                    </div>
                    {/* Name + Type of Doctor */}
                    <div className=''>
                        <h3 className='text-lg font-semibold'>Dr. John Doe</h3>
                        <p className='text-sm'>Cardiologist</p>
                    </div>
                    {/* Appoinment Status */}
                    <div className={`px-2  rounded-full text-sm shadow-sm ${appointmentStatus[0].bgColor} ${appointmentStatus[0].textColor}`}>
                            {appointmentStatus[0].status}
                    </div>
                </div>
                {/* Divider */}
                <hr className='border-gray-300' />

                {/* date of Appoinments + view details */}
                <div className='center mt-1 gap-1 text-gray-600  '>
                    <p className='text-[12px] '>Date: 2023-10-01</p>
                    <p>|</p>
                    <p className='text-[12px]'>Time: 10:00 AM</p>
                    <Link
                        href="/patient/appointments"
                        className='text-blue-500 hover:underline text-sm ml-3'
                    >View Details</Link>
                </div>

            </div>
        </div>
    )
}

export default AppointmentCards