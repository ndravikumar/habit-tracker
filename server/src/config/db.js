const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "habit_tracker",
  password: "naramala",
  port: 5000,
});

module.exports = pool;
