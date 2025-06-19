/*const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};*/

const { Pool } = require('pg');
const config = require('./config');

const pool = new Pool({
  user: config.database.user,
  host: config.database.host,
  database: config.database.name || config.database.database,
  password: config.database.password,
  port: config.database.port,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};