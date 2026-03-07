/* Footer.jsx — Simple site footer */
import React from 'react';

function Footer() {
    return (
        <footer className="site-footer">
            <div className="container">
                © {new Date().getFullYear()} ShopX · All prices are in INR (₹) · Built with React &amp; Django
            </div>
        </footer>
    );
}

export default Footer;
