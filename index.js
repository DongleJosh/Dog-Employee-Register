const inquirer = require('inquirer');
const db = require('./db');
require('console.table');

const mysql = require('mysql2/promise');

// create a pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'DrewsBrews',
  database: 'employee_db',
  namedPlaceholders: true,
});

const start = () => {
  inquirer
    .prompt({
      type: 'list',
      name: 'choice',
      message: 'What would you like to do?',
      choices: [
        'View All Departments',
        'View All Roles',
        'View All Employees',
        'Add Department',
        'Add Role',
        'Add Employee',
        'Update Employee Role',
        'Quit',
      ],
    })
    .then((answer) => {
      switch (answer.choice) {
        case 'View All Departments':
          viewAllDepartments();
          break;
        case 'View All Roles':
          viewAllRoles();
          break;
        case 'View All Employees':
          viewAllEmployees();
          break;
        case 'Add Department':
          addDepartment();
          break;
        case 'Add Role':
          addRole();
          break;
        case 'Add Employee':
          addEmployee();
          break;
        case 'Update Employee Role':
          updateEmployeeRole();
          break;
        case 'Quit':
          console.log('Goodbye!');
          process.exit(0);
        default:
          console.log(`Invalid action: ${answer.action}`);
          break;
      }
    })
    .catch((error) => console.error(error));
};

// View all departments
const viewAllDepartments = () => {
  db.query('SELECT * FROM department')
    .then((departments) => {
      console.table(departments);
      start();
    })
    .catch((err) => {
      throw err;
    });
};

// View all roles
const viewAllRoles = () => {
  db.query(`SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department ON role.department_id = department.id;`)
    .then((roles) => {
      console.table(roles);
      start();
    })
    .catch((err) => {
      throw err;
    });
};

// View all employees
const viewAllEmployees = () => {
  db.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id;`)
    .then((employees) => {
      console.table(employees);
      start();
    })
    .catch((err) => {
      throw err;
    });
};

const addEmployee = async () => {
  try {
    // Get roles from database
    const roles = await db.query('SELECT * FROM role');
    // Get employees from database
    const employees = await db.query('SELECT * FROM employee');

    const employeeData = await inquirer.prompt([
      {
        type: 'input',
        name: 'first_name',
        message: "What is the employee's first name?",
      },
      {
        type: 'input',
        name: 'last_name',
        message: "What is the employee's last name?",
      },
      {
        type: 'list',
        name: 'role',
        message: "What is the employee's role?",
        choices: roles.map((role) => ({
          name: role.title,
          value: role.id,
        })),
      },
      {
        type: 'list',
        name: 'manager',
        message: "Who is the employee's manager?",
        choices: employees.map((employee) => ({
          name: `${employee.first_name} ${employee.last_name}`,
          value: employee.id,
        })),
      },
    ]);

    await db.query(
      'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
      [
        employeeData.first_name,
        employeeData.last_name,
        employeeData.role,
        employeeData.manager,
      ]
    );

    console.log('Employee added successfully!');
    start();
  } catch (error) {
    console.error(error);
  }
};

db.promise = () => {
  return db;
};

const addDepartment = async () => {
  try {
    const { departmentName } = await inquirer.prompt([
      {
        type: 'input',
        name: 'departmentName',
        message: 'Enter department name:',
        validate: (input) => {
          if (!input) {
            return 'Please enter a name for the department.';
          }
          return true;
        },
      },
    ]);

    await db.promise().query('INSERT INTO department (name) VALUES (?)', [departmentName]);
    console.log(`Added department: ${departmentName}`);
    start();
  } catch (err) {
    console.error(err);
  }
};

module.exports = addDepartment;

const addRole = async () => {
  try {
    const [departments] = await pool.query('SELECT * FROM department');

    const departmentChoices = departments.map((department) => ({
      name: department.name,
      value: department.id,
    }));

    const { title, salary, departmentId } = await inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Enter role title:',
        validate: (input) => {
          if (!input) {
            return 'Please enter a title for the role.';
          }
          return true;
        },
      },
      {
        type: 'input',
        name: 'salary',
        message: 'Enter role salary:',
        validate: (input) => {
          if (!input) {
            return 'Please enter a salary for the role.';
          }
          if (isNaN(input)) {
            return 'Please enter a valid number for the salary.';
          }
          return true;
        },
      },
      {
        type: 'list',
        name: 'departmentId',
        message: 'Select department:',
        choices: departmentChoices,
      },
    ]);

    await pool.query(
      'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)',
      [title, salary, departmentId]
    );

    console.log(`Added role: ${title}`);
    start();
  } catch (err) {
    console.error(err);
  }
};

const updateEmployeeRole = async () => {
  try {
    // Get list of employees
    const [employeesResult, employeesMetadata] = await db.query('SELECT * FROM employee');
    if (!Array.isArray(employeesResult)) {
      throw new Error('Employees query did not return an array');
    }

    // Map employee choices to an array of objects
    const employeeChoices = employeesResult.map((employee) => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id,
    }));

    // Get list of roles
    const [rolesResult, rolesMetadata] = await db.query('SELECT * FROM role');

    // Check if roles query returned an array
    if (!Array.isArray(rolesResult)) {
      throw new Error('Roles query did not return an array');
    }

    // Map role choices to an array of objects
    const roleChoices = rolesResult.map((role) => ({
      name: role.title,
      value: role.id,
    }));

    // Ask user which employee to update and which role to assign to them
    const { employeeId, roleId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'employeeId',
        message: 'Select employee to update:',
        choices: employeeChoices,
      },
      {
        type: 'list',
        name: 'roleId',
        message: 'Select new role for employee:',
        choices: roleChoices,
      },
    ]);

    // Update the employee's role in the database
    await db.query('UPDATE employee SET role_id = ? WHERE id = ?', [roleId, employeeId]);

    console.log('Employee role updated successfully.');
    start();
  } catch (err) {
    console.error(err);
  }
};


// Start the application
start();

