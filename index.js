// import dependencies
const cTable = require('console.table');
const inquirer = require('inquirer');
const mysql = require('mysql2');
require('dotenv').config()

// create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'employee_db',
})

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected as id' + connection.threadId);
    userPrompt();
})

// function to start user prompts
function userPrompt() {
    // prompt showing user available actions
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'choice',
                message: 'What would you like to do?',
                choices: [
                    'View all departments',
                    'View all roles',
                    'View all employees',
                    'Add a department',
                    'Add a role',
                    'Add an employee',
                    'Update an employee role',
                    'Quit'
                ]
            }
        ])
        // responding to user choice
        .then((answers) => {
            switch (answers.choice) {
                case 'View all departments':
                    viewAllDepartments();
                    break;
                case 'View all roles':
                    viewAllRoles();
                    break;
                case 'View all employees':
                    viewAllEmployees();
                    break;
                case 'Add a department':
                    addDepartment();
                    break;
                case 'Add a role':
                    addRole();
                    break;
                case 'Add an employee':
                    addEmployee();
                    break;
                case 'Update an employee role':
                    updateEmployeeRole();
                    break;
                case 'Quit':
                    connection.end();
                    break;
            }
        })
        .catch(err => {
            console.error(err);
        });
};

// function to display table of all departments
function viewAllDepartments() {
    const sql = 'SELECT * FROM department';
    connection.query(sql, (err, res) => {
        if (err) throw err;
        // using console.table npm to display table
        console.table(res);
        //  prompts user for next choice of action
        userPrompt();
    })
}

// function to display table of all roles
function viewAllRoles() {
    const sql = 'SELECT r.id, r.title, d.name AS department, r.salary FROM role r JOIN department d ON r.department_id = d.id ORDER BY r.id;';
    connection.query(sql, (err, res) => {
        if (err) throw err;
        // using console.table npm to display table
        console.table(res);
        //  prompts user for next choice of action
        userPrompt();
    })
}

// function to display table of all employees
function viewAllEmployees() {
    const sql = 'SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id;';
    connection.query(sql, (err, res) => {
        if (err) throw err;
        // using console.table npm to display table
        console.table(res);
        //  prompts user for next choice of action
        userPrompt();
    })
}

// function to add department to data base
function addDepartment() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'newDepartment',
                message: 'What is the name of the new department?'
            }
        ])
        .then((answers) => {
            const sql = 'INSERT INTO department (name) VALUES (?)';
            connection.query(sql, answers.newDepartment, (err, res) => {
                if (err) throw err;
                console.log(`Added ${answers.newDepartment} to the database`)
                userPrompt();
            });
        })
        .catch(err => {
            console.error(err);
        });
}

// function to add new role
function addRole() {
    // array to store departmentChoices for prompt list
    const listOfDept = [];
    // get department table
    connection.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        res.forEach(function(department){
            let deptChoice = {name: department.name, value: department.id}
            listOfDept.push(deptChoice);
        })
    })

    inquirer
        .prompt([
            {
                type: 'input',
                name: 'newRole',
                message: 'What is the name of the role?'
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What is the salary of the role?'
            },
            {
                type: 'list',
                name: 'departmentChoices',
                message: 'Which department does the role belong to?',
                choices: listOfDept
            }
        ])
        .then((answers) => {
            // add role details
            const sql = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
            connection.query(sql, [answers.newRole, answers.salary, answers.departmentChoices], (err, res) => {
                if (err) throw err;
                console.log(`Added ${answers.newRole} to the database`)
                userPrompt();
            });
        })
        .catch(err => {
            console.error(err);
        });
}

// function to add new employee
function addEmployee() {
    // get role table to create list of roles for prompt
    const listOfRoles = []
    connection.query('SELECT * FROM role', (err, res) => {
        if (err) throw err;
        res.forEach(function(role){
            let roles = {name: role.title, value: role.id}
            listOfRoles.push(roles);
        })
    })

    // get employee table to create list of employees for prompt
    const listOfEmployees = []
    let noManager = {name: 'None', value: null}
    listOfEmployees.push(noManager);
    connection.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;
        res.forEach(function(employee){
            let managers = {name: `${employee.first_name} ${employee.last_name}`, value: employee.id}
            listOfEmployees.push(managers);
        })
    })

    inquirer
        .prompt([
            {
                type: 'input',
                name: 'firstName',
                message: `What is the employee's first name?`
            },
            {
                type: 'input',
                name: 'lastName',
                message: `What is the employee's last name?`
            },
            {
                type: 'list',
                name: 'employeeRole',
                message: `What is the employee's role?`,
                choices: listOfRoles
            },
            {
                type: 'list',
                name: 'employeeManager',
                message: `Who is the employee's manager?`,
                choices: listOfEmployees
            },
        ])
        .then((answers) => {
            const sql = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
            connection.query(sql, [answers.firstName, answers.lastName, answers.employeeRole, answers.employeeManager], (err, res) => {
                if (err) throw err;
                console.log(`Added ${answers.firstName} ${answers.lastName} to the database`)
                userPrompt();
            });
        })
        .catch(err => {
            console.error(err);
        });
}

// function to update employee role
function updateEmployeeRole() {
    // get employee table to create list of employees for prompt
    const listOfEmployees = []
    connection.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;
        res.forEach(function(employee){
            let employees = {name: `${employee.first_name} ${employee.last_name}`, value: employee.id}
            listOfEmployees.push(employees);
        })
    })
    
    // get role table to create list of roles for prompt
    const listOfRoles = []
    connection.query('SELECT * FROM role', (err, res) => {
        if (err) throw err;
        res.forEach(function(role){
            let roles = {name: role.title, value: role.id}
            listOfRoles.push(roles);
        })
    })
    
    inquirer
        .prompt([
            // list type prompt wont work when its first prompt (reason behind inclusion of random prompt)
            {
                type: 'input',
                name: 'random',
                message: `Press enter key to continue`
            },
            {
                type: 'list',
                name: 'employee',
                message: `Which employee's role do you want to update?`,
                choices: listOfEmployees
            },
            {
                type: 'list',
                name: 'employeeRole',
                message: `Which role do you want to assign the selected employee?`,
                choices: listOfRoles
            }
        ])
        .then((answers) => {
            // update employee role using employee id and id of new updated role
            const sql = `UPDATE employee SET role_id = ${answers.employeeRole} WHERE id = ${answers.employee}`;
            connection.query(sql, (err, res) => {
                if (err) throw err;
                console.log(`Updated employee's role`)
                userPrompt();
            });
        })
        .catch(err => {
            console.error(err);
        });
}