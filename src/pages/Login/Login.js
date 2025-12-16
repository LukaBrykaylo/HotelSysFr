import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css'; 

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const auth = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const user = await auth.login(email, password); 
      
      alert(`Welcome back, ${user.username}!`);
      navigate('/');

    } catch (err) {
      console.error(err);
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="form-container">
        <h2>Welcome Back</h2>
        <p style={{color: '#666', marginBottom: '20px'}}>Please sign in to your account</p>
        
        {error && <div style={{color: 'red', marginBottom: '10px'}}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required 
            />
          </div>
          <button type="submit" style={{width: '100%'}}>Sign In</button>
        </form>

        <div className="auth-links">
            Don't have an account? <Link to="/register">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;