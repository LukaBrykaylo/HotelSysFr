import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import './RoomsPage.css';

function RoomsPage() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [currentRoom, setCurrentRoom] = useState({ room_id: null, room_number: '', category_id: 1, capacity: 1 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const roomsData = await api.getRooms();
      const categoriesData = await api.getCategories();
      setRooms(roomsData.rooms);
      setCategories(categoriesData.categories);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentRoom(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const roomData = {
      room_number: currentRoom.room_number,
      category_id: parseInt(currentRoom.category_id, 10),
      capacity: parseInt(currentRoom.capacity, 10),
    };

    try {
      if (isEditing) {
        await api.updateRoom(currentRoom.room_id, roomData);
      } else {
        await api.createRoom(roomData);
      }
      resetForm();
      fetchData();
    } catch (err) {
      setError('Failed to save room. Check if room number is unique.');
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentRoom({ room_id: null, room_number: '', category_id: 1, capacity: 1 });
  };

  const handleEdit = (room) => {
    setIsEditing(true);
    setCurrentRoom(room);
  };

  const handleDelete = async (roomId) => {
    if (window.confirm('Are you sure you want to delete this room? This might fail if it has bookings.')) {
      try {
        await api.deleteRoom(roomId);
        fetchData();
      } catch (err) {
        setError('Failed to delete room. It might be linked to existing bookings.');
      }
    }
  };

  if (!user || user.role !== 'admin') {
    return <Navigate to="/profile" replace />;
  }

  if (isLoading) {
    return <div className="admin-rooms-page"><h1>Loading...</h1></div>;
  }
  
  const getCategoryName = (id) => {
    const cat = categories.find(c => c.id === id);
    return cat ? cat.name : 'Unknown';
  };

  return (
    <div className="admin-rooms-page">
      <h1>Manage Rooms</h1>
      {error && <p style={{color: 'red'}}>{error}</p>}

      <div className="add-room-form">
        <h2>{isEditing ? 'Edit Room' : 'Add New Room'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Room Number</label>
              <input
                type="text"
                name="room_number"
                value={currentRoom.room_number}
                onChange={handleInputChange}
                placeholder="e.g., 101"
                required
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select
                name="category_id"
                value={currentRoom.category_id}
                onChange={handleInputChange}
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name} (ID: {cat.id})</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Capacity</label>
              <input
                type="number"
                name="capacity"
                min="1"
                value={currentRoom.capacity}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <button type="submit">{isEditing ? 'Save Changes' : 'Add Room'}</button>
          {isEditing && <button type="button" onClick={resetForm} style={{marginLeft: '10px', background: '#555'}}>Cancel Edit</button>}
        </form>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Room ID</th>
            <th>Room Number</th>
            <th>Category</th>
            <th>Capacity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map(room => (
            <tr key={room.room_id}>
              <td>{room.room_id}</td>
              <td>{room.room_number}</td>
              <td>{getCategoryName(room.category_id)}</td>
              <td>{room.capacity}</td>
              <td className="actions">
                <button className="btn-edit" onClick={() => handleEdit(room)}>Edit</button>
                <button className="btn-delete" onClick={() => handleDelete(room.room_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RoomsPage;