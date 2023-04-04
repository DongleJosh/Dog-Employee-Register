const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  port: '3306',
  user: 'root',
  password: 'DrewsBrews',
  database: 'employee_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = {
  query: async function (sql, values) {
    const [rows] = await pool.execute(sql, values);
    return rows;
  }
};