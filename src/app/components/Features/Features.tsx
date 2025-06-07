
import React from 'react'
import { HiOutlineBolt } from "react-icons/hi2";
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { CiCalendar } from "react-icons/ci";
import { IoChatbubbleOutline } from "react-icons/io5";
import { FaRegFileAlt } from "react-icons/fa";
import { CiStar } from "react-icons/ci";
import { CiSearch } from "react-icons/ci";
import { MdOutlineVerifiedUser } from "react-icons/md";
import { GrSecure } from "react-icons/gr";
import { MdOutlineMobileFriendly } from "react-icons/md";
import { RiMedalLine } from "react-icons/ri";
import { FaRegClock } from "react-icons/fa";

const Features = () => {
    const features = [
        {
            icon: <CiCalendar className='text-5xl text-white' />,
            title: "Easy Appointment Booking",
            description: "Patients can book a doctor visit, and doctors can approve it with automatic reminders added to your calendar.",
            color: "from-green-500 to-green-600"
        },
        {
            icon: <IoChatbubbleOutline className='text-5xl text-white' />,
            title: "Chat & Video Consultations",
            description: "Talk to your doctor through chat or video calls, all from within the app.",
            color: "from-blue-500 to-blue-600"
        },
        {
            icon: <FaRegFileAlt className='text-5xl text-white' />,
            title: "Organized Health Records",
            description: "Doctors can clearly view your prescriptions and notes separately, so nothing gets missed.",
            color: "from-emerald-500 to-emerald-600"
        },
        {
            icon: <CiStar className='text-5xl text-white' />,
            title: "Doctor Reviews",
            description: "See ratings and reviews from other patients to help you choose the right doctor.",
            color: "from-teal-500 to-teal-600"
        },
        {
            icon: <CiSearch className='text-5xl text-white' />,
            title: "Smart Search & Filters",
            description: "Quickly find doctors or past appointments using easy filters.",
            color: "from-pink-500 to-pink-600"
        },
        {
            icon: <MdOutlineVerifiedUser className='text-5xl text-white' />,
            title: "Verified Contacts Only",
            description: "You can connect with doctors only if you've had an appointment with them, keeping your contacts clean and relevant.",
            color: "from-indigo-500 to-indigo-600"
        }
    ];
    const whyUs = [
        
            {
                title: "Comprehensive Care",
                description: "From booking to video calls, all your health needs in one place.",
                icon: <GrSecure className='text-3xl text-[#17A34A]' />
            },
            {
                title: "User-Friendly Interface",
                description: "Simple design that’s easy for anyone to use.",
                icon:  <MdOutlineMobileFriendly className='text-3xl text-[#17A34A]' />
            },
            {
                title: "Expert Team",
                description: "Trusted doctors and professionals at your service.",
                icon:  <RiMedalLine className='text-3xl text-[#17A34A]' />
            },
            {
                title: "24/7 Support",
                description: "Help is always available, anytime you need it.",
                icon:  <FaRegClock className='text-3xl text-[#17A34A]' />
            }
        
    ]
    return (
        <div className='w-full min-h-screen flex flex-col items-center justify-start white border relative overflow-hidden'>
            {/* banner */}
            <div className='border w-[200px] h-[40px] mt-10 bg-[#DCFCE7] center gap-1 rounded-full shadow-2xl font-bold text-[#17803D]'>
                <HiOutlineBolt className='font-bold te' />
                <p>Powerful Features</p>
            </div>
            {/* heading and Tagline */}
            <div className='center flex-col mt-4'>
                <h1 className='text-3xl sm:text-5xl md:text-6xl font-bold'>Everything you need for</h1>
                <h1 className='text-4xl sm:text-5xl md:text-6xl font-bold text-[#119D56]'>better health</h1>
                <p className='text-center mt-3 text-[#4B5563] font-medium'>Our comprehensive platform brings together cutting-edge technology and healthcare<br /> expertise to provide you with the best possible care.</p>
            </div>
            {/* features */}
            <div className="grid mx-7 mt-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
                {features.map((feature, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        whileHover={{ y: -10, scale: 1.02 }}
                        className="group"
                    >
                        <Card className="border-0 flex shadow-xl hover:shadow-2xl md:h-[300px] transition-all duration-500  bg-white group-hover:bg-gradient-to-br group-hover:from-white group-hover:to-green-25 backdrop-blur-sm">
                            <CardContent className=" text-center">
                                <div className={`bg-gradient-to-r ${feature.color} mt-0 group-hover:scale-110 transition-transform p-2 rounded-3xl inline-flex items-center justify-center mb-3 shadow-lg`}>
                                    <div className="text-white">
                                        {feature.icon}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold  text-gray-900">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Why choose us */}
            <div>
                <div className='w-full '>
                    <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold text-center'>Why Choose HealthAxis?</h1>
                </div>
            </div>
            <div className='grid mx-7 mt-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16 '>
                {
                    whyUs.map((item, index) => (
                        <div className=' h-[150px] w-[250px] flex flex-col items-center justify-center gap-2 ' key={index}>
                            <div className='w-[50px] h-[50px] flex items-center justify-center bg-[#DCFCE7] rounded-full'>
                                {item.icon}
                            </div>
                            <div className='flex flex-col items-center justify-center text-center'>
                                <h1 className='text-lg font-bold text-gray-900'>{item.title}</h1>
                                <p className='text-gray-600 text-sm'>{item.description}</p>
                            </div>
                        </div>
                    ))
                }

            </div>
        </div>
    )
}

export default Features