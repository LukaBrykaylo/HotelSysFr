import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import '../Admin/BookingsPage.css';

const EMPTY_BOOKING = {
  booking_id: null,
  user_id: '',
  room_id: '',
  check_in_date: '',
  check_out_date: '',
  status: 'confirmed'
};

function BookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(EMPTY_BOOKING);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError('');
      const [bookingsData, usersData, roomsData] = await Promise.all([
        api.getAllBookings(),
        api.getAllUsers(),
        api.getRooms()
      ]);

      setBookings(bookingsData.bookings);
      setUsers(usersData.users.filter(u => u.role === 'guest'));
      setRooms(roomsData.rooms);

    } catch (err) {
      setError('Failed to load data. Please refresh the page.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentBooking(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const bookingData = {
      user_id: parseInt(currentBooking.user_id, 10),
      room_id: parseInt(currentBooking.room_id, 10),
      check_in_date: currentBooking.check_in_date,
      check_out_date: currentBooking.check_out_date,
      status: currentBooking.status,
    };

    try {
      if (isEditing) {
        await api.adminUpdateBooking(currentBooking.booking_id, bookingData);
      } else {
        await api.adminCreateBooking(bookingData);
      }
      resetForm();
      fetchData();
    } catch (err) {
      setError('Failed to save booking. Ensure dates are valid.');
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentBooking(EMPTY_BOOKING);
  };

  const handleEdit = (booking) => {
    setIsEditing(true);
    setCurrentBooking({
      ...booking,
      check_in_date: booking.check_in_date.split('T')[0],
      check_out_date: booking.check_out_date.split('T')[0],
    });
  };

  const handleDelete = async (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        setError('');
        await api.deleteBooking(bookingId);
        fetchData();
      } catch (err) {
        setError('Failed to delete booking.');
      }
    }
  };

  if (!user || user.role !== 'admin') {
    return <Navigate to="/profile" replace />;
  }
  if (isLoading) {
    return <div className="admin-page-container"><h1>Loading...</h1></div>;
  }

  return (
    <div className="admin-page-container">
      <h1>Manage Bookings</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="admin-form">
        <h2>{isEditing ? 'Edit Booking' : 'Add New Booking'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Guest (User)</label>
              <select name="user_id" value={currentBooking.user_id} onChange={handleInputChange} required>
                <option value="" disabled>Select a guest...</option>
                {users.map(u => (
                  <option key={u.userId} value={u.userId}>{u.username} (ID: {u.userId})</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Room</label>
              <select name="room_id" value={currentBooking.room_id} onChange={handleInputChange} required>
                <option value="" disabled>Select a room...</option>
                {rooms.map(r => (
                  <option key={r.room_id} value={r.room_id}>Room #{r.room_number} (ID: {r.room_id})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Check-In Date</label>
              <input type="date" name="check_in_date" value={currentBooking.check_in_date} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Check-Out Date</label>
              <input type="date" name="check_out_date" value={currentBooking.check_out_date} onChange={handleInputChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={currentBooking.status} onChange={handleInputChange} required>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="form-group">
            </div>
          </div>

          <button type="submit">{isEditing ? 'Save Changes' : 'Add Booking'}</button>
          {isEditing && <button type="button" onClick={resetForm} style={{ marginLeft: '10px', background: '#555' }}>Cancel Edit</button>}
        </form>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Guest</th>
            <th>Room #</th>
            <th>Check-In</th>
            <th>Check-Out</th>
            <th>Cost</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(b => (
            <tr key={b.booking_id}>
              <td>{b.booking_id}</td>
              <td>{b.username || `User ID: ${b.user_id}`}</td>
              <td>{b.room_number || `Room ID: ${b.room_id}`}</td>
              <td>{b.check_in_date}</td>
              <td>{b.check_out_date}</td>
              <td>{b.total_cost} UAH</td>
              <td>
                <span className={`status-badge ${b.status}`}>
                  {b.status}
                </span>
              </td>
              <td className="actions">
                <button className="btn-edit" onClick={() => handleEdit(b)}>Edit</button>
                <button className="btn-delete" onClick={() => handleDelete(b.booking_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BookingsPage;