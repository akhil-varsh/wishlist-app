import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/api';
import Toast from '../components/Toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const checkAuthStatus = async () => {
      if (token) {
        try {
          const { data } = await authService.getProfile();
          setCurrentUser(data.profile);
        } catch (err) {
          console.error('Auth check failed:', err);
          localStorage.removeItem('token');
          setToken(null);
          setCurrentUser(null);
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, [token]);

  const login = async (email, password) => {
    try {
      setError(null);
      const { data } = await authService.login({ email, password });
      localStorage.setItem('token', data.session.access_token);
      setToken(data.session.access_token);
      setCurrentUser(data.user);
      setToast({
        message: 'Signed in successfully!',
        type: 'success'
      });
      return data;
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const { data } = await authService.register(userData);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setToast({
        message: 'Signed out successfully!',
        type: 'success'
      });
    } catch (err) {
      console.error('Logout error:', err);
      setToast({
        message: 'Error signing out. Please try again.',
        type: 'error'
      });
    } finally {
      localStorage.removeItem('token');
      setToken(null);
      setCurrentUser(null);
    }
  };

  const clearToast = () => {
    setToast(null);
  };

  const value = {
    currentUser,
    token,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={clearToast} 
        />
      )}
    </AuthContext.Provider>
  );
};

export default AuthContext;
