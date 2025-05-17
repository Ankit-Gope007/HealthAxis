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
import { IoBackspace, IoMenu } from "react-icons/io5";
import { useRouter } from 'next/navigation';

const sidebar = ({ isSidebarOpen, setIsSidebarOpen }: { isSidebarOpen: boolean, setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();


  const navItems = [
    { icon: <FaRegUser className="green" />, label: 'Dashboard', link: 'dashboard' },
    { icon: <MdDateRange className="green" />, label: 'Appointments', link: 'appoinments' },
    { icon: <FaUserDoctor className="green" />, label: 'Doctors', link: 'doctors' },
    { icon: <GiMedicines className="green" />, label: 'Prescriptions', link: 'prescriptions' },
    { icon: <CiChat1 className="green" />, label: 'Chat', link: 'chat' },
  ];

  const handleClick = (index: number) => {
    setActiveIndex(index);
    setIsSidebarOpen(!isSidebarOpen);
    // Navigate to the corresponding page
    const selectedItem = navItems[index];
    if (selectedItem && selectedItem.link) {
      router.push(`/patient/${selectedItem.link}`);
    }
  };

  return (
    <>
      
      <div className='divider'></div>
      <div className={`sidebar ${isSidebarOpen ? "visible" : "invisible"}`}>
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