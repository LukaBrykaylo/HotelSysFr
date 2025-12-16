import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import RoomDetailsModal from './RoomDetailsModal';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Rooms.css';

const placeholderImages = {
  'Econom': 'https://images.unsplash.com/photo-1566665797739-1674de7a421a',
  'Standart': 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af',
  'Premium': 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2'
};

function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [categories, setCategories] = useState({});
  const [allAmenities, setAllAmenities] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedAmenities, setSelectedAmenities] = useState(new Set());
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [debouncedPriceRange, setDebouncedPriceRange] = useState({ min: '', max: '' });
  
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCapacity, setSelectedCapacity] = useState('');

  const [selectedRoom, setSelectedRoom] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadStaticData = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        const [categoryData, amenityData, initialRoomData] = await Promise.all([
          api.getCategories(),
          api.getAmenities(),
          api.getRooms([], { min: '', max: '' })
        ]);

        const categoryMap = categoryData.categories.reduce((acc, cat) => {
          acc[cat.id] = cat; 
          return acc;
        }, {});
        
        setCategories(categoryMap);
        setAllAmenities(amenityData.amenities);
        setRooms(initialRoomData.rooms);

      } catch (err) {
        setError('Failed to load page data. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadStaticData();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedPriceRange(priceRange);
    }, 500); 

    return () => {
      clearTimeout(handler);
    };
  }, [priceRange]); 

  useEffect(() => {
    if (Object.keys(categories).length === 0) {
        return; 
    }

    const loadRooms = async () => {
      setIsLoading(true); 
      try {
        setError('');
        const roomData = await api.getRooms(
            Array.from(selectedAmenities), 
            debouncedPriceRange,
            selectedCategory,
            selectedCapacity
        );
        setRooms(roomData.rooms);
      } catch (err) {
        setError('Failed to load rooms.');
        console.error(err);
      } finally {
        setIsLoading(false); 
      }
    };
    
    loadRooms();

  }, [selectedAmenities, debouncedPriceRange, categories, selectedCategory, selectedCapacity]);

  const handleAmenityChange = (amenityId) => {
    setSelectedAmenities(prev => {
      const newSet = new Set(prev);
      if (newSet.has(amenityId)) {
        newSet.delete(amenityId);
      } else {
        newSet.add(amenityId);
      }
      return newSet;
    });
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setPriceRange(prev => ({ ...prev, [name]: value }));
  };

  const getCategoryDetails = (categoryId) => {
    return categories[categoryId] || { name: 'Unknown', price: 0 };
  };

  const handleViewDetails = (room) => {
    setSelectedRoom(room);
  };

  const handleCloseModal = () => {
    setSelectedRoom(null);
  };

  const handleConfirmBooking = async (bookingData) => {
    if (!user) {
      alert("Please login to book a room");
      navigate('/login');
      return;
    }

    const payload = {
        user_id: user.userId,
        room_id: bookingData.room_id,
        check_in: bookingData.check_in,
        check_out: bookingData.check_out,
        use_bonuses: bookingData.use_bonuses,
        services: []
    };

    try {
        await api.createBooking(payload);
        alert(`Booking successful! Room #${selectedRoom.room_number} is yours.`);
        handleCloseModal();
    } catch (err) {
        console.error(err);
        alert("Booking failed: " + err.message);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <h1>Loading rooms...</h1>;
    }
    if (error) {
      return <h1>Error: {error}</h1>;
    }
    if (!isLoading && rooms.length === 0) {
      return <h1>No rooms found matching your criteria.</h1>;
    }

    return (
      <div className="room-grid">
        {rooms.map(room => {
          const category = getCategoryDetails(room.category_id);
          const imageUrl = placeholderImages[category.name] || 'https://images.unsplash.com/photo-1540518614846-7eded4801877';

          return (
            <div key={room.room_id} className="room-card">
              <img src={imageUrl} alt={category.name} className="room-card-image" />
              <div className="room-card-content">
                <h3>Room #{room.room_number}</h3>
                <div className="room-card-details">
                  <span>{category.name}</span>
                  <span>Capacity: {room.capacity}</span>
                </div>
                <div className="room-card-price">
                  {category.price} UAH <span>/ night</span>
                </div>
                
                <button 
                  className="book-now-btn"
                  onClick={() => handleViewDetails(room)}
                >
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="rooms-page-layout">
      
      <aside className="filter-sidebar">
        
        <div className="filter-group">
          <h3>Category</h3>
          <div className="form-group">
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="">All Categories</option>
              {Object.values(categories).map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="filter-group">
          <h3>Capacity</h3>
          <div className="form-group">
            <label>Minimum Guests</label>
            <select value={selectedCapacity} onChange={(e) => setSelectedCapacity(e.target.value)}>
              <option value="">Any</option>
              <option value="1">1 Guest</option>
              <option value="2">2 Guests</option>
              <option value="3">3 Guests</option>
              <option value="4">4+ Guests</option>
            </select>
          </div>
        </div>

        <div className="filter-group">
          <h3>Amenities</h3>
          {allAmenities.length === 0 ? <p>Loading...</p> : allAmenities.map(amenity => (
            <label key={amenity.amenity_id} className="amenity-checkbox">
              <input 
                type="checkbox"
                checked={selectedAmenities.has(amenity.amenity_id)}
                onChange={() => handleAmenityChange(amenity.amenity_id)}
              />
              {amenity.name}
            </label>
          ))}
        </div>
        
        <div className="filter-group">
          <h3>Price Range</h3>
          <div className="price-filter">
            <div className="price-inputs">
              <div className="form-group">
                <label>Min (UAH)</label>
                <input 
                  type="number"
                  name="min"
                  value={priceRange.min}
                  onChange={handlePriceChange}
                  placeholder="0"
                />
              </div>
              <div className="form-group">
                <label>Max (UAH)</label>
                <input 
                  type="number"
                  name="max"
                  value={priceRange.max}
                  onChange={handlePriceChange}
                  placeholder="10000"
                />
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="rooms-content">
        <h1>Our Rooms</h1>
        {renderContent()}
      </main>

      {selectedRoom && (
        <RoomDetailsModal 
          room={selectedRoom}
          category={getCategoryDetails(selectedRoom.category_id)}
          image={placeholderImages[getCategoryDetails(selectedRoom.category_id).name]}
          onClose={handleCloseModal}
          onBook={handleConfirmBooking}
        />
      )}

    </div>
  );
}

export default RoomsPage;