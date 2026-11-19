import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('sweetmagic_user') || localStorage.getItem('sundari_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('sweetmagic_token') || localStorage.getItem('sundari_token') || null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await authAPI.getProfile();
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('sweetmagic_user', JSON.stringify(res.user));
          }
        } catch (error) {
          console.warn('Session expired or invalid token:', error.message);
          logout(false);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await authAPI.login({ email, password });
      if (res.success) {
        setUser(res.user);
        setToken(res.token);
        localStorage.setItem('sweetmagic_token', res.token);
        localStorage.setItem('sweetmagic_user', JSON.stringify(res.user));
        addToast(`Welcome back, ${res.user.name}! Enjoy fresh traditional sweets 🍬`);
        return { success: true };
      }
    } catch (error) {
      addToast(error.message, 'error');
      return { success: false, message: error.message };
    }
  };

  const register = async (name, email, password, phone) => {
    try {
      const res = await authAPI.register({ name, email, password, phone });
      if (res.success) {
        setUser(res.user);
        setToken(res.token);
        localStorage.setItem('sweetmagic_token', res.token);
        localStorage.setItem('sweetmagic_user', JSON.stringify(res.user));
        addToast(`Welcome to Sweet Magic, ${res.user.name}! Your account has been created.`);
        return { success: true };
      }
    } catch (error) {
      addToast(error.message, 'error');
      return { success: false, message: error.message };
    }
  };

  const logout = (showToast = true) => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('sweetmagic_token');
    localStorage.removeItem('sweetmagic_user');
    localStorage.removeItem('sundari_token');
    localStorage.removeItem('sundari_user');
    if (showToast) {
      addToast('You have been logged out gracefully. Visit Sweet Magic again!');
    }
  };

  const updateProfile = async (userData) => {
    try {
      const res = await authAPI.updateProfile(userData);
      if (res.success) {
        setUser(res.user);
        localStorage.setItem('sweetmagic_user', JSON.stringify(res.user));
        addToast('Profile updated successfully.');
        return { success: true };
      }
    } catch (error) {
      addToast(error.message, 'error');
      return { success: false, message: error.message };
    }
  };

  const refreshUser = async () => {
    if (token) {
      try {
        const res = await authAPI.getProfile();
        if (res.success && res.user) {
          setUser(res.user);
          localStorage.setItem('sweetmagic_user', JSON.stringify(res.user));
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        loading,
        login,
        register,
        logout,
        updateProfile,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
