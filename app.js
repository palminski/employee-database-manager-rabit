//dependancies

const inquirer = require('inquirer');

const cTable = require('console.table');

const db = require('./db/connections.js');

const { validateInput, validateNumber }= require('./utils/validate-input.js');


//FUNCTIONS TO DISPLAY DATA
//<><><><><><><><><><><><><><>
//EMLOYEES
const displayEmployees = function() {
    const sql = `SELECT e.id, e.first_name,e.last_name, 
                roles.title AS title,
                roles.salary,
                departments.name AS department,
                CONCAT(employees.first_name, ' ', employees.last_name) AS manager
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
        console.log('---EMPLOYEES------------------------------\n');
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
            console.log('---ROLES----------------------------------\n');

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
            console.log('---DEPARTMENTS----------------------------\n');
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
        newFirstName = (answers.firstName.trim());
        newLastName = (answers.lastName.trim());

        const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
                    VALUES (?,?,(SELECT id FROM roles WHERE title = ?),(SELECT id FROM employees AS e WHERE CONCAT(first_name, ' ', last_name) = ?))`;
        const params = [newFirstName,newLastName,answers.role,answers.manager];

        db.promise().query(sql, params)
        .then( () => {
            console.log('------------------------------');
            console.log("New Employee Added!\n");
            console.log('------------------------------');
            prompUser();
        })

    });
}

//ROLE
const addRole = function(departmentsArray) {

    inquirer.prompt(
        [
            {
                name: 'title',
                type: 'input',
                message: 'Please Enter Name of role to add',
                validate: validateInput
            },
            {
                name: 'salary',
                type: 'input',
                message: "Please Enter Role's Salary",
                validate: validateNumber
            },
            {
                name: 'department',
                type: "list",
                message: "What Department doe this role belong to?",
                choices: departmentsArray
            }
        ]
    )
    .then(answers => {
        newTitle = (answers.title.trim());
        newSalary = (answers.salary.trim());

        const sql = `INSERT INTO roles (title, salary, department_id)
                    VALUES (?,?,(SELECT id FROM departments WHERE name = ?))`;
        const params = [newTitle, newSalary, answers.department];
        db.promise().query(sql, params)
        .then( () => {
            console.log('------------------------------');
            console.log("New Role Added!\n");
            console.log('------------------------------');
            prompUser();
        })
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
            console.log('------------------------------');
            console.log("Department Added!\n");
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
                name: 'role',
                type: 'list',
                message: 'Choose new role',
                choices: rolesArray
            }
        ]
    )
    .then(answers => {
        const sql = `UPDATE employees SET role_id = (SELECT id FROM roles WHERE title = ?) WHERE CONCAT(first_name, ' ', last_name) = ?`;
        const params = [answers.role, answers.employee];
        db.promise().query(sql, params)
        .then( () => {
            console.log('------------------------------');
            console.log("Employee Role Updated!\n");
            console.log('------------------------------');
            prompUser();
        })
    })
}

//UPDATE MANAGER WIP
const updateEmployeeManager = function(employeesArray,managersArray){
    inquirer.prompt(
        [
            {
                name: 'employee',
                type: 'list',
                message: 'Choose name of employee to update',
                choices: employeesArray
            },
            {
                name: 'manager',
                type: 'list',
                message: 'Choose new manager',
                choices: managersArray
            }
        ]
    )
    .then(answers => {
        const sql = `UPDATE employees SET manager_id = (SELECT id FROM employees AS e WHERE CONCAT(first_name, ' ', last_name) = ?) WHERE CONCAT(first_name, ' ', last_name) = ?`;
        const params = [answers.manager, answers.employee];
        db.promise().query(sql, params)
        .then( () => {
            console.log('------------------------------');
            console.log("Employee Manager Updated!\n");
            console.log('------------------------------');
            prompUser();
        })
    })
}

//DELETE DATA
//Delete Employee
const deleteEmployee = function(employeesArray) {
    inquirer.prompt(
        [
            {
                name: 'employee',
                type: 'list',
                message: 'Choose name of employee to Delete',
                choices: employeesArray
            }
        ]
    )
    .then(answer => {
        const sql = `DELETE FROM employees WHERE CONCAT(first_name, ' ', last_name) = ?`;
        const params = [answer.employee];
        db.promise().query(sql, params)
        .then( () => {
            console.log('------------------------------');
            console.log("Employee Deleted!\n");
            console.log('------------------------------');
            prompUser();
        })
    })
};

const deleteRole = function(rolesArray) {
    inquirer.prompt(
        [
            {
                name: 'role',
                type: 'list',
                message: 'Choose name of role to Delete',
                choices: rolesArray
            }
        ]
    )
    .then(answer => {
        const sql = `DELETE FROM roles WHERE title = ?`;
        const params = [answer.role];
        db.promise().query(sql, params)
        .then( () => {
            console.log('------------------------------');
            console.log("Role Deleted!\n");
            console.log('------------------------------');
            prompUser();
        })
    })
};

const deleteDepartment = function(departmentsArray) {
    inquirer.prompt(
        [
            {
                name: 'department',
                type: 'list',
                message: 'Choose name of department to Delete',
                choices: departmentsArray
            }
        ]
    )
    .then(answer => {
        const sql = `DELETE FROM departments WHERE name = ?`;
        const params = [answer.department];
        db.promise().query(sql, params)
        .then( () => {
            console.log('------------------------------');
            console.log("Department Deleted!\n");
            console.log('------------------------------');
            prompUser();
        })
    })
};

//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
//PROMPT USER
const prompUser = function(){
    inquirer.prompt(
        [
            {
                name: 'choice',
                type: "list",
                message: "What would you like to do?\n",
                choices: ['View Employees',
                        "View Roles",
                        "View Departments",
                        'Add Employee',
                        'Add Role',
                        'Add Department',
                        'Update Employee Role',
                        // 'Update Employee Manager',
                        'Delete Employee',
                        'Delete Role',
                        'Delete Department',
                        'Exit'] 
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
            .then(db.promise().query(`SELECT CONCAT(first_name, ' ' , last_name) AS full_name FROM employees`)
            .then(([rows, fields]) => {
                for (let i=0; i < rows.length; i++){
                    managersArray.push(rows[i].full_name);
                }
                return managersArray;
            })
            )
            .then(rolesArray => addEmployee(rolesArray,managersArray));
        }

        else if (answers.choice === 'Update Employee Role') {
            let employeesArray = [];
            let rolesArray =[];
            db.promise().query("SELECT CONCAT(first_name, ' ' , last_name) AS full_name FROM employees")
            // db.promise().query(`SELECT first_name FROM employees`)
            .then(([rows, fields]) => {
                for (let i=0; i < rows.length; i++){
                    employeesArray.push(rows[i].full_name);
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

        else if (answers.choice === 'Update Employee Manager') {
            let employeesArray = [];
            let managersArray =[];
            db.promise().query("SELECT CONCAT(first_name, ' ' , last_name) AS full_name FROM employees")
            // db.promise().query(`SELECT first_name FROM employees`)
            .then(([rows, fields]) => {
                for (let i=0; i < rows.length; i++){
                    employeesArray.push(rows[i].full_name);
                }
                return employeesArray;
            })
            .then(db.promise().query("SELECT CONCAT(first_name, ' ' , last_name) AS full_name FROM employees")
            .then(([rows, fields]) => {
                for (let i=0; i < rows.length; i++){
                    managersArray.push(rows[i].full_name);
                }
            }))
            .then(employeesArray => updateEmployeeManager(employeesArray,managersArray))
        }

        else if (answers.choice === 'Delete Employee') {
            let employeesArray = [];
            db.promise().query("SELECT CONCAT(first_name, ' ' , last_name) AS full_name FROM employees")
            // db.promise().query(`SELECT first_name FROM employees`)
            .then(([rows, fields]) => {
                for (let i=0; i < rows.length; i++){
                    employeesArray.push(rows[i].full_name);
                }
                return employeesArray;
            })
            .then(employeesArray => deleteEmployee(employeesArray));
        }

        else if (answers.choice === 'Delete Role') {
            let rolesArray = [];
            db.promise().query("SELECT title FROM roles")
            // db.promise().query(`SELECT first_name FROM employees`)
            .then(([rows, fields]) => {
                for (let i=0; i < rows.length; i++){
                    rolesArray.push(rows[i].title);
                }
                return rolesArray;
            })
            .then(rolesArray => deleteRole(rolesArray));
        }

        else if (answers.choice === 'Delete Department') {
            let departmentsArray = [];
            db.promise().query("SELECT name FROM departments")
            // db.promise().query(`SELECT first_name FROM employees`)
            .then(([rows, fields]) => {
                for (let i=0; i < rows.length; i++){
                    departmentsArray.push(rows[i].name);
                }
                return departmentsArray;
            })
            .then(departmentsArray => deleteDepartment(departmentsArray));
        }

        else {
            console.log("Bye!");
            process.exit();
        }
    })
}
console.log(`


<><><><><><><><><><><><><><><><><><><><><><><><><>

        EMPLOYEE DATABASE MANAGER
        
<><><><><><><><><><><><><><><><><><><><><><><><><>

`)
prompUser();