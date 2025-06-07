"use client";
import { cn } from "@/lib/utils";
import { DotPattern } from "@/src/components/magicui/dot-pattern";
import { FiUsers } from "react-icons/fi";
import { FaStethoscope } from "react-icons/fa6";
import { BsGraphUpArrow } from "react-icons/bs";
import { FaRegStar } from "react-icons/fa";
import CountUp from "./components/CountUp"


const Mini_hero = () => {
  return (
    <div className="h-[500px] md:h-[300px] bg-gradient-to-r from-green-600 to-emerald-600 relative flex size-full items-center justify-center overflow-hidden ">
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
    
      <div className="w-full max-w-6xl z-10 grid grid-cols-2 md:grid-cols-4 gap-6">
        {/* Card */}
        {[
          {
            icon: <FiUsers className="text-4xl text-white " />,
            value: 500,
            suffix: "+",
            label: "Happy Patients",
            duration: 1,
          },
          {
            icon: <FaStethoscope className="text-4xl text-white " />,
            value: 50,
            suffix: "+",
            label: "Expert Doctors",
            duration: 2,
          },
          {
            icon: <BsGraphUpArrow className="text-4xl text-white " />,
            value: 99,
            suffix: "%",
            label: "Uptime",
            duration: 1,
          },
          {
            icon: <FaRegStar className="text-4xl text-white" />,
            value: 4,
            suffix: "/5",
            label: "Average Rating",
            duration: 1,
          },
        ].map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center gap-3 bg-transparent"
          >
            <div className="w-[70px] h-[70px] flex items-center justify-center  bg-[#58B574] rounded-xl">
              {item.icon}
            </div>
            <div className="flex flex-col items-center justify-center text-center">
              <h1 className="text-3xl font-bold text-white">
                <CountUp
                  from={0}
                  to={item.value}
                  duration={item.duration}
                  className="count-up-text"
                />
                {item.suffix}
              </h1>
              <p className="text-base text-white font-light">{item.label}</p>
            </div>
          </div>
        ))}
      </div>


    </div>


  );
}
export default Mini_hero;
