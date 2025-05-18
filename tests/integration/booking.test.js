            const request = require('supertest'); // Used to test HTTP requests
            const express = require('express');
            const { Pool } = require('pg');
            const config = require('../../config');
            const app = express(); // Create a new express app for testing
            app.use(express.json());

            // Mock the pg module
            jest.mock('pg', () => {
              const Pool = jest.fn();
              Pool.prototype.query = jest.fn();
              return { Pool };
            });
            //Import the code
            require('../../index');

            describe('Booking Integration Tests', () => {
              let pool;

              beforeEach(() => {
                jest.clearAllMocks();
                pool = new Pool(); // Get the mocked Pool instance
              });

              describe('POST /api/bookings', () => {
                it('should create a booking successfully', async () => {
                  // Mock database queries
                  pool.query
                    .mockResolvedValueOnce({ rows: [{ booking_id: 1 }] }) // Mock booking insert
                    .mockResolvedValueOnce({ rows: [{ service_id: 1, default_price: 100 }] }) // Mock service query
                    .mockResolvedValueOnce({}) // Mock booking_services insert
                    .mockResolvedValueOnce({}); // Mock update query

                  const bookingData = {
                    name: 'John Doe',
                    email: 'john.doe@example.com',
                    date: '2024-07-28',
                    time: '10:00',
                    timezone: 'America/New_York',
                    topic: 'Consultation',
                    message: 'Need help with setup',
                    services: [{ serviceId: 1, quantity: 2 }],
                  };

                  const response = await request(app)
                    .post('/api/bookings')
                    .send(bookingData);

                  expect(response.status).toBe(201);
                  expect(response.body).toHaveProperty('success', true);
                  expect(response.body).toHaveProperty('bookingId', 1);
                  expect(pool.query).toHaveBeenCalledTimes(5); // 2 inserts, 1 select, BEGIN, COMMIT
                  expect(pool.query).toHaveBeenCalledWith(
                    expect.stringContaining('INSERT INTO bookings'),
                    [
                      'John Doe',
                      'john.doe@example.com',
                      'Consultation',
                      expect.any(Date), // Check for a Date object
                      '10:00',
                      '11:00', // Assuming 60 min duration
                      'Need help with setup',
                      'Pending',
                    ]
                  );
                  expect(pool.query).toHaveBeenCalledWith(
                    expect.stringContaining('INSERT INTO booking_services'),
                    [1, 1, 2, 200]
                  );
                  expect(pool.query).toHaveBeenCalledWith(
                    expect.stringContaining('UPDATE bookings'),
                    [200, 1]
                  );
                });

                it('should return 400 if no services are provided', async () => {
                  const bookingData = {
                    name: 'John Doe',
                    email: 'john.doe@example.com',
                    date: '2024-07-28',
                    time: '10:00',
                    timezone: 'America/New_York',
                    topic: 'Consultation',
                    message: 'Need help with setup',
                    services: [],
                  };

                  const response = await request(app)
                    .post('/api/bookings')
                    .send(bookingData);

                  expect(response.status).toBe(400);
                  expect(response.body).toHaveProperty('success', false);
                  expect(response.body).toHaveProperty('message', 'At least one service must be provided for the booking.');
                  expect(pool.query).not.toHaveBeenCalled();
                });

                it('should return 400 if serviceId is not found', async () => {
                  // Mock database queries
                  pool.query
                    .mockResolvedValueOnce({ rows: [{ booking_id: 1 }] }) // Mock booking insert
                    .mockResolvedValueOnce({ rows: [] }); // Mock service query - no service found

                  const bookingData = {
                    name: 'John Doe',
                    email: 'john.doe@example.com',
                    date: '2024-07-28',
                    time: '10:00',
                    timezone: 'America/New_York',
                    topic: 'Consultation',
                    message: 'Need help with setup',
                    services: [{ serviceId: 999, quantity: 2 }], // Invalid service ID
                  };

                  const response = await request(app)
                    .post('/api/bookings')
                    .send(bookingData);

                  expect(response.status).toBe(400);
                  expect(response.body).toHaveProperty('success', false);
                  expect(response.body).toHaveProperty('message', 'Service with ID 999 not found');
                  expect(pool.query).toHaveBeenCalledTimes(2);
                });

                // Add more test cases for other scenarios (e.g., database errors)
              });
              describe('GET /api/services', () => {
                it('should get all services', async () => {
                  // Mock database query
                  pool.query.mockResolvedValueOnce({
                    rows: [
                      { service_id: 1, name: 'Service 1', default_price: 10 },
                      { service_id: 2, name: 'Service 2', default_price: 20 },
                    ],
                    rowCount: 2,
                  });

                  const response = await request(app).get('/api/services');

                  expect(response.status).toBe(200);
                  expect(response.body).toHaveProperty('success', true);
                  expect(response.body).toHaveProperty('count', 2);
                  expect(response.body.services).toHaveLength(2);
                  expect(pool.query).toHaveBeenCalledTimes(1);
                  expect(pool.query).toHaveBeenCalledWith('SELECT * FROM services ORDER BY service_id');
                });

                it('should handle errors when fetching services', async () => {
                  // Mock database query to reject
                  pool.query.mockRejectedValueOnce(new Error('Database error'));

                  const response = await request(app).get('/api/services');

                  expect(response.status).toBe(500);
                  expect(response.body).toHaveProperty('success', false);
                  expect(response.body).toHaveProperty('message', 'Failed to fetch services');
                  expect(response.body).toHaveProperty('error', 'Database error');
                  expect(pool.query).toHaveBeenCalledTimes(1);
                });
              });
            });
            