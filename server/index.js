const express = require('express');
const cors = require('cors');
const {
    Pool
} = require('pg');
const moment = require('moment-timezone');
const winston = require('winston');
const config = require('./config');

const app = express();
const port = process.env.PORT || config.server.port || 5000;

// --- Winston Logging Setup ---
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.errors({
            stack: true
        }),
        winston.format.printf(({
            level,
            message,
            timestamp,
            stack
        }) => {
            if (stack) {
                return `${timestamp} [${level}] ${message} - ${stack}`;
            }
            return `${timestamp} [${level}] ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: 'server.log',
            level: 'info'
        }),
        new winston.transports.File({
            filename: 'server-error.log',
            level: 'error'
        }),
    ],
});
// --- End Winston Logging Setup ---

const pool = new Pool({
    user: config.database.user,
    host: config.database.host,
    database: config.database.database,
    password: config.database.password,
    port: config.database.port,
});

function calculateEndTime(startTime, durationMinutes) {
    const [hours, minutes] = startTime.split(':').map(Number);
    let endTimeMinutes = hours * 60 + minutes + parseInt(durationMinutes);
    const endHours = Math.floor(endTimeMinutes / 60) % 24;
    const endMinutes = endTimeMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
}

app.use(cors());
app.use(express.json());

app.post('/api/bookings', async (req, res) => {
    try {
        // --- Extract data from the request body ---
        const {
            name,
            email,
            date,
            time,
            timezone,
            topic,
            message,
            services,
        } = req.body;

        // --- Input Validation ---
        //  * It's crucial to validate all user-provided input to prevent errors
        //  * and potential security vulnerabilities.
        if (!name) return res.status(400).json({
            success: false,
            message: 'Name is required'
        });
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({
            success: false,
            message: 'Invalid email format'
        });
        if (!date) return res.status(400).json({
            success: false,
            message: 'Date is required'
        });
        if (!time) return res.status(400).json({
            success: false,
            message: 'Time is required'
        });
        if (!timezone) return res.status(400).json({
            success: false,
            message: 'Timezone is required'
        });
        if (!services || !Array.isArray(services) || services.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'At least one service must be provided for the booking.',
            });
        }

        // --- Date Handling ---
        //  * Use moment.js for robust date parsing and validation.
        //  * The 'true' parameter in moment() enables strict parsing,
        //  * meaning the input must exactly match the format.
        const parsedDate = moment(date, 'YYYY-MM-DD', true);
        if (!parsedDate.isValid()) {
            return res.status(400).json({
                success: false,
                message: 'Invalid date format (YYYY-MM-DD expected)'
            });
        }

        // --- Timezone Validation ---
        //  * Verify that the provided timezone is valid.
        if (!moment.tz.zone(timezone)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid timezone'
            });
        }

        // --- Time Conversion (12-hour to 24-hour) ---
        let startTime24HourFormat = time;
        if (time.includes('AM') || time.includes('PM')) {
            const [timePart, period] = time.split(' ');
            const [hours, minutes] = timePart.split(':').map(Number);

            let hours24 = hours;
            if (period === 'PM' && hours < 12) {
                hours24 = hours + 12;
            } else if (period === 'AM' && hours === 12) {
                hours24 = 0;
            }

            startTime24HourFormat = `${hours24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        }

        // --- Construct booking datetime string ---
        const bookingDateTimeWithZone = `${parsedDate.format('YYYY-MM-DD')}T${startTime24HourFormat}:00`;

        // --- Logging ---
        //  * Log the constructed datetime string for debugging purposes.
        logger.info(`Booking datetime: ${bookingDateTimeWithZone}, Timezone: ${timezone}`);

        // --- Timezone Conversion to UTC ---
        //  * Convert the booking time to UTC, which is a good practice
        //  * for storing times in a database.
        const bookingUTC = moment.tz(bookingDateTimeWithZone, timezone).utc().toDate();

        // --- Calculate End Time ---
        const endTimeIST = calculateEndTime(startTime24HourFormat, 60);

        // --- Database Transaction ---
        //  * Use a database transaction to ensure that either all database
        //  * operations succeed or none of them do. This maintains data consistency.
        await pool.query('BEGIN');

        // --- Insert Booking into Database ---
        const bookingResult = await pool.query(
            `INSERT INTO bookings (
                customer_name,
                customer_email,
                booking_subject,
                booking_utc,
                start_time_ist,
                end_time_ist,
                notes,
                booking_status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING booking_id`,
            [name, email, topic, bookingUTC, startTime24HourFormat, endTimeIST, message, 'Pending']
        );

        const bookingId = bookingResult.rows[0].booking_id;
        let totalRevenue = 0;

        // --- Process Services ---
        //  * Iterate through the services requested for the booking.
        for (const service of services) {
            const serviceResult = await pool.query(
                'SELECT service_id, default_price FROM services WHERE service_id = $1',
                [service.serviceId]
            );

            if (serviceResult.rows.length > 0) {
                const {
                    service_id,
                    default_price
                } = serviceResult.rows[0];
                const quantity = service.quantity || 1;
                const agreedPrice = default_price * quantity;

                await pool.query(
                    `INSERT INTO booking_services (
                        booking_id,
                        service_id,
                        quantity,
                        agreed_price
                    ) VALUES ($1, $2, $3, $4)`,
                    [bookingId, service_id, quantity, agreedPrice]
                );

                totalRevenue += agreedPrice;
            } else {
                //  * If a service is not found, rollback the transaction
                //  * and return an error.
                await pool.query('ROLLBACK');
                return res.status(400).json({
                    success: false,
                    message: `Service with ID ${service.serviceId} not found`,
                });
            }
        }

        // --- Update Booking Revenue ---
        await pool.query(
            'UPDATE bookings SET revenue = $1 WHERE booking_id = $2',
            [totalRevenue, bookingId]
        );

        // --- Commit Transaction ---
        await pool.query('COMMIT');

        // --- Logging ---
        logger.info('Booking created successfully:', {
            bookingId,
            totalRevenue
        });

        // --- Send Success Response ---
        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            bookingId,
            totalRevenue,
        });
    } catch (error) {
        // --- Error Handling ---
        //  * If any error occurs during the process, rollback the transaction
        //  * to ensure data consistency.
        await pool.query('ROLLBACK');

        logger.error('Error creating booking:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create booking. Please check your input data.',
            //  * In a production environment, it's generally best not to send
            //  * the raw error message to the client for security reasons.
            //  * You might want to log the specific error on the server
            //  * but send a generic message to the client.
            //error: error.message,
        });
    }
});

app.get('/api/services', async (req, res) => {
    res.set('Cache-Control', 'no-store');
    try {
        const result = await pool.query('SELECT * FROM services ORDER BY service_id');
        // logger.info('Services fetched successfully');
        res.status(200).json({
            success: true,
            count: result.rowCount,
            services: result.rows,
        });
    } catch (error) {
        logger.error('Error fetching services:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch services',
            error: error.message,
        });
    }
});

app.listen(port, () => {
    logger.info(`Server running on port ${port}`);
});