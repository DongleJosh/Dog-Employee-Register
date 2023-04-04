const db = require('./db');

module.exports = {
  getAllDepartments: () => {
    const sql = 'SELECT * FROM department';
    return db.query(sql);
  },
  getAllRoles: () => {
    const sql = 'SELECT * FROM role';
    return db.query(sql);
  },
  getAllEmployees: () => {
    const sql = 'SELECT * FROM employee';
    return db.query(sql);
  }
};
