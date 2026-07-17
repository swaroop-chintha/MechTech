import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI, setAuthToken } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user profile on mount if token is saved in memory
  // Since JWT is in-memory, on page reload it will clear, which is secure and requested.
  useEffect(() => {
    const initAuth = async () => {
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const data = await authAPI.login(username, password);
      setAuthToken(data.token);
      setUser(data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, phone, password, role) => {
    setLoading(true);
    try {
      await authAPI.register(name, email, phone, password, role);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (phone, otp) => {
    setLoading(true);
    try {
      const data = await authAPI.verifyOtp(phone, otp);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setAuthToken('');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    verifyOtp,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
