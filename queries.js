const db = require('./db');

// View all departments
const viewAllDepartments = async () => {
  try {
    const departments = await db.query('SELECT * FROM department');
    console.table(departments);
  } catch (err) {
    console.error(err);
  }
};

// View all roles
const viewAllRoles = async () => {
  try {
    const roles = await db.query('SELECT * FROM role');
    console.table(roles);
  } catch (err) {
    console.error(err);
  }
};

// View all employees
const viewAllEmployees = async () => {
  try {
    const employees = await db.query('SELECT * FROM employee');
    console.table(employees);
  } catch (err) {
    console.error(err);
  }
};

// Add a department
const addDepartment = async (name) => {
  try {
    await db.query('INSERT INTO department (name) VALUES (?)', [name]);
    console.log(`Added ${name} department to the database`);
  } catch (err) {
    console.error(err);
  }
};

// Add a role
const addRole = async (title, salary, departmentId) => {
  try {
    await db.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [title, salary, departmentId]);
    console.log(`Added ${title} role to the database`);
  } catch (err) {
    console.error(err);
  }
};

// Add an employee
const addEmployee = async (firstName, lastName, roleId, managerId) => {
  try {
    await db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [firstName, lastName, roleId, managerId]);
    console.log(`Added ${firstName} ${lastName} to the database`);
  } catch (err) {
    console.error(err);
  }
};

// Update an employee role
const updateEmployeeRole = async (employeeId, roleId) => {
  try {
    await db.query('UPDATE employee SET role_id = ? WHERE id = ?', [roleId, employeeId]);
    console.log(`Updated employee with ID ${employeeId} to new role with ID ${roleId}`);
  } catch (err) {
    console.error(err);
  }
};

module.exports = { viewAllDepartments, viewAllRoles, viewAllEmployees, addDepartment, addRole, addEmployee, updateEmployeeRole };
