import React from 'react'
import './sidebar.css';
import { FaHandHoldingMedical } from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";
import { FaRegUser } from "react-icons/fa6";
import { MdDateRange } from "react-icons/md";
import { FaUserDoctor } from "react-icons/fa6";
import { GiMedicines } from "react-icons/gi";
import { CiChat1 } from "react-icons/ci";

const sidebar = () => {
  return (

    <div className='sidebar'>
      <div className='heading'>
        <div className="backLogo">
          <IoMdArrowBack />
        </div>
        <div className='logo'>
          <FaHandHoldingMedical />
        </div>
        Health Axis
      </div>
      <div className='divider'></div>


      <div className="list"><FaRegUser/> Dashboard</div>
      <div className="list"><MdDateRange /> Appoinments</div>
      <div className="list"><FaUserDoctor /> Doctors</div>
      <div className="list"><GiMedicines /> Prescriptions</div>
      <div className="list"><CiChat1 /> Chat</div>


    </div>
  )
}

export default sidebar