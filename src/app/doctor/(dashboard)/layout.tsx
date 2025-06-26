import Sidebar from './components/sidebar/sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { SessionProvider } from 'next-auth/react'
import { FaHandHoldingMedical } from "react-icons/fa";
import { User2 } from "lucide-react";
import UserImage from './components/UserImage';

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <main className="flex h-screen bg-gray-50 overflow-y-scroll">
            <SessionProvider>
                <SidebarProvider>
                    <Sidebar />
                    <div className="flex-1 flex w-full md:w-[60vw] flex-col h-full overflow-y-auto overflow-x-hidden"> {/* Main content wrapper */}
                        {/* Header for small screens to house the SidebarTrigger and potentially a logo */}
                        <div className="md:hidden flex items-center justify-between p-0 bg-white shadow-sm border-b">
                            <SidebarTrigger className="text-2xl text-gray-700" /> {/* Hamburger icon */}
                            <div className="flex items-center">
                                <div className="bg-[#28A745] text-white p-2 rounded-2xl flex items-center justify-center mr-2">
                                    <FaHandHoldingMedical className="text-xl" /> 
                                </div>
                                <span className="text-lg font-semibold text-gray-800">Health Axis</span>
                            </div>
                            {/* User Profile picture */}
                            <div className="w-6 h-6 m-1 rounded-full bg-gray-200 flex items-center justify-center">
                                {/* <User2 className="w-4 h-4  text-gray-500" />  */}
                                <UserImage />
                            </div>
                        </div>
                        {/* Main Page content area */}
                        <div className="flex-1 min-h-[180vh] sm:min-h-[150vh] lg:min-h-screen p-1  flex flex-col items-center overflow-x-hidden  overflow-y-auto ">
                            {children}
                        </div>
                    </div>
                </SidebarProvider>
            </SessionProvider>
        </main>
    )
}

export default Layout




