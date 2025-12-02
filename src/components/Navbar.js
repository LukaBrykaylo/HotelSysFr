import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

function Navbar() {
  const { user, logout } = useAuth(); 
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); 
  };

  const navStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#1a2b49',
    color: 'white'
  };

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    marginLeft: '20px',
    fontSize: '18px',
    fontWeight: '300'
  };

  const logoStyle = {
    fontFamily: "'Playfair Display', serif",
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#c5a059'
  };

  return (
    <nav style={navStyle}>
      <div style={logoStyle}>Grand Hotel</div>
      <div>
        <Link to="/" style={linkStyle}>Home</Link>
        <Link to="/rooms" style={linkStyle}>Rooms</Link>

        {user ? (
          <>
            <Link to="/profile" style={linkStyle}>My Profile</Link>
            {user.role === 'admin' && (
              <Link to="/admin/reports" style={linkStyle}>Reports</Link>
            )}

            <button onClick={handleLogout} style={{...linkStyle, background: 'none', border: 'none', cursor: 'pointer'}}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyle}>Sign In</Link>
            <Link to="/register" style={{...linkStyle, border: '1px solid #c5a059', padding: '8px 15px', borderRadius: '4px'}}>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;