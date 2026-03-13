const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  createHabitHandler,
  deleteHabitHandler,
  getHabitHandler,
  getHabitsHandler,
  getHabitStatsHandler,
  updateHabitHandler,
  upsertHabitLogHandler,
} = require("../controllers/habitController");

const router = express.Router();

router.use(authMiddleware);
router.get("/habits/stats", getHabitStatsHandler);
router.get("/habits/:id", getHabitHandler);
router.get("/habits", getHabitsHandler);
router.post("/habits", createHabitHandler);
router.put("/habits/:id", updateHabitHandler);
router.delete("/habits/:id", deleteHabitHandler);
router.post("/habit-log", upsertHabitLogHandler);

module.exports = router;
