const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

// const pool = require("./config/db");

// pool.query("SELECT NOW()", (err, res) => {
//   if (err) {
//     console.error("DB connection error:", err);
//   } else {
//     console.log("Database connected:", res.rows);
//   }
// });

// pool.query("SELECT current_database()", (err, res) => {
//   console.log(res.rows);
// });

// pool.query("SELECT * FROM users", (err, res) => {
//   if (err) console.error(err);
//   else console.log("Users table works:", res.rows);
// });


app.get("/", (req, res) => {
  res.send("API working 🚀");
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
