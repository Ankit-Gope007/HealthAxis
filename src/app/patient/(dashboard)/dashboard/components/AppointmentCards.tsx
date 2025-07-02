import React from 'react'
import Link from 'next/link';


type AppointmentDetailProps = {
    fullName: string;
    specialization: string;
    imageUrl?: string | "";
    appointmentDate: string;
    appointmentTime: string;
    status: string;
}

const AppointmentCards: React.FC<AppointmentDetailProps> = ({ fullName, specialization, imageUrl, appointmentDate, appointmentTime, status }) => {

    return (
        <div className='bg-white h-[180px] rounded-2xl shadow-lg'>
            <div className='w-[350px]'>
                {/* Image + doctor names */}
                <div className='flex items-center justify-between p-4'>
                    {/* Image */}
                    <div>
                        <img src={imageUrl} alt="Doctor" className="w-6 h-6 border-2 rounded-full" />
                    </div>
                    {/* Name + Type of Doctor */}
                    <div className=''>
                        <h3 className='text-lg font-semibold'>{fullName}</h3>
                        <p className='text-sm'>{specialization}</p>
                    </div>
                    {/* Appoinment Status */}
                    <div className={`text-xs font-semibold ${status === 'CONFIRMED' ? 'text-green-700 bg-green-300 border-2 border-green-500 rounded-2xl p-1' : status === 'PENDING' ? 'text-yellow-500 bg-yellow-300 border-2 border-yellow-500 rounded-2xl p-1' : 'text-red-500  bg-red-300 border-2 border-red-500 rounded-2xl p-1'}`}>
                        {/* Conditional rendering based on status */}   
                        {status === 'CONFIRMED' ? 'Confirmed' : status === 'PENDING' ? 'Pending' : 'Cancelled'}
                    </div>
                </div>
                {/* Divider */}
                <hr className='border-gray-300' />

                {/* date of Appoinments + view details */}
                <div className='center mt-1 gap-1 text-gray-600  '>
                    <p className='text-[10px] '>Date: {appointmentDate}</p>
                    <p>|</p>
                    <p className='text-[10px]'>Time: {appointmentTime}</p>
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