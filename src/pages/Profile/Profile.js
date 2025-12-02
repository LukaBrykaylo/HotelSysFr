import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import ExtendBookingModal from './ExtendBookingModal';
import './Profile.css';

function GuestProfile({ user, onUpdate }) {
    const [username, setUsername] = useState(user.username);
    const [email, setEmail] = useState(user.email);
    const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || '');
    const [bonuses] = useState(user.bonuses || 0);
    const [paymentInfo] = useState(user.paymentInfo || 'Not set');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [extendModalOpen, setExtendModalOpen] = useState(false);
    const [bookingToExtend, setBookingToExtend] = useState(null);

    const fetchBookings = useCallback(async () => {
        if (!user?.userId) return;
        try {
            setIsLoading(true);
            const data = await api.getBookingsForUser(user.userId);
            setBookings(data.bookings);
        } catch (err) {
            console.error(err);
            setError("Failed to load bookings.");
        } finally {
            setIsLoading(false);
        }
    }, [user.userId]);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage(''); setError('');
        const updatedData = { username, email, phoneNumber };
        try {
            const updatedUser = await api.updateUserProfile(user.userId, updatedData);
            onUpdate(updatedUser);
            setMessage('Profile updated successfully!');
        } catch (err) {
            setError(err.message || 'Failed to update profile.');
        }
    };

    const handleCancel = async (bookingId) => {
        if (window.confirm("Cancel this booking?")) {
            try {
                await api.cancelBooking(bookingId, user.userId);
                fetchBookings();
            } catch (err) { alert("Failed to cancel"); }
        }
    };

    const openExtendModal = (booking) => {
        setBookingToExtend(booking);
        setExtendModalOpen(true);
    };

    const handleConfirmExtend = async (bookingId, newDate) => {
        try {
            await api.extendBooking(bookingId, user.userId, newDate);
            setExtendModalOpen(false);
            fetchBookings();
            alert("Booking extended! Price updated.");
        } catch (err) {
            alert("Failed to extend (room might be busy or invalid date)");
        }
    };

    return (
        <div className="profile-card">
            <h2>My Profile (Guest)</h2>
            {message && <div style={{ color: 'green', marginBottom: '10px' }}>{message}</div>}
            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

            <form onSubmit={handleSubmit} className="profile-form">
                <h3>Edit Details</h3>
                <div className="form-group">
                    <label>Username</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Phone Number</label>
                    <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                </div>
                <button type="submit" style={{ width: 'auto' }}>Save Changes</button>
            </form>

            <hr style={{ margin: '30px 0' }} />
            <h3>My Status</h3>
            <div className="profile-info">
                <p><strong>Bonuses:</strong> {bonuses} points</p>
                <p><strong>Payment Info:</strong> {paymentInfo}</p>
            </div>

            <h3>My Bookings</h3>
            <div className="bookings-list">
                {isLoading ? <p>Loading...</p> : bookings.length === 0 ? <p>No bookings.</p> : (
                    <table>
                        <thead>
                            <tr>
                                <th>Room</th>
                                <th>Dates</th>
                                <th>Status</th>
                                <th>Cost</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map(b => (
                                <tr key={b.booking_id}>
                                    <td>Room #{b.room_id}</td>
                                    <td>{b.check_in_date} to {b.check_out_date}</td>
                                    <td>
                                        <span className={`status-badge ${b.status}`}>
                                            {b.status}
                                        </span>
                                    </td>
                                    <td>{b.total_cost}</td>
                                    <td>
                                        {b.status === 'confirmed' && (
                                            <div style={{ display: 'flex', gap: '5px' }}>
                                                <button onClick={() => openExtendModal(b)} style={{ padding: '5px', fontSize: '0.8rem' }}>Extend</button>
                                                <button onClick={() => handleCancel(b.booking_id)} style={{ padding: '5px', fontSize: '0.8rem', backgroundColor: '#d9534f' }}>Cancel</button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {extendModalOpen && bookingToExtend && (
                <ExtendBookingModal
                    booking={bookingToExtend}
                    onClose={() => setExtendModalOpen(false)}
                    onConfirm={handleConfirmExtend}
                />
            )}

        </div>
    );
}

function AdminProfile({ user }) {
    const navigate = useNavigate();
    return (
        <div className="profile-card admin-profile">
            <h2>Admin Dashboard</h2>
            <div className="profile-info">
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
            </div>
            <h3>Manage System</h3>
            <div className="admin-actions">
                <button onClick={() => navigate('/admin/rooms')}>Manage Rooms</button>
                <button onClick={() => navigate('/admin/bookings')}>Manage Bookings</button>
                <button onClick={() => navigate('/admin/users')}>View All Users</button>
                <button onClick={() => navigate('/admin/reports')}>View Reports</button>
            </div>
        </div>
    );
}

function ProfilePage() {
    const { user, updateUser } = useAuth();
    if (!user) return <Navigate to="/login" replace />;
    return (
        <div className="profile-page">
            {user.role === 'admin' ? <AdminProfile user={user} /> : <GuestProfile user={user} onUpdate={updateUser} />}
        </div>
    );
}

export default ProfilePage;