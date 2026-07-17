const BFF_BASE_URL = 'http://localhost:5000/api';

// In-memory token storage to prevent XSS
let inMemoryToken = '';

export const setAuthToken = (token) => {
  inMemoryToken = token;
};

export const getAuthToken = () => {
  return inMemoryToken;
};

export const fetchAPI = async (endpoint, options = {}) => {
  const url = `${BFF_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (inMemoryToken) {
    headers['Authorization'] = `Bearer ${inMemoryToken}`;
  }

  const config = {
    ...options,
    headers
  };

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
};

export const authAPI = {
  register(name, email, phone, password, role) {
    return fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, phone, password, role })
    });
  },

  verifyOtp(phone, otp) {
    return fetchAPI('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, otp })
    });
  },

  login(username, password) {
    return fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
  },

  getMe() {
    return fetchAPI('/auth/me', {
      method: 'GET'
    });
  }
};
