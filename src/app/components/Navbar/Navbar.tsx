"use client";
import React from 'react';
import { FaHandHoldingMedical } from "react-icons/fa";
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
      className="fixed top-0 left-0 w-full z-50 h-[80px] p-4 flex justify-between items-center border-b border-black/5 bg-white/80 backdrop-blur-md shadow-2xl shadow-[#b2f7b5] dark:bg-slate-950/70 dark:border-white/10"
    >
      {/* Logo And Title Part */}
      <div className='center w-[280px] gap-3'>
        <div className='center h-[50px] w-[50px] bg-[#0eac16] text-white text-3xl rounded-xl shadow-lg shadow-green-700/20'>
          <FaHandHoldingMedical />
        </div>
        <div>
          <h1 className="text-3xl Poppins font-bold text-black dark:text-slate-100">HealthAxis</h1>
        </div>
      </div>

      {/* Navigation Options */}
      <div className='gap-4 text-[#585858] h-full w-[450px] hidden md:flex md:justify-center md:items-center dark:text-slate-300'>
        <div
          className='text-lg Poppins font-semibold cursor-pointer transition-colors hover:text-[#0eac16]'
          onClick={() => scrollToSection(sections.featuresRef)}
        >
          Features
        </div>
        <div
          className='text-lg Poppins font-semibold cursor-pointer transition-colors hover:text-[#0eac16]'
          onClick={() => scrollToSection(sections.doctorRef)}
        >
          For Doctor
        </div>
        <div
          className='text-lg Poppins font-semibold cursor-pointer transition-colors hover:text-[#0eac16]'
          onClick={() => scrollToSection(sections.reviewRef)}
        >
          Review
        </div>
        <div
          className='text-lg Poppins font-semibold cursor-pointer transition-colors hover:text-[#0eac16]'
          onClick={() => scrollToSection(sections.contactRef)}
        >
          Contact
        </div>
      </div>
    </motion.div>
  );
};

export default Navbar;