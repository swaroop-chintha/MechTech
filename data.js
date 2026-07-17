// ─── MechTech API & Backend Service Layer ───
// This file coordinates all network requests to the backend API.
// Once your backend server is running, change API_BASE_URL to point to it.

const API_BASE_URL = window.location.origin + '/api';

// API Service Functions
const MechTechAPI = {
  // Fetch all service categories and their respective sub-services
  async getCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      return await response.ok ? response.json() : [];
    } catch (error) {
      console.error('API Error:', error);
      return [];
    }
  },

  // Fetch cities along with their served areas and pincodes
  async getCities() {
    try {
      const response = await fetch(`${API_BASE_URL}/cities`);
      if (!response.ok) throw new Error('Failed to fetch cities');
      return await response.ok ? response.json() : [];
    } catch (error) {
      console.error('API Error:', error);
      return [];
    }
  },

  // Fetch real-time provider listings with filters
  async getProviders(filters = {}) {
    const params = new URLSearchParams();
    if (filters.categoryId && filters.categoryId !== 'all') params.append('categoryId', filters.categoryId);
    if (filters.city) params.append('city', filters.city);
    if (filters.area) params.append('area', filters.area);
    if (filters.sort) params.append('sort', filters.sort);

    try {
      const response = await fetch(`${API_BASE_URL}/providers?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch providers');
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return [];
    }
  },

  // Create a new booking
  async createBooking(bookingData) {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      });
      if (!response.ok) throw new Error('Failed to create booking');
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Fetch booking details & status timeline
  async getBooking(bookingId) {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`);
      if (!response.ok) throw new Error('Failed to fetch booking details');
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return null;
    }
  },

  // Cancel a booking
  async cancelBooking(bookingId) {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {
        method: 'POST'
      });
      if (!response.ok) throw new Error('Failed to cancel booking');
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Fetch FAQs list
  async getFAQs() {
    try {
      const response = await fetch(`${API_BASE_URL}/faqs`);
      if (!response.ok) throw new Error('Failed to fetch FAQs');
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return [];
    }
  },

  // Get dynamic assistant response from chat api
  async sendChatMessage(message) {
    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
      });
      if (!response.ok) throw new Error('Failed to send message');
      const data = await response.json();
      return data.reply;
    } catch (error) {
      console.error('API Error:', error);
      // Fallback behavior if backend isn't configured yet
      return "Assistant offline. Please make sure the backend server is running and API endpoints are configured.";
    }
  }
};
