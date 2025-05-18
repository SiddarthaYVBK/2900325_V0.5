            const { Pool } = require('pg');
            const express = require('express');
            const config = require('../../config');

            // Mock the pg module and express app
            jest.mock('pg', () => {
              const Pool = jest.fn();
              Pool.prototype.query = jest.fn(); // Add a mock query function
              return { Pool };
            });

            jest.mock('express', () => {
              const app = {
                use: jest.fn(),
                post: jest.fn(),
                get: jest.fn(),
                listen: jest.fn(),
              };
              const express = jest.fn(() => app);
              express.json = jest.fn(() => 'mocked express.json'); // Mock express.json
              return express;
            });

            // Clear mocks before each test
            beforeEach(() => {
              jest.clearAllMocks();
              process.env.PORT = ''; // Reset environment variable
            });
            describe('Index.js Configuration and Setup', () => {
              it('should configure the database pool with values from config', () => {
                // Import index.js *inside* the test, after the mocks are set up
                require('../../index');
                expect(Pool).toHaveBeenCalledWith({
                  user: config.database.user,
                  host: config.database.host,
                  database: config.database.database,
                  password: config.database.password,
                  port: config.database.port,
                });
              });

              it('should use config.server.port when process.env.PORT is not set', () => {
                require('../../index');
                const app = express();
                expect(app.listen).toHaveBeenCalledWith(config.server.port, expect.any(Function));
              });

              it('should override config.server.port with process.env.PORT', () => {
                process.env.PORT = '1234';
                require('../../index');
                const app = express();
                expect(app.listen).toHaveBeenCalledWith('1234', expect.any(Function));
              });

              it('should set up middleware', () => {
                require('../../index');
                const app = express();
                expect(app.use).toHaveBeenCalledWith('mocked express.json');
                expect(app.use).toHaveBeenCalledTimes(2); //cors and express.json
              });
            });
            