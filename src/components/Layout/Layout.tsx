import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const Layout = () => {
    return (
        <div>
            <Header />
            <div style={{ minHeight: '50vh', margin: '0 15vw' }}>
                <Outlet />
            </div>
            <Footer />
        </div >
    )
}

export default Layout