import React from 'react'
import { Button } from '@/components/ui/button'
import { FaArrowRight } from "react-icons/fa";
import { IoVideocamOutline } from "react-icons/io5";
import { FiUsers } from "react-icons/fi";
import { PiStethoscope } from "react-icons/pi";

const Hero = () => {
  return (
    <div className=' border-b-2 min-h-screen'>
        {/* Intro and small descrpition */}
        <div className='w-[100%] md:w-[50%] border h-screen flex flex-col justify-center items-center   '>
            {/* Heading + taglines */}
            <div className=' border w-[85%] '>
                <h1 className='text-8xl font-bold '>Your Health,</h1>
                <h1 className='text-8xl font-bold text-[#18AC4E]'>Reimagined</h1>
                <br />
                <p className='text-xl text-[#7c7c7c] font-medium'>Connect, consult, and care—seamlessly manage appointments, chats, and prescriptions in one smart health app.</p>
            
            </div>
            {/* Quick acess Button */}
            <div className='w-[85%] m-[20px] border h-[100px] flex justify-start items-center p-2 gap-5'>
                <Button className='w-[43%] h-[50px] text-xl bg-[#1A9646]'>Start Your Journey <FaArrowRight/> </Button>
                <Button className='w-[43%] h-[50px] text-xl text-black border-2 border-[#25b159bc] bg-white hover:text-[#18AC4E] hover:bg-[#18ac4e54] hover:border-[#6ac362]'> <IoVideocamOutline/> Watch Demo </Button>

            </div>
            {/* number of registration */}
            <div className='w-[85%] m-[20px] border h-[100px] flex justify-start items-center gap-5 pt-10 '>
                <div className=' h-full center flex-col m-10'>
                    <FiUsers className='text-4xl text-[#18AC4E]'/>
                    <h1 className='text-xl font-bold'>1000+</h1>
                    <p className='text-sm text-[#7c7c7c] font-medium'>Happy Pateints</p>
                </div>
                <div className=' h-full center flex-col'>
                    <PiStethoscope className='text-4xl text-[#18AC4E]'/>
                    <h1 className='text-xl font-bold'>500+</h1>
                    <p className='text-sm text-[#7c7c7c] font-medium'>Expert Doctors</p>
                </div>
            </div>
        </div>
        {/* Svg or any animation or app image or lottie */}
        <div className='hidden md:block md:w-[50%]'>

        </div>
    </div>
  )
}

export default Hero