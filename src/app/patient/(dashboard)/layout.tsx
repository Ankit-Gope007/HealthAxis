"use client"
import react from 'react'
import Sidebar from './components/sidebar/sidebar'
import './page.css'
import { useState } from 'react'
import Navbar from './components/navbar/navbar'
import { SessionProvider } from 'next-auth/react'

const Layout = ({ children }: { children: React.ReactNode }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    return (
        <div className='container'>
            <div className='left-part'>
                <div className="navbar">
                    <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
                </div>
                <div className={` ${isSidebarOpen ? "visible" : "invisible"}`} >
                    <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
                </div>
            </div>
            <div className={`right-part ${isSidebarOpen ? "invisible" : "visible"}`}>
                <SessionProvider>
                {children}
                </SessionProvider>
            </div>
        </div>
    )
}

export default Layout