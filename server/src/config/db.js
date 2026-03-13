const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "habit_tracker",
  password: process.env.DB_PASSWORD || "naramala",
  port: Number(process.env.DB_PORT || 5000),
});

module.exports = pool;
