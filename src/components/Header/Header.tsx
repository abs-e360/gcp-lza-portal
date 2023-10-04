// Header component

import { Button } from '@mui/joy';
import Logo from '../../assets/Logo';

import './Header.css';

const e360ContactUsPage = 'https://www.e360.com/contact_us/';

function Header() {
    return (
        <header id="header">
            <a href='/'><Logo /></a>
            <Button variant='outlined' size='lg'
                onClick={() => { window.location.href = e360ContactUsPage; }}
            >
                Contact Us
            </Button>
        </header>
    );
}

export default Header;