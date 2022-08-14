INSERT INTO department (name)
VALUES 
('Engineering'),
('Finance'),
('Legal'),
('Sales');

INSERT INTO role (title, salary, department_id)
VALUES 
('Sales Lead', 100000, 4),
('Salesperson', 80000, 4),
('Lead Engineer', 150000, 1),
('Software Engineer', 120000, 1),
('Account Manager', 160000, 2),
('Accountant', 125000, 2),
('Legal Team Lead', 250000, 3),
('Lawyer', 190000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('Taylor', 'Meyer', 1, null),
('Aleesha', 'Ahmad', 2, 1),
('Jamel', 'Mcarthur', 3, null),
('Hester', 'Paterson', 4, 3),
('Roisin', 'Burnett', 5, null),
('Ocean', 'Sellers', 6, 5),
('Brady', 'Quintero', 7, null),
('Suman', 'Turner', 8, 7);