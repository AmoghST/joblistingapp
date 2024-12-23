const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'job_listing',
  waitForConnections: true,
  connectionLimit: 10, 
  queueLimit: 0,     
});

// Export the pool to use in your application
module.exports = pool;
