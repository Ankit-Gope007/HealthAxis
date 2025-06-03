"use client"
import React from 'react'
import { FaHandHoldingMedical } from "react-icons/fa";
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const router = useRouter();
  return (
    <div className="shadow-2xl shadow-[#b2f7b5] max-w-screen h-[80px] text-white p-4 flex justify-between items-center">
      {/* Logo And Title Part */}
      <div className='center w-[280px] border border-white gap-3'>
        <div className='center h-[50px] w-[50px] bg-[#0eac16] text-white text-3xl rounded-xl'>
          <FaHandHoldingMedical />
        </div>
        <div>
          <h1 className="text-3xl Poppins  font-bold text-black">HealthAxis</h1>
        </div>

      </div>

    {/* Navigation Options */}
    
      <div className='gap-4 text-[#585858]  h-full w-[450px] hidden md:flex md:justify-center md:items-center'>
        <div className='text-lg Poppins font-semibold cursor-pointer hover:text-[#0eac16]'>Features</div>
        <div className='text-lg Poppins font-semibold cursor-pointer hover:text-[#0eac16]'>For Doctor</div>
        <div className='text-lg Poppins font-semibold cursor-pointer hover:text-[#0eac16]'>Review</div>
        <div className='text-lg Poppins font-semibold cursor-pointer hover:text-[#0eac16]'>Contact</div>
      </div>

    </div>
  )
}

export default Navbar