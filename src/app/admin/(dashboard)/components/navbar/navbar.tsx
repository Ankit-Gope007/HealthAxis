import React from 'react'
import './navbar.css';
import { FaHandHoldingMedical } from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";
import { IoMenu } from "react-icons/io5";

const navbar = ({ isSidebarOpen, setIsSidebarOpen }: { isSidebarOpen: boolean, setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
  return (
    <div className='heading'>
        <div className="backLogo" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <IoMdArrowBack /> : <IoMenu />}
        </div>
        <div className='logo'>
          <FaHandHoldingMedical />
        </div>
        Health Axis
      </div>
  )
}

export default navbar