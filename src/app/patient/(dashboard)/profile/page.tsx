import React from 'react'
import { FaRegUser } from "react-icons/fa6";
import './page.css';

const page = () => {
  return (
    <div className='patient-profile-container'>
      <div className="profile-summary">
        <div className="profile-info">

        </div>
        <div className="profile-data">

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
                <label><FaRegUser className='green'/>  Full Name*</label>
                <input type="text" placeholder="John Doe" />
              </div>
              <div className="form-group">
                <label>Email*</label>
                <input type="email" placeholder="john.doe@example.com" />
              </div>
              <div className="form-group">
                <label>Phone Number*</label>
                <input type="text" placeholder="123-456-7890" />
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
                <input type="text" placeholder="123 Health St, Medical City" />
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
                <input type="text" placeholder="Jane Doe (Wife) - 098-765-4321" />
              </div>
              <div className="form-group full-width">
                <label>Medical History</label>
                <textarea placeholder="No known allergies"></textarea>
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