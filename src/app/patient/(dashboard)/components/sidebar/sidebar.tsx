"use client"
import React from 'react'
import { useState } from 'react';
import './sidebar.css';
import { FaHandHoldingMedical } from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";
import { FaRegUser } from "react-icons/fa6";
import { MdDateRange } from "react-icons/md";
import { FaUserDoctor } from "react-icons/fa6";
import { GiMedicines } from "react-icons/gi";
import { CiChat1 } from "react-icons/ci";
import { IoMenu } from "react-icons/io5";

const sidebar = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);


  const navItems = [
    { icon: <FaRegUser className="green" />, label: 'Dashboard' },
    { icon: <MdDateRange className="green" />, label: 'Appointments' },
    { icon: <FaUserDoctor className="green" />, label: 'Doctors' },
    { icon: <GiMedicines className="green" />, label: 'Prescriptions' },
    { icon: <CiChat1 className="green" />, label: 'Chat' },
  ];

  const handleClick = (index: number) => {
    setActiveIndex(index);
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <div className='sidebar'>
        <div className='heading'>
          <div className="backLogo" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <IoMdArrowBack /> : <IoMenu />}
          </div>
          <div className='logo'>
            <FaHandHoldingMedical />
          </div>
          Health Axis
        </div>
        <div className='divider'></div>
        <div className={` ${isSidebarOpen ? 'menu' : 'menu-hidden'}`}>
          {navItems.map((item, index) => (
            <div
              key={index}
              className={`list ${activeIndex === index ? 'active' : ''}`}
              onClick={() => handleClick(index)}
            >
              {item.icon} {item.label}
            </div>
          ))}

        </div>



      </div>
    </>
  )
}

export default sidebar