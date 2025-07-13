'use client'
import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import Mini_hero from './components/mini_hero_1/Mini_hero'
import Features from './components/Features/Features'
import PatientLogin from './components/PatientLogin/PatientLogin'
import Testimonial from './components/Testimonial/Testimonial'
import DoctorLogin from './components/DoctorLogin/DoctorLogin'
import Footer from './components/Footer/Footer'
import { useRef } from 'react'


const page = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
  const doctorRef = useRef<HTMLDivElement>(null);
  const reviewRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  return (

    <div className='overflow-y-scroll h-screen scrollbar-hide'>
      <Navbar
        sections={{
          featuresRef,
          doctorRef,
          reviewRef,
          contactRef,
        }} />

      <Hero />
      <Mini_hero />
      <div ref={featuresRef}><Features /></div>
      <PatientLogin />
      <div ref={reviewRef}><Testimonial /></div>
      <div ref={doctorRef}><DoctorLogin /></div>
      <div ref={contactRef}><Footer /></div>

    </div>



  )
}

export default page