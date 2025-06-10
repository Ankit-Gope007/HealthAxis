
import React from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import SidebarButton from './components/SidebarButton';


import { FaHandHoldingMedical } from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";
import { FaRegUser } from "react-icons/fa6";
import { MdDateRange } from "react-icons/md";
import { FaUserDoctor } from "react-icons/fa6";
import { GiMedicines } from "react-icons/gi";
import { CiChat1 } from "react-icons/ci";
import { IoBackspace, IoMenu } from "react-icons/io5";
import { User2 } from "lucide-react";
import { ChevronUp } from "lucide-react";
import Link from 'next/link';



const sidebar = () => {

  const navItems = [
    { icon: <FaRegUser className=" h-4 w-4" />, label: 'Dashboard', link: 'dashboard' },
    { icon: <MdDateRange className=" h-4 w-4" />, label: 'Appointments', link: 'appointments' },
    { icon: <FaUserDoctor className=" h-4 w-4" />, label: 'Doctors', link: 'doctors' },
    { icon: <GiMedicines className=" h-4 w-4" />, label: 'Prescriptions', link: 'prescriptions' },
    { icon: <CiChat1 className=" h-4 w-4" />, label: 'Chat', link: 'chat' },
  ];

  return (
    <Sidebar className="bg-white shadow-md border-r w-[27vw] lg:w-40">
      <SidebarContent className="">
        <SidebarGroup>
          <SidebarHeader className='border-b  flex items-center justify-between'>
            <SidebarGroupLabel className="flex items-center space-x-2">
              <div className="bg-[#28A745] text-white p-2 rounded-xl">
                <FaHandHoldingMedical className="text-2xl" />
              </div>
              <span className="font-semibold text-lg tracking-wide text-gray-800">Health Axis</span>
            </SidebarGroupLabel>
          </SidebarHeader>
          {/* <div className='w-full m-0 h-[1px] bg-gray-500' /> */}

          <SidebarGroupContent className="mt-2">
            <SidebarMenu className="space-y-1">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  {/* <SidebarMenuButton
                    asChild> */}
                    <SidebarButton
                      icon={item.icon}
                      label={item.label}
                      link={item.link}
                    />
                  {/* </SidebarMenuButton> */}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="flex items-center justify-between w-full text-sm font-medium text-gray-700 hover:bg-[#f6fff8] px-2 py-2 rounded-lg transition-colors">
                  <div className="flex items-center space-x-2">
                    <User2 className="h-4 w-4 text-[#28A745]" />
                    <span>Username</span>
                  </div>
                  <ChevronUp className="h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width] shadow-lg border rounded-md">
                <DropdownMenuItem className="px-3 py-2 text-sm text-gray-700 hover:bg-[#f6fff8]">
                  <span><Link href={"/patient/profile"} >Profile</Link></span>
                </DropdownMenuItem>
                <DropdownMenuItem className="px-3 py-2 text-sm text-gray-700 hover:bg-[#f6fff8]">
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default sidebar

