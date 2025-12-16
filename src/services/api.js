const API_BASE_URL = 'http://localhost:8080/api';

export const api = {
  register: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData || 'Registration failed');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      if (!response.ok) {
        throw new Error('Invalid email or password');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  updateUserProfile: async (userId, userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData || 'Update failed');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  getBookingsForUser: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/bookings`, {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  getCategories: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  getRooms: async (amenityIds = [], priceRange = {}, categoryId = null, capacity = null) => {
    try {
      let url = `${API_BASE_URL}/rooms`;
      const params = new URLSearchParams();
      
      amenityIds.forEach(id => params.append('amenity', id));
      
      if (priceRange.min && priceRange.min !== '0') {
        params.append('min_price', priceRange.min);
      }
      if (priceRange.max && priceRange.max !== '') {
        params.append('max_price', priceRange.max);
      }
      if (categoryId) {
        params.append('category_id', categoryId);
      }
      if (capacity) {
        params.append('capacity', capacity);
      }

      const paramString = params.toString();
      if (paramString) {
        url += `?${paramString}`;
      }

      const response = await fetch(url, {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch rooms');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  createRoom: async (roomData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roomData),
      });
      if (!response.ok) {
        throw new Error('Failed to create room');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  updateRoom: async (roomId, roomData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/rooms/${roomId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roomData),
      });
      if (!response.ok) {
        throw new Error('Failed to update room');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  deleteRoom: async (roomId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/rooms/${roomId}`, {
        method: 'DELETE',
      });
      if (response.status !== 204) {
         throw new Error('Failed to delete room');
      }
      return true;
    } catch (error) {
      throw error;
    }
  },
  
  getAllUsers: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  getAllBookings: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  adminUpdateBooking: async (bookingId, bookingData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });
      if (!response.ok) {
        throw new Error('Failed to update booking');
      }
      return await response.text();
    } catch (error) {
      throw error;
    }
  },

  deleteBooking: async (bookingId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
        method: 'DELETE',
      });
      if (response.status !== 204) {
         throw new Error('Failed to delete booking');
      }
      return true;
    } catch (error) {
      throw error;
    }
  },

  getAmenities: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/amenities`, {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch amenities');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  getFinancialReport: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/reports/financials`, {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch financial report');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  getTopClientsReport: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/reports/top_clients`, {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch top clients report');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  getCategoryPopularityReport: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/reports/category_popularity`, {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch category popularity');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  getOccupancyReport: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/reports/occupancy`, {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch occupancy report');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  createBooking: async (bookingData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to create booking');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },
  
  adminCreateBooking: async (bookingData) => {
      return api.createBooking(bookingData);
  },

  getAllServices: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/services`, {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  cancelBooking: async (bookingId, userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId }),
      });
      if (!response.ok) throw new Error('Failed to cancel booking');
      return true;
    } catch (error) { throw error; }
  },

  extendBooking: async (bookingId, userId, newCheckOut) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/extend`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, new_check_out: newCheckOut }),
      });
      if (!response.ok) throw new Error('Failed to extend booking');
      return true;
    } catch (error) { throw error; }
  }
};
