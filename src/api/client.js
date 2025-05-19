// src/api/client.js
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

/**
 * Fetches services from the API
 * @returns {Promise<Array>} List of services
 */
export const getServices = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/services`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch services: ${response.status}`);
    }
    
    const data = await response.json();
    return data.services || [];
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};

/**
 * Submits a booking to the API
 * @param {Object} bookingData - Booking information
 * @returns {Promise<Object>} Booking confirmation
 */
export const createBooking = async (bookingData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to submit booking: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error submitting booking:', error);
    throw error;
  }
};