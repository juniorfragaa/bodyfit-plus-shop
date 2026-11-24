// This is the backend for my BodyFit Plus online shop.
// I built it following the User Registration & Login handbook and Lecture 10.

// I use Express to run the web server and path to build the folder paths.
const express = require("express");
const path = require("path");

// I use crypto (built into Node.js) to hash the passwords
const crypto = require("crypto");

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

// I hash a password with a salt using scrypt (from the Login handbook)
function hashPassword(password, salt) {
    return crypto.scryptSync(password, salt, 64).toString("hex");
}

// REGISTER: I check the data, hash the password and save the new user
app.post("/register", function (req, res) {
    let { name, email, password } = req.body || {};

    // If a field is missing or the password is too short, I send 400 (invalid data)
    if (typeof name !== "string" ||
        typeof email !== "string" ||
        typeof password !== "string" ||
        name.trim() === "" ||
        email.trim() === "" ||
        password.length < 8) {
        return res.status(400).json({
            message: "Enter valid details and a password of at least 8 characters"
        });
    }

    // I save emails in lower case so "Ana@Mail.com" and "ana@mail.com" count as the same
    email = email.trim().toLowerCase();

    // I create a random salt and save it together with the hash as "salt:hash"
    let salt = crypto.randomBytes(16).toString("hex");
    let hashedPassword = salt + ":" + hashPassword(password, salt);

    // I use ? placeholders so the user's input never becomes part of the SQL (protects against SQL injection)
    let sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

    connection.query(sql, [name.trim(), email, hashedPassword], function (error, result) {
        if (error) {
            // The email column is UNIQUE, so MySQL refuses a repeated email. I send 409
            if (error.code === "ER_DUP_ENTRY") {
                return res.status(409).json({ message: "Email already registered" });
            }
            return res.status(500).json({ message: "Registration failed" });
        }
        res.json({ message: "Registration successful! Please login." });
    });
});

// LOGIN: I find the user by email and compare the password hashes
app.post("/login", function (req, res) {
    let { email, password } = req.body || {};

    if (typeof email !== "string" ||
        typeof password !== "string" ||
        email.trim() === "" || password === "") {
        return res.status(400).json({ message: "Please enter email and password" });
    }

    email = email.trim().toLowerCase();
    let sql = "SELECT * FROM users WHERE email = ?";

    connection.query(sql, [email], function (error, results) {
        if (error) {
            return res.status(500).json({ message: "Login failed" });
        }
        // No user with this email: I send 401 (wrong login details)
        if (results.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // I split the saved password into the salt and the hash
        let user = results[0];
        let parts = user.password.split(":");
        if (parts.length !== 2) {
            return res.status(500).json({ message: "Login failed" });
        }

        let salt = parts[0];
        let storedHash = parts[1];

        // I hash the password the user typed with the same salt and compare both hashes
        let enteredHash = hashPassword(password, salt);
        let storedBuffer = Buffer.from(storedHash, "hex");
        let enteredBuffer = Buffer.from(enteredHash, "hex");
        let passwordMatches =
            storedBuffer.length === enteredBuffer.length &&
            crypto.timingSafeEqual(storedBuffer, enteredBuffer);

        if (!passwordMatches) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // I also send back the name and email, so the shop can show who is logged in
        res.json({
            message: "Login successful! Welcome " + user.name,
            name: user.name,
            email: user.email
        });
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

