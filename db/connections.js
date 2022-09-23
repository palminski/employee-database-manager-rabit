// const password = require('../passwords/password');
const mysql = require('mysql2');
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'company'
    },
    console.log('connected to database')
);
module.exports = db;
