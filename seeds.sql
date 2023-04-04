-- departments table
INSERT INTO department (id, name) VALUES (1, 'Sales');
INSERT INTO department (id, name) VALUES (2, 'Engineering');
INSERT INTO department (id, name) VALUES (3, 'Marketing');

-- roles table
INSERT INTO role (id, title, salary, department_id) VALUES (1, 'Salesperson', 50000, 1);
INSERT INTO role (id, title, salary, department_id) VALUES (2, 'Engineer', 80000, 2);
INSERT INTO role (id, title, salary, department_id) VALUES (3, 'Marketing Manager', 90000, 3);

-- employees table
INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES (1, 'John', 'Doe', 1, NULL);
INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES (2, 'Jane', 'Smith', 2, 1);
INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES (3, 'Bob', 'Johnson', 3, 1);