//dependancies
const mysql = require('mysql2');
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

const displayEmployees = function() {
    const sql = `SELECT employees.*, 
                roles.title AS title,
                departments.name AS department
                FROM employees
                LEFT JOIN roles
                ON employees.role_id = roles.id
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

const displayRoles = function() {
    const sql = `SELECT * FROM roles`;
    db.query(sql, (err, rows) => {
        if (err) {
            console.log('An Error has Occured');
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

displayEmployees();
displayRoles();
displayDepartments();
