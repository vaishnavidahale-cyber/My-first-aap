import React from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
    isAuthenticated?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated = false }) => {
    return (
        <nav style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderBottom: '1px solid #dee2e6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                {/* Logo Section */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <img 
                        src="/assets/images/vaishno.jpg" 
                        alt="Logo" 
                        style={{ 
                            width: '40px', 
                            height: '40px', 
                            borderRadius: '50%',
                            objectFit: 'cover'
                        }} 
                    />
                    <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Event Forum Hub</span>
                </div>
                
                {/* Navigation Links */}
                <ul style={{ 
                    display: 'flex', 
                    listStyle: 'none', 
                    gap: '1.5rem', 
                    margin: 0, 
                    padding: 0,
                    marginLeft: 'auto'
                }}>
                    <li>
                        <Link to="/" style={{ textDecoration: 'none', color: '#007bff' }}>Home</Link>
                    </li>
                    <li>
                        <Link to="/events" style={{ textDecoration: 'none', color: '#007bff' }}>Events</Link>
                    </li>
                    <li>
                        <Link to="/community" style={{ textDecoration: 'none', color: '#007bff' }}>Community</Link>
                    </li>
                    <li>
                        {isAuthenticated ? (
                            <Link to="/profile" style={{ textDecoration: 'none', color: '#007bff' }}>Profile</Link>
                        ) : (
                            <Link to="/login" style={{ textDecoration: 'none', color: '#007bff' }}>Login</Link>
                        )}
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;