//dependancies
const mysql = require('mysql2');
const inquirer = require('inquirer');
const password = require('./passwords/password');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: password,
        database: 'company'
    },
    console.log('connected to database')
);

//FUNCTIONS TO DISPLAY DATA
const displayEmployees = function() {
    const sql = `SELECT e.id, e.first_name,e.last_name, 
                roles.title AS title,
                roles.salary,
                departments.name AS department,
                employees.last_name AS manager
                FROM employees AS e
                LEFT JOIN roles
                ON e.role_id = roles.id
                LEFT JOIN departments
                ON roles.department_id = departments.id
                LEFT JOIN employees
                On e.manager_id = employees.id
                `;


    db.query(sql, (err, rows) => {
        if (err) {
            console.log('An Error has Occured');
            console.log(err.message);
            return;
        }
        console.table(rows);
    });
};

const displayRoles = function() {
    const sql = `SELECT roles.id, roles.title, roles.salary,
                departments.name AS department
                FROM roles 
                LEFT JOIN departments
                ON roles.department_id = departments.id`;
    db.query(sql, (err, rows) => {
        if (err) {
            console.log('An Error has Occured');
            console.log(err.message);
            return;
        }
        console.table(rows);
    });
};

const displayDepartments = function() {
    const sql = `SELECT * FROM departments`;
    db.query(sql, (err, rows) => {
        if (err) {
            console.log('An Error has Occured');
            return;
        }
        console.table(rows);
    });
};

//PROMPT USER
const initialChoice = function(){
    inquirer.prompt(
        [
            {
                name: 'choice',
                type: "list",
                message: "What would you like to do?",
                choices: ['View Employees',
                        "View Roles",
                        "View Departments"] 
            }
        ]
    )
    .then((answers) => {
        console.log(answers);
        if (answers.choice === 'View Employees'){
            displayEmployees();
        }
        else if (answers.choice === 'View Roles'){
            displayRoles();
        }
        else if (answers.choice === 'View Departments'){
            displayDepartments();
        }
    })
}

initialChoice()

// displayEmployees();
// displayRoles();
// displayDepartments();
