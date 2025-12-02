import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import './RoomDetailsModal.css';

function RoomDetailsModal({ room, category, image, onClose, onBook }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [useBonuses, setUseBonuses] = useState(false);
  
  const [availableServices, setAvailableServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]); 

  const [finalPrice, setFinalPrice] = useState(0);
  const [days, setDays] = useState(0);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await api.getAllServices();
        console.log("Loaded services from API:", data.services);
        setAvailableServices(data.services);
      } catch (err) {
        console.error("Failed to load services:", err);
      }
    };
    loadServices();
  }, []);

  useEffect(() => {
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      
      const diffTime = end - start; 
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      
      if (diffDays > 0) {
        setDays(diffDays);
        
        let total = diffDays * category.price;

        selectedServices.forEach(selectedId => {
            const service = availableServices.find(s => (s.service_id || s.id) === selectedId);
            if (service) {
                total += service.price;
            }
        });
        
        if (useBonuses && user?.bonuses) {
          total -= user.bonuses;
        }

        setFinalPrice(total > 0 ? total : 0);
      } else {
        setDays(0);
        setFinalPrice(0);
      }
    }
  }, [checkIn, checkOut, useBonuses, selectedServices, category.price, user, availableServices]);

  const handleServiceChange = (rawId) => {
    const id = parseInt(rawId, 10);
    
    if (!id && id !== 0) {
        console.error("Invalid Service ID:", rawId);
        return;
    }

    console.log("Toggling service ID:", id);

    setSelectedServices(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleBookClick = () => {
    if (!checkIn || !checkOut) {
      alert('Please select dates');
      return;
    }
    
    onBook({
      room_id: room.room_id,
      check_in: checkIn,
      check_out: checkOut,
      use_bonuses: useBonuses, 
      services: selectedServices,
      calculated_price: finalPrice
    });
  };

  if (!room) return null;

  let actionButton;
  if (!user) {
    actionButton = (
      <button 
        className="book-now-btn" 
        style={{marginTop: '20px', padding: '15px', fontSize: '1.1rem', backgroundColor: '#555'}}
        onClick={() => navigate('/login')}
      >
        Login to Book
      </button>
    );
  } else if (user.role === 'admin') {
    actionButton = (
      <div style={{marginTop: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '4px', textAlign: 'center', color: '#777'}}>
        Administrators cannot book rooms here.
      </div>
    );
  } else {
    actionButton = (
      <button 
        className="book-now-btn" 
        style={{marginTop: '20px', padding: '15px', fontSize: '1.1rem'}}
        onClick={handleBookClick}
      >
        Confirm Booking
      </button>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        
        <div className="modal-header">
          <h2>Room #{room.room_number} - {category.name}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          <div className="room-info-col">
            <img src={image} alt="Room" className="modal-image" />
            <div className="stars">★★★★☆</div>
            <p><strong>Capacity:</strong> {room.capacity} Guests</p>
            <p><strong>Base Price:</strong> {category.price} UAH / night</p>
            
            <h4>Description</h4>
            <p style={{color: '#666', lineHeight: '1.6'}}>
              {room.comments || `Experience luxury and comfort in our ${category.name} suite.`}
            </p>
            
            <h4>Amenities</h4>
            {room.amenities && room.amenities.length > 0 ? (
              <ul className="amenities-list">
                {room.amenities.map((item, index) => (
                  <li key={index}>✓ {item}</li>
                ))}
              </ul>
            ) : (
              <p style={{color: '#999'}}>No specific amenities listed.</p>
            )}
          </div>

          <div className="booking-form-col">
            <h3>Book Your Stay</h3>
            
            <div className="form-group">
              <label>Check-In Date</label>
              <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Check-Out Date</label>
              <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} />
            </div>

            {availableServices.length > 0 && (
              <div className="services-section">
                <h4>Add Extra Services</h4>
                {availableServices.map(service => {
                    const id = service.service_id !== undefined ? service.service_id : service.id;
                    
                    return (
                      <label key={id} className="service-checkbox">
                        <input 
                          type="checkbox"
                          checked={selectedServices.includes(id)}
                          onChange={() => handleServiceChange(id)}
                        />
                        <span className="service-name">{service.name}</span>
                        <span className="service-price">+{service.price} UAH</span>
                      </label>
                    );
                })}
              </div>
            )}

            {user && user.role === 'guest' && user.bonuses > 0 && (
              <label className="bonus-check">
                <input 
                  type="checkbox" 
                  checked={useBonuses}
                  onChange={e => setUseBonuses(e.target.checked)}
                />
                Use my {user.bonuses} bonuses
              </label>
            )}

            <div className="total-price-box">
              <p>Total for {days} nights:</p>
              <span className="final-price">{finalPrice.toFixed(2)} UAH</span>
            </div>

            {actionButton}
          </div>
        </div>

      </div>
    </div>
  );
}

export default RoomDetailsModal;