import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email, password) => {
    try {
      const data = await api.login({ email, password });
      
      const userData = {
        userId: data.userId,
        username: data.username,
        email: data.email,
        role: data.role,
        phoneNumber: data.phoneNumber,
        bonuses: data.bonuses,
        paymentInfo: data.paymentInfo,
        token: data.token
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return userData;

    } catch (error) {
      throw error;
    }
  };

  const updateUser = (newUserData) => {
    const updatedUser = { ...user, ...newUserData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };
  
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};