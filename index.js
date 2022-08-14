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