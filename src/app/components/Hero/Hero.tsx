
"use client";

import React, { useRef } from "react";
import { Button } from '@/components/ui/button';
import { FaArrowRight } from "react-icons/fa";
import { IoVideocamOutline } from "react-icons/io5";
import { FiUsers } from "react-icons/fi";
import { PiStethoscope } from "react-icons/pi";
import heroAnimation from '@/src/animation/HeroPageAnimation';
import { motion, useInView } from "framer-motion";

// Animation variant
const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut"
        }
    }
};

const Hero = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <div className='border-b-2 h-screen lg:pt-[80px] flex' ref={ref}>
            {/* Intro and small description */}
            <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className='w-[100%] md:w-[50%] mt-5 md:mt-0 flex flex-col justify-center items-center'
            >
                {/* Heading + taglines */}
                <div className='w-[85%]'>
                    <h1 className='text-5xl lg:text-6xl xl:text-8xl font-bold'>Your Health,</h1>
                    <h1 className='text-5xl lg:text-6xl xl:text-8xl font-bold text-[#18AC4E]'>Reimagined</h1>
                    <br />
                    <p className='text-md md:text-lg xl:text-xl text-[#7c7c7c] font-medium'>
                        Connect, consult, and care—seamlessly manage appointments, chats, and prescriptions in one smart health app.
                    </p>
                </div>

                {/* Quick access Button */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    transition={{ delay: 0.2 }}
                    className='w-[85%] mt-3 flex-col lg:flex-row flex justify-start items-center gap-3 lg:gap-5'
                >
                    <Button className='cursor-pointer w-full flex justify-center items-center lg:w-[45%] h-[50px] text-xl md:text-sm lg:text-lg xl:text-xl bg-[#1A9646]'>
                        Start Your Journey <FaArrowRight />
                    </Button>
                    <Button className='cursor-pointer w-full flex justify-center items-center lg:w-[45%] h-[50px] text-xl md:text-sm lg:text-lg xl:text-xl text-black border-2 border-[#25b159bc] bg-white hover:text-[#18AC4E] hover:bg-[#18ac4e54] hover:border-[#6ac362]'>
                        <IoVideocamOutline /> Watch Demo
                    </Button>
                </motion.div>

                {/* number of registration */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    transition={{ delay: 0.4 }}
                    className='w-[85%] flex justify-start items-center gap-5 mt-3'
                >
                    <div className='h-full center flex-col'>
                        <FiUsers className='text-4xl text-[#18AC4E]' />
                        <h1 className='text-xl font-bold'>1000+</h1>
                        <p className='text-sm text-[#7c7c7c] font-medium'>Happy Patients</p>
                    </div>
                    <div className='h-full center flex-col'>
                        <PiStethoscope className='text-4xl text-[#18AC4E]' />
                        <h1 className='text-xl font-bold'>500+</h1>
                        <p className='text-sm text-[#7c7c7c] font-medium'>Expert Doctors</p>
                    </div>
                </motion.div>
            </motion.div>

            {/* Svg or any animation or app image or lottie */}
            <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                transition={{ delay: 0.6 }}
                className='hidden md:flex md:w-[50%]'
            >
                <div className='flex justify-center items-center w-full text-4xl'>
                    {heroAnimation()}
                </div>
            </motion.div>
        </div>
    );
};

export default Hero;