"use client"
import React, { useEffect } from 'react'
import { useRef } from 'react';
import { FaRegUser } from "react-icons/fa6";
import { IoMdAdd } from "react-icons/io";
import { CiCalendarDate } from "react-icons/ci";
import { MdOutlineWaterDrop } from "react-icons/md";
import { IoCallOutline } from "react-icons/io5";
import { RiLogoutCircleLine } from "react-icons/ri";
import { signOut } from "next-auth/react";
// import './page.css';
import { useUserStore } from '@/src/store/useUserStore';
import { useSidebarStore } from '@/src/store/useSidebarStore';

const page = () => {
  const { setActiveItem } = useSidebarStore();
  // Set the active item to "profile" when this page is accessed
  useEffect(()=>{
    setActiveItem("profile");
  },[])
  

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { clearUser } = useUserStore();

  // Function to handle logout
  const handleLogout = () => {
    signOut({ callbackUrl: "/patient/login" }); // Redirect to login page after logout
    clearUser(); // Clear user data from the store
  }




  return (
    <div className='patient-profile-container'>
      <div className="profile-summary">
        <div className="profile-info">
          <div className="profile-info-header">
            <h1>Patient Profile</h1>
            <p>Manage your health information</p>
          </div>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="profile-info-photo">
            <IoMdAdd className='add-icon' />
            <input
              ref={fileInputRef}
              type="file"
              id="file-upload"
            />
          </div>
          <div className="profile-info-names">
            <h2 className=''>Ankit Gope</h2>
            <p>Patient ID: 123456HD-UKL</p>
          </div>
          <div className="profile-info-basicInfo">
            <div className="profile-info-basicInfo-info">
              <CiCalendarDate className='profile-info-basicInfo-logo' /> Age: 30 years
            </div>
            <div className="profile-info-basicInfo-info">
              <MdOutlineWaterDrop className='profile-info-basicInfo-logo' />Blood Group: O+
            </div>
            <div className="profile-info-basicInfo-info">
              <IoCallOutline className='profile-info-basicInfo-logo' />Phone: +1234567890
            </div>
          </div>
          <div
            onClick={handleLogout}
            className="logOut-btn">
            <RiLogoutCircleLine className='logOut-icon' />
            Log Out
          </div>

        </div>



        <div className="profile-data">
          <div className='profile-data-heading'>
            <h2>Your Latest Appoinment</h2>
          </div>
          <div className='profile-data-appoinment-list'>
            No Latest Appoinments
          </div>
        </div>
      </div>
      <div className="profile-box">
        <div className="profile-box-header">
          <h2 className=''>Personal Information</h2>
          <p>Update your personal and health details</p>
        </div>
        <div className="seperator">

        </div>
        <div className="profile-box-content">
          <div className="info">
            <form action="" className='form-grid'>
              <div className="form-group">
                <label><FaRegUser className='green' />  Full Name*</label>
                <input type="text" placeholder="" />
              </div>
              <div className="form-group">
                <label>Email*</label>
                <input type="email" placeholder="" />
              </div>
              <div className="form-group">
                <label>Phone Number*</label>
                <input type="text" placeholder="" />
              </div>
              <div className="form-group">
                <label>Gender*</label>
                <select>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Date of Birth*</label>
                <input type="date" />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input type="text" placeholder="" />
              </div>
              <div className="form-group">
                <label>Blood Group</label>
                <select>
                  <option>B+</option>
                  <option>A+</option>
                  <option>O+</option>
                  <option>AB+</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Emergency Contact</label>
                <input type="text" placeholder="" />
              </div>
              <div className="form-group full-width">
                <label>Medical History</label>
                <textarea placeholder=""></textarea>
              </div>
              <div className="form-group full-width">
                <label>Current Medications</label>
                <textarea></textarea>
              </div>

              <div className="form-group full-width">
                <button type="submit">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page