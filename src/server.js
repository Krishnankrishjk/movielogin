require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); // Allows JSON data in requests

// MySQL Database Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",      // Your MySQL username
  password: "M`x;>.2WXeSN",      // Your MySQL password
  database: "info" // Your database name
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL Database");
  }
});

// User SignUp API (Prevent duplicate emails)
app.post("/signup", (req, res) => {
  const { name, email, password } = req.body;

  // Check if email already exists
  const checkEmailQuery = "SELECT * FROM users WHERE email = ?";
  db.query(checkEmailQuery, [email], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (results.length > 0) {
      return res.status(400).json({ error: "Email already exists!" });
    }

    // If email doesn't exist, insert new user
    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    db.query(sql, [name, email, password], (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.status(201).json({ message: "User registered successfully!" });
    });
  });
});

// User Login API
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(sql, [email, password], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length > 0) {
      res.json({ message: "Login successful!" });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });
});

// Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
