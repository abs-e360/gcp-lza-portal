import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { CartProvider } from '@shopify/hydrogen-react';

const Layout = () => {
    return (
        <div>
            <Header />
            <div style={{ minHeight: '50vh', margin: '16px 15vw' }}>
                <CartProvider>
                    <Outlet />
                </CartProvider>
            </div>
            <Footer />
        </div >
    )
}

export default Layout