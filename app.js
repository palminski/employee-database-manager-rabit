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
//EMPLOYEE
const addEmployee = function(rolesArray, managersArray) {
    inquirer.prompt(
        [
            {
                name: 'firstName',
                type: 'input',
                message: "Please Enter Employee's first name",
                validate: validateInput
            },
            {
                name: 'lastName',
                type: 'input',
                message: "Please Enter Employee's last name",
                validate: validateInput
            },
            {
                name: 'role',
                type: "list",
                message: "What is this employee's role?",
                choices: rolesArray
            },
            {
                name: 'manager',
                type: "list",
                message: "Who is this employees manager?",
                choices: managersArray
            }
        ]
    )
    .then(answers => {
        console.log(answers);
        console.log('------------------------------');
        prompUser();
    });
}

//ROLE
const addRole = function(departmentsArray) {

    inquirer.prompt(
        [
            {
                name: 'roleName',
                type: 'input',
                message: 'Please Enter Name of role to add',
                validate: validateInput
            },
            {
                name: 'salary',
                type: 'input',
                message: "Please Enter Role's Salary",
                validate: validateInput
            },
            {
                name: 'choice',
                type: "list",
                message: "What Department doe this role belong to?",
                choices: departmentsArray
            }
        ]
    )
    .then(answers => {
        console.log(answers);
        console.log('------------------------------');
        prompUser();
    });
}

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
        .then( answers => {
            console.log("Department Added!");
            console.log('------------------------------');
            prompUser();
        })
    });
}
//FUNCTIONS TO UPDATE DATA
//<><><><><><><><><><><><><>
//UPDATE EMPLOYEES ROLE
const updateEmployeeRole = function(employeesArray,rolesArray){
    inquirer.prompt(
        [
            {
                name: 'employee',
                type: 'list',
                message: 'Choose name of employee to update',
                choices: employeesArray
            },
            {
                name: 'newRole',
                type: 'list',
                message: 'Choose new role',
                choices: rolesArray
            }
        ]
    )
    .then(answers => {
        console.log(answers);
        console.log('------------------------------');
        prompUser();
    })
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
                        'Add Employee',
                        'Add Role',
                        'Add Department',
                        'Update Employee'] 
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
        else if (answers.choice === 'Add Role'){
            let departmentsArray = [];

            db.promise().query(`SELECT name FROM departments`)
            .then(([rows, fields]) => {
                
                for (let i=0; i < rows.length; i++){
                    departmentsArray.push(rows[i].name);
                }
                return departmentsArray;
            })
            .then(departmentsArray => addRole(departmentsArray));
        }  
        else if (answers.choice === 'Add Employee'){
            let rolesArray = [];
            let managersArray = ["None"];

            db.promise().query(`SELECT title FROM roles`)
            .then(([rows, fields]) => {
                
                for (let i=0; i < rows.length; i++){
                    rolesArray.push(rows[i].title);
                }
                return rolesArray;
            })
            .then(db.promise().query(`SELECT first_name FROM employees`)
            .then(([rows, fields]) => {
                for (let i=0; i < rows.length; i++){
                    managersArray.push(rows[i].first_name);
                }
                return managersArray;
            })
            )
            .then(rolesArray => addEmployee(rolesArray,managersArray));
        }
        else if (answers.choice === 'Update Employee') {
            let employeesArray = [];
            let rolesArray =[];
            db.promise().query('SELECT first_name FROM employees')
            .then(([rows, fields]) => {
                for (let i=0; i < rows.length; i++){
                    employeesArray.push(rows[i].first_name);
                }
                return employeesArray;
            })
            .then(db.promise().query(`SELECT title FROM roles`)
            .then(([rows, fields]) => {
                for (let i=0; i < rows.length; i++){
                    rolesArray.push(rows[i].title);
                }
            }))
            .then(employeesArray => updateEmployeeRole(employeesArray,rolesArray))
            
        }  
    })
}

prompUser();
