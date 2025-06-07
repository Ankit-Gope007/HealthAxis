import React from 'react'
import { cn } from '@/lib/utils';
import { DotPattern } from '@/src/components/magicui/dot-pattern';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FiUsers } from "react-icons/fi";
import { FaArrowRight } from "react-icons/fa6";


const PatientLogin = () => {
  return (
       <div className="h-[500px] md:h-[600px] bg-gradient-to-r from-green-600 to-emerald-600 relative flex size-full items-center justify-center flex-col overflow-hidden ">
          <DotPattern
            className={cn(
              "absolute inset-0 w-full h-full ",
    
            )}
            width={50}
            height={50}
            cx={1}
            cy={1}
            cr={3}
          />
          {/* heading and Tagline */}
          <div className='w-full flex-col center z-2 text-center '>
            <h1 className='text-4xl md:text-6xl font-bold text-white '>Ready to transform your health</h1>
            <h1 className='text-4xl md:text-6xl font-bold text-white '>journey?</h1>
            <p className='text-white font-medium text-center mt-2 mx-1 md:mx-0' >Join over 500 patients who trust HealthAxis for their healthcare needs.<br/> Experience the future of healthcare today.</p>
          </div>
          {/* Login Buttons */}
          <div className=' w-full  center z-2 mt-4 gap-5 flex flex-col md:flex-row'>
            <Button className='bg-white cursor-pointer text-green-600 w-[270px]  hover:bg-green-600 hover:text-white hover:border-2 hover:border-white transition-all duration-300 px-6 py-3 h-[50px] rounded-xl'>
                <FiUsers className='text-[20px]'/><Link href="/patient/login" className=' font-bold text-lg'>Login as Patient</Link><FaArrowRight/>
            </Button>
             <Button className='bg-white text-green-600 hover:bg-green-600 w-[270px] hover:text-white hover:border-2 hover:border-white transition-all duration-300 px-6 py-3 h-[50px]  rounded-xl'>
                <Link href="/patient/login" className=' font-bold text-lg'>Watch a Demo</Link>
            </Button>
          </div>
    </div>
  )
}

export default PatientLogin