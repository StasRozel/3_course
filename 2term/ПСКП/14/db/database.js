const sql = require('mssql');
require('dotenv').config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_HOST,
    database: process.env.DB_NAME,
    options: {
        encrypt: true, 
        trustServerCertificate: true 
    }
};

const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

poolConnect.catch(err => {
    console.error('Database connection failed:', err);
});

module.exports = pool;