const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2/promise");
require("dotenv").config();

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(cors());

// MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Connect to MySQL database
(async () => {
  try {
    await pool.getConnection();
    console.log("Connected to MySQL database");
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
})();

app.post("/api/create", async (req, res) => {
  const { email, password, name, company } = req.body;
  if (!email || !password || !name || !company) {
    return res.status(400).send("All fields are required");
  }

  const query =
    "INSERT INTO users (email, password, name, company) VALUES (?, ?, ?, ?)";

  try {
    const [result] = await pool.query(query, [email, password, name, company]);
    console.log("User created successfully:", result);
    res.status(200).send("User created successfully");
  } catch (err) {
    console.error("Failed to insert data:", err);
    res.status(500).send("Failed to create user");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
