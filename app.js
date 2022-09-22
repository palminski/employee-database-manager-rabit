//dependancies

const inquirer = require('inquirer');

const cTable = require('console.table');

const db = require('./db/connections.js');

const validateInput = require('./utils/validate-input.js');

//FUNCTIONS TO DISPLAY DATA
//<><><><><><><><><><><><><><>
//EMLOYEES
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


    db.promise().query(sql)
    .then( ([rows,fields]) => {
        console.table(rows);
    })
    .then(prompUser)
    .catch(console.log());
        
};
//ROLES
const displayRoles = function() {
    const sql = `SELECT roles.id, roles.title, roles.salary,
                departments.name AS department
                FROM roles 
                LEFT JOIN departments
                ON roles.department_id = departments.id`;
    db.promise().query(sql)
        .then(([rows, fields]) => {
            console.table(rows);
        })
        .then(prompUser)
        .catch(console.log());
};
//DEPARTMENTS
const displayDepartments = function () {
    const sql = `SELECT * FROM departments`;
    db.promise().query(sql)
        .then(([rows, fields]) => {
            console.table(rows);
        })
        .then(prompUser)
        .catch(console.log());
};

//FUNCTIONS TO ADD DATA
//<><><><><><><><><><><><><>
//ROLE


//DEPARTMENT
const addDepartment = function() {
    inquirer.prompt(
        [
            {
                name: 'departmentName',
                type: 'input',
                message: 'Please Enter Name of Department to add',
                validate: validateInput
            }
        ]
    )
    .then(answer => {
        newDepartment = (answer.departmentName.trim());
        const sql = `INSERT INTO departments (name)
                    VALUES (?)`;
        const params = [newDepartment];
        db.promise().query(sql, params)
        .then(console.log('Success! Department Added!'))
        .then(prompUser)
    });
}

//PROMPT USER
const prompUser = function(){
    inquirer.prompt(
        [
            {
                name: 'choice',
                type: "list",
                message: "What would you like to do?",
                choices: ['View Employees',
                        "View Roles",
                        "View Departments",
                        'Add Department'] 
            }
        ]
    )
    .then((answers) => {
        
        if (answers.choice === 'View Employees'){
            displayEmployees();
        }
        else if (answers.choice === 'View Roles'){
            displayRoles();
        }
        else if (answers.choice === 'View Departments'){
            displayDepartments();
        }  
        else if (answers.choice === 'Add Department'){
            addDepartment();
        }  
    })
}

prompUser();

// displayEmployees();

// displayRoles();
// displayDepartments();
// console.log("hello world");