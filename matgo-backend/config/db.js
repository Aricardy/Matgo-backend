import dotenv from 'dotenv';
dotenv.config();
dotenv.config();


import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'crossover.proxy.rlwy.net',
  port: process.env.DB_PORT || 10392,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'yDSljXERVwpjcGQTDtZccWciNosoooyU',
  database: process.env.DB_NAME || 'railway',
  ssl: {
    rejectUnauthorized: false // Allow self-signed cert for Railway
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
