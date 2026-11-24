// I load the variables from my .env file (database host, user, password and name)
require("dotenv").config();

// I use the mysql2 package to connect Node.js to MySQL
const mysql = require("mysql2");

// I create the connection using the details from the .env file, so the password is not written in the code
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// I export the connection so server.js can use it
module.exports = connection;
