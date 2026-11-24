// This is the backend for my BodyFit Plus online shop.
// I built it following the User Registration & Login handbook and Lecture 10.

// I use Express to run the web server and path to build the folder paths.
const express = require("express");
const path = require("path");

// I import the database connection I created in database.js
const connection = require("./database");

const app = express();

// I added this so the server can read the JSON the browser sends with fetch
app.use(express.json());

// I use express.static to send the files in my public folder (HTML, CSS, JS, images)
app.use(express.static(path.join(__dirname, "public")));

// I used get for the home page, so index.html opens at http://localhost:3000
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// I used get to take all products from the database and send them as JSON
app.get("/products", function (req, res) {
    let sql = "SELECT * FROM products";

    connection.query(sql, function (error, results) {
        // If the database fails, I send status 500 (server error)
        if (error) {
            return res.status(500).json({ message: "Could not load products" });
        }
        res.json(results);
    });
});

// I connect to MySQL first, so the server only starts if the database is working
connection.connect(function (error) {
    if (error) {
        console.log("Database connection failed:", error.message);
        return;
    }
    console.log("MySQL connected successfully");

    app.listen(3000, function () {
        console.log("Server running at http://localhost:3000");
    });
});

