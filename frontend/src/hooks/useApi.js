import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAuthToken } from '../services/api';

const useApi = (endpoint, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { logout } = useAuth();

  const fetchData = useCallback(async () => {
    const token = getAuthToken();
    try {
      setLoading(true);
      setError(null);
      const headers = { 
        'Content-Type': 'application/json',
        ...(options.headers || {})
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const res = await fetch(
        `${baseUrl}${endpoint}`,
        { ...options, headers }
      );
      
      if (res.status === 401) { 
        logout(); 
        return; 
      }
      
      if (!res.ok) {
        let errMsg = 'Request failed';
        try {
          const err = await res.json();
          errMsg = err.message || err.error || errMsg;
        } catch (_) {
          // Fallback if not a json response
        }
        throw new Error(errMsg);
      }
      
      const json = await res.json();
      setData(json);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint, logout, JSON.stringify(options)]);

  useEffect(() => { 
    fetchData(); 
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export default useApi;
