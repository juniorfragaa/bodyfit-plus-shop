//Load the variables from the .env file (database host, user, password and name)

require("dotenv").config();

// Load the mysql2 package to connect Node.js to MySQL
const mysql = require("mysql2");

//Create the connection using the details from the .env file
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

//Export the connection so serve.js can use it
module.exports = connection;