const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const habitRoutes = require("./routes/habitRoutes");
const initDb = require("./config/initDb");

const app = express();

app.use(cors({ origin: "http://localhost:8080", credentials: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", habitRoutes);

app.get("/", (req, res) => {
  res.send("API working");
});

const PORT = process.env.PORT || 8000;

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database initialization failed:", error);
    process.exit(1);
  });
