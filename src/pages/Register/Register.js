import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import './Register.css';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const newUser = {
      username: username,
      email: email,
      password: password
    };

    try {
      await api.register(newUser);
      
      alert('Registration successful! Please sign in.');
      navigate('/login');
      
    } catch (err) {
      console.error(err);
      setError('Registration failed. Username or Email might already exist.');
    }
  };

  return (
    <div className="register-wrapper">
      <div className="form-container">
        <h2>Create Account</h2>
        <p style={{color: '#666', marginBottom: '20px'}}>Join our guest club today</p>
        
        {error && <div style={{color: 'red', marginBottom: '10px'}}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="johndoe"
              required 
            />
          </div>
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
          <button type="submit" style={{width: '100%'}}>Register</button>
        </form>

        <div className="auth-links">
            Already have an account? <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;