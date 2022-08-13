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
    console.log('Connected as id' + connection.threadId)
})