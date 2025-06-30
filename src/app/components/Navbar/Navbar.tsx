"use client";
import React from 'react';
import { FaHandHoldingMedical } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

type NavbarProps = {
  sections: {
    featuresRef: React.RefObject<HTMLDivElement| null>;
    doctorRef: React.RefObject<HTMLDivElement| null>;
    reviewRef: React.RefObject<HTMLDivElement| null>;
    contactRef: React.RefObject<HTMLDivElement| null>;
  };
};

const Navbar = ({ sections }: NavbarProps) => {
  const scrollToSection = (ref: React.RefObject<HTMLDivElement|null>) => {
    ref?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <motion.div
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 w-full z-50 shadow-2xl bg-white shadow-[#b2f7b5] h-[80px] text-white p-4 flex justify-between items-center"
    >
      {/* Logo And Title Part */}
      <div className='center w-[280px] border border-white gap-3'>
        <div className='center h-[50px] w-[50px] bg-[#0eac16] text-white text-3xl rounded-xl'>
          <FaHandHoldingMedical />
        </div>
        <div>
          <h1 className="text-3xl Poppins font-bold text-black">HealthAxis</h1>
        </div>
      </div>

      {/* Navigation Options */}
      <div className='gap-4 text-[#585858] h-full w-[450px] hidden md:flex md:justify-center md:items-center'>
        <div
          className='text-lg Poppins font-semibold cursor-pointer hover:text-[#0eac16]'
          onClick={() => scrollToSection(sections.featuresRef)}
        >
          Features
        </div>
        <div
          className='text-lg Poppins font-semibold cursor-pointer hover:text-[#0eac16]'
          onClick={() => scrollToSection(sections.doctorRef)}
        >
          For Doctor
        </div>
        <div
          className='text-lg Poppins font-semibold cursor-pointer hover:text-[#0eac16]'
          onClick={() => scrollToSection(sections.reviewRef)}
        >
          Review
        </div>
        <div
          className='text-lg Poppins font-semibold cursor-pointer hover:text-[#0eac16]'
          onClick={() => scrollToSection(sections.contactRef)}
        >
          Contact
        </div>
      </div>
    </motion.div>
  );
};

export default Navbar;