import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/Home/Home';
import LoginPage from './pages/Login/Login';
import RegisterPage from './pages/Register/Register';
import ProfilePage from './pages/Profile/Profile';
import RoomsPage from './pages/Rooms/Rooms';
import UsersPage from './pages/Admin/UsersPage';
import AdminRoomsPage from './pages/Admin/RoomsPage';
import AdminBookingsPage from './pages/Admin/BookingsPage';
import ReportsPage from './pages/Admin/ReportsPage';

import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar /> 
      
      <div className="content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/rooms" element={<RoomsPage />} />
          
          <Route path="/admin/users" element={<UsersPage />} />
          <Route path="/admin/rooms" element={<AdminRoomsPage />} />
          <Route path="/admin/bookings" element={<AdminBookingsPage />} />
          <Route path="/admin/reports" element={<ReportsPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;