import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAuthToken } from '../services/api';

const useApiMutation = (endpoint, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { logout } = useAuth();

  const mutate = useCallback(async (body) => {
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
      const config = {
        method: 'POST',
        ...options,
        headers,
      };

      if (body !== undefined) {
        config.body = JSON.stringify(body);
      }

      const res = await fetch(
        `${baseUrl}${endpoint}`,
        config
      );
      
      if (res.status === 401) { 
        logout(); 
        return null; 
      }
      
      if (!res.ok) {
        let errMsg = 'Request failed';
        try {
          const err = await res.json();
          errMsg = err.message || err.error || errMsg;
        } catch (_) {}
        throw new Error(errMsg);
      }
      
      const json = await res.json();
      setData(json);
      return json;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [endpoint, logout, JSON.stringify(options)]);

  return { mutate, loading, error, data };
};

export default useApiMutation;
