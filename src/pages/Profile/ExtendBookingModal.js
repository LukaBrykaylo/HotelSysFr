import React, { useState } from 'react';
import './ExtendBookingModal.css';

function ExtendBookingModal({ booking, onClose, onConfirm }) {
  const [newDate, setNewDate] = useState('');

  const handleSubmit = () => {
    if (!newDate) {
      alert("Please select a new date.");
      return;
    }
    if (newDate <= booking.check_out_date) {
      alert("New date must be after the current check-out date.");
      return;
    }
    onConfirm(booking.booking_id, newDate);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="extend-modal-content" onClick={e => e.stopPropagation()}>
        <h3>Extend Booking</h3>
        
        <div className="extend-info">
          <p><strong>Room:</strong> #{booking.room_id}</p>
          <p><strong>Current Check-Out:</strong> {booking.check_out_date}</p>
        </div>

        <div className="form-group">
          <label>New Check-Out Date</label>
          <input 
            type="date" 
            value={newDate}
            min={booking.check_out_date} 
            onChange={(e) => setNewDate(e.target.value)}
          />
        </div>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-confirm" onClick={handleSubmit}>Confirm Extension</button>
        </div>
      </div>
    </div>
  );
}

export default ExtendBookingModal;