// config.js
module.exports = {
  database: {  // Changed from db to database to match usage in index.js
    user: 'mate',
    host: 'localhost',
    database: 'portfolio_db',  // This is the database name property
    password: 'tEster@2025',
    port: 5432
  },
  server: {
    port: 5000
  },
  PUBLIC_URL: '/'  // Added this for env-config.js to use
};