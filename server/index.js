// server/index.js
const express = require('express');
const cors = require('cors');
const db = require('./db');
const config = require('./config');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // Your React app URL
  credentials: true
}));

// Services endpoint - GET /api/services
app.get('/api/services', async (req, res) => {
  try {
    const services = await db.getServices();
    res.json({
      success: true,
      services: services
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services'
    });
  }
});

// Bookings endpoint - POST /api/bookings
app.post('/api/bookings', async (req, res) => {
  try {
    // Get booking data from request body
    const bookingData = req.body;
    
    // Log the incoming booking data
    console.log('Received booking request:', JSON.stringify(bookingData, null, 2));
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'date', 'time', 'topic', 'message', 'services'];
    for (const field of requiredFields) {
      if (!bookingData[field]) {
        return res.status(400).json({
          success: false,
          message: `Missing required field: ${field}`
        });
      }
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(bookingData.email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }
    
    // Create booking in database
    const result = await db.createBooking(bookingData);
    console.log('Booking created successfully:', result);
    
    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking_id: result.booking_id
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create booking: ' + error.message
    });
  }
});

// Start server
const PORT = config.server.port || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});