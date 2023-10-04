// Footer compoenent

import './Footer.css';

function Footer() {
    return (
        <div id="footer">
            <p className='footer-text'>© Copyright 2023</p>
            <a className='footer-text' href='https://www.e360.com/about/privacy/' referrerPolicy='no-referrer'>
                Privacy Policy
            </a>
        </div>
    );
}

export default Footer;