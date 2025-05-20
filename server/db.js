// server/db.js
const { Pool } = require('pg');
const config = require('./config');

const pool = new Pool({
  user: config.database.user,
  host: config.database.host,
  database: config.database.name || config.database.database,
  password: config.database.password,
  port: config.database.port,
});

// Basic query function
const query = (text, params) => pool.query(text, params);

// Get all services
const getServices = async () => {
  try {
    const result = await query(
      'SELECT service_id, service_name, description, default_price FROM services ORDER BY service_id'
    );
    return result.rows;
  } catch (error) {
    console.error('Database error in getServices:', error);
    throw error;
  }
};

// Create a new booking with related services
const createBooking = async (bookingData) => {
  const client = await pool.connect();
  
  try {
    // Start transaction
    await client.query('BEGIN');
    
    // Calculate booking end time based on session duration
    const startTime = bookingData.time;
    
    // Parse the start time to calculate end time
    const [hours, minutes, period] = startTime.match(/(\d+):(\d+)\s*([AP]M)/i).slice(1);
    let startHour = parseInt(hours, 10);
    const startMinute = parseInt(minutes, 10);
    
    // Convert to 24-hour format
    if (period.toUpperCase() === 'PM' && startHour < 12) {
      startHour += 12;
    } else if (period.toUpperCase() === 'AM' && startHour === 12) {
      startHour = 0;
    }
    
    // Calculate end time based on session duration (in minutes)
    const sessionDuration = parseInt(bookingData.sessionDuration || 30, 10);
    let endHour = startHour;
    let endMinute = startMinute + sessionDuration;
    
    // Adjust for minute overflow
    if (endMinute >= 60) {
      endHour += Math.floor(endMinute / 60);
      endMinute %= 60;
    }
    
    // Format end time
    const endPeriod = endHour >= 12 ? 'PM' : 'AM';
    const displayEndHour = endHour % 12 === 0 ? 12 : endHour % 12;
    const endTime = `${displayEndHour}:${endMinute.toString().padStart(2, '0')} ${endPeriod}`;
    
    // Create UTC timestamp for booking
    const bookingDate = new Date(`${bookingData.date}T${startHour}:${startMinute}:00`);
    
    // Insert main booking record
    const bookingResult = await client.query(
      `INSERT INTO bookings (
        customer_name, 
        customer_email, 
        booking_subject, 
        booking_utc, 
        start_time_ist, 
        end_time_ist, 
        notes, 
        booking_status
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING booking_id, created_at_utc`,
      [
        bookingData.name, 
        bookingData.email,
        bookingData.topic,
        bookingDate,
        startTime, 
        endTime,
        bookingData.message,
        'Pending'
      ]
    );
    
    const bookingId = bookingResult.rows[0].booking_id;
    
    // Insert booking services
    if (bookingData.services && bookingData.services.length > 0) {
      for (const service of bookingData.services) {
        // Get service price from database
        const serviceResult = await client.query(
          'SELECT default_price FROM services WHERE service_id = $1',
          [service.serviceId]
        );
        
        if (serviceResult.rows.length === 0) {
          throw new Error(`Service with ID ${service.serviceId} not found`);
        }
        
        const price = serviceResult.rows[0].default_price;
        
        // Insert booking service
        await client.query(
          `INSERT INTO booking_services (
            booking_id, 
            service_id, 
            quantity, 
            agreed_price
          )
          VALUES ($1, $2, $3, $4)`,
          [bookingId, service.serviceId, service.quantity || 1, price]
        );
        
        // Update booking's revenue
        await client.query(
          `UPDATE bookings 
           SET revenue = $1
           WHERE booking_id = $2`,
          [price * (service.quantity || 1), bookingId]
        );
      }
    }
    
    // Commit transaction
    await client.query('COMMIT');
    
    return {
      booking_id: bookingId,
      created_at: bookingResult.rows[0].created_at_utc
    };
  } catch (error) {
    // Rollback transaction on error
    await client.query('ROLLBACK');
    console.error('Database error in createBooking:', error);
    throw error;
  } finally {
    // Release client
    client.release();
  }
};

module.exports = {
  query,
  getServices,
  createBooking
};