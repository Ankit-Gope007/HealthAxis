
import React from 'react'
import Image from 'next/image'
import loginImage from '@/public/images/loginPageImage.jpeg'
import './page.css'
import { signIn } from '@/auth'
import { useRouter } from 'next/navigation'

const page = () => {
    
   
  return (
    <div className="login-container">
    <div className="left-section">
      <Image src={loginImage} alt="Doctor" className="login-image" />
    </div>
    <div className="right-section">
      <div className="form-wrapper">
        <div className="tabs">
          <button className="login">Log in</button>
          <button className='signup'>Sign Up</button>
        </div>
        <p className="tagline">
          Your health journey starts here, <br />
          log in to connect, consult, and care.
        </p>
        <form action={async () => {
        "use server"
        await signIn("google");
        

      }}>
        <input type="email" placeholder="Your Email" className="email-input" />
        <button className="continue-btn">Continue</button>
        <div className="divider">
          <hr />
          <span>OR</span>
          <hr />
        </div>
        <button
        type ="submit"
         className="google-btn">Continue with Google</button>
     
        </form>
       </div>
    </div>
  </div>
  )
}

export default page