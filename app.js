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
