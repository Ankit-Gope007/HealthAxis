
// import Sidebar from './components/sidebar/sidebar'
// import { SidebarProvider,SidebarTrigger } from '@/components/ui/sidebar'
// import { SessionProvider } from 'next-auth/react'


// const Layout = ({ children }: { children: React.ReactNode }) => {
//     return (
//        <main>
//             <SessionProvider>
//                 <SidebarProvider>
//                     <div className="dashboard-container">
//                         <Sidebar />
//                         <div className="content">
//                             <SidebarTrigger/>
//                             {children}
//                         </div>
//                     </div>
//                 </SidebarProvider>
//             </SessionProvider>
//        </main>
//     )
// }

// export default Layout

// layout.tsx
import Sidebar from './components/sidebar/sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { SessionProvider } from 'next-auth/react'
import { FaHandHoldingMedical } from "react-icons/fa";
import { User2 } from "lucide-react";

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <main className="flex h-screen bg-gray-50 overflow-hidden"> {/* Added overflow-hidden to main */}
            <SessionProvider>
                <SidebarProvider>
                    {/* Sidebar will hide on small screens due to its internal logic or responsive classes */}
                    <div className='w-[30%]'>
                        <Sidebar />
                    </div>
                    

                    <div className="flex-1 flex w-full md:w-[60vw] flex-col h-full overflow-y-auto"> {/* Main content wrapper */}
                        {/* Header for small screens to house the SidebarTrigger and potentially a logo */}
                        <div className="md:hidden flex items-center justify-between p-0 bg-white shadow-sm border-b">
                            <SidebarTrigger className="text-2xl text-gray-700" /> {/* Hamburger icon */}
                            <div className="flex items-center">
                                <div className="bg-[#28A745] text-white p-2 rounded-2xl flex items-center justify-center mr-2">
                                    <FaHandHoldingMedical className="text-xl" /> {/* You'll need to import FaHandHoldingMedical here */}
                                </div>
                                <span className="text-lg font-semibold text-gray-800">Health Axis</span>
                            </div>
                            {/* You might want a user icon here too for small screens */}
                            <div className="w-6 h-6 m-1 rounded-full bg-gray-200 flex items-center justify-center">
                                <User2 className="w-4 h-4  text-gray-500" /> {/* You'll need to import User2 here */}
                            </div>
                        </div>

                        <div className="flex-1 p-1 flex flex-col items-center bg-gray-100 overflow-y-auto">
                            <div className=" m-2 ">
                                {children}
                            </div>
                        </div>
                    </div>
                </SidebarProvider>
            </SessionProvider>
        </main>
    )
}

export default Layout




