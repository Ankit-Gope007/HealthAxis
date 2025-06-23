"use client"

import React from 'react'
import { Button } from "@/components/ui/button";
import { useSidebarStore } from '@/src/store/useSidebarStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type SidebarButtonProps = {
    icon: React.ReactNode;
    label: string;
    link: string;
};

const SidebarButton: React.FC<SidebarButtonProps> = ({ icon, label, link }) => {
    const router = useRouter();
    const { activeItem, setActiveItem } = useSidebarStore()

    const handleNavigation = (label: String, link: String) => {
        if (activeItem === label) return; // Prevent navigation if the item is already active
        setActiveItem(label); // Update the active item in the store
        router.push(`/admin/${link}`); // Navigate to the new link
    }
    return (
        <Button
            variant="ghost"
            className={`w-full justify-start text-sm font-medium cursor-pointer  px-2 py-1.5 rounded-lg transition-colors ${activeItem === label ? 'bg-[#28A745] text-white' : ' text-gray-700'}`}
            onClick={() => handleNavigation(label, link)}
        >
            <Link
                href={`/patient/${link}`}
                className="flex items-center space-x-3 text-sm  transition-colors font-medium px-2 py-1.5 rounded-lg "
            >
                <div className={`${activeItem === label ? 'text-white' : 'text-[#28A745]'} text-lg`}>
                    {icon}
                </div>
                
                <span>{label}</span>
            </Link>
        </Button>
    )
}

export default SidebarButton