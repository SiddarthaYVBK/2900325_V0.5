/*// env-config.js
const serverConfig = require('./server/config.js');

// Set environment variables needed by the React build process
process.env.PUBLIC_URL = serverConfig.PUBLIC_URL || '/';

// You can set other environment variables needed by React here
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

console.log('Environment configuration loaded:');
console.log('- PUBLIC_URL:', process.env.PUBLIC_URL);*/


// env-config.js
const serverConfig = require('./server/config.js');

// Set environment variables needed by the React build process
process.env.PUBLIC_URL = serverConfig.PUBLIC_URL || '/';

// You can set other environment variables needed by React here
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

console.log('Environment configuration loaded:');
console.log('- PUBLIC_URL:', process.env.PUBLIC_URL);