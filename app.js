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
    const sql = `SELECT * FROM employees`;
    db.query(sql, (err, rows) => {
        if (err) {
            console.log('An Error has Occured');
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
