"use client";
import React,{use, useEffect} from 'react'
import './page.css';
import { useSidebarStore } from '@/src/store/useSidebarStore';

const page = () => {
  const { setActiveItem } = useSidebarStore();
  // useEffect(() => {
  //   setActiveItem("appointment"); // Set the active sidebar item to "appointments"
  // }, []);
  return (
    <div className='w-full lg:w-[90%] lg:ml-14 h-[100vh] bg-indigo-500'>Appionment Page</div>
  )
}

export default page