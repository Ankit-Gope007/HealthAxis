import react from 'react'
import Sidebar from './components/sidebar/sidebar'

const Layout = ({children}:{children: React.ReactNode}) => {
    return (
            <div style={{
                height: '100vh',
                width: '100vw',
                margin: 0,
                padding: 0,
                }}>
                <Sidebar />
                {children}
            </div>
    )
}

export default Layout