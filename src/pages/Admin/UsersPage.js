import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import './UsersPage.css';

function UsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await api.getAllUsers();
        setUsers(data.users);
      } catch (err) {
        setError('Failed to load users.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  if (isLoading) {
    return <div className="users-page-container"><h1>Loading all users...</h1></div>;
  }

  if (error) {
    return <div className="users-page-container"><h1>{error}</h1></div>;
  }

  const adminUsers = users.filter(u => u.role === 'admin');
  const guestUsers = users.filter(u => u.role === 'guest');

  return (
    <div className="users-page-container">
      <h1>Manage Users</h1>

      <section className="user-section">
        <h2>Administrators ({adminUsers.length})</h2>
        <div className="user-list">
          {adminUsers.map(admin => (
            <div key={admin.userId} className="user-card">
              <h3>{admin.username}</h3>
              <p><strong>ID:</strong> {admin.userId}</p>
              <p><strong>Email:</strong> {admin.email}</p>
              <p><strong>Phone:</strong> {admin.phoneNumber || 'N/A'}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="user-section">
        <h2>Guests ({guestUsers.length})</h2>
        <div className="user-list">
          {guestUsers.map(guest => (
            <div key={guest.userId} className="user-card">
              <h3>{guest.username}</h3>
              <p><strong>ID:</strong> {guest.userId}</p>
              <p><strong>Email:</strong> {guest.email}</p>
              <p><strong>Phone:</strong> {guest.phoneNumber || 'N/A'}</p>
              <p><strong>Bonuses:</strong> {guest.bonuses || 0} points</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default UsersPage;