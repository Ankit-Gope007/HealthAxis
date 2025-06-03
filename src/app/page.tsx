"use client"
import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'

const Page = () => {
  return (
    <div className="relative min-h-screen">
      
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <Navbar />
      </div>

      {/* Page Content with top padding to prevent overlap */}
      <div className="pt-20"> {/* Adjust padding-top based on Navbar height */}
        <Hero />
        <Hero />
        <Hero />
        <Hero />
      </div>
    </div>
  );
}

export default Page;