const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'DrewsBrews',
  database: 'employee_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = {
  query: (sql, values) => {
    return pool.execute(sql, values);
  }
};