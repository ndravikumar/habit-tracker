const db = require("../config/db");

async function createHabit(userId, name) {
  const result = await db.query(
    `INSERT INTO habits (user_id, name)
     VALUES ($1, $2)
     RETURNING id, user_id, name, created_at`,
    [userId, name],
  );

  return result.rows[0];
}

async function getHabitsByUserId(userId) {
  const result = await db.query(
    `SELECT id, user_id, name, created_at
     FROM habits
     WHERE user_id = $1
     ORDER BY created_at ASC`,
    [userId],
  );

  return result.rows;
}

async function getHabitById(id, userId) {
  const result = await db.query(
    `SELECT id, user_id, name, created_at
     FROM habits
     WHERE id = $1 AND user_id = $2`,
    [id, userId],
  );

  return result.rows[0];
}

async function updateHabit(id, userId, name) {
  const result = await db.query(
    `UPDATE habits
     SET name = $3
     WHERE id = $1 AND user_id = $2
     RETURNING id, user_id, name, created_at`,
    [id, userId, name],
  );

  return result.rows[0];
}

async function deleteHabit(id, userId) {
  const result = await db.query(
    "DELETE FROM habits WHERE id = $1 AND user_id = $2 RETURNING id",
    [id, userId],
  );

  return result.rows[0];
}

async function upsertHabitLog(habitId, userId, date, completed) {
  const habit = await getHabitById(habitId, userId);

  if (!habit) {
    return null;
  }

  if (!completed) {
    await db.query(
      "DELETE FROM habit_logs WHERE habit_id = $1 AND date = $2",
      [habitId, date],
    );

    return { id: null, habit_id: Number(habitId), date, completed: false };
  }

  const result = await db.query(
    `INSERT INTO habit_logs (habit_id, date, completed)
     VALUES ($1, $2, true)
     ON CONFLICT (habit_id, date)
     DO UPDATE SET completed = EXCLUDED.completed
     RETURNING id, habit_id, date, completed`,
    [habitId, date],
  );

  return result.rows[0];
}

async function getHabitLogsForMonth(habitId, userId, startDate, endDate) {
  const result = await db.query(
    `SELECT hl.id, hl.habit_id, hl.date, hl.completed
     FROM habit_logs hl
     INNER JOIN habits h ON h.id = hl.habit_id
     WHERE hl.habit_id = $1
       AND h.user_id = $2
       AND hl.date BETWEEN $3 AND $4
     ORDER BY hl.date ASC`,
    [habitId, userId, startDate, endDate],
  );

  return result.rows;
}

async function getAllHabitLogs(habitId, userId) {
  const result = await db.query(
    `SELECT hl.id, hl.habit_id, hl.date, hl.completed
     FROM habit_logs hl
     INNER JOIN habits h ON h.id = hl.habit_id
     WHERE hl.habit_id = $1
       AND h.user_id = $2
       AND hl.completed = true
     ORDER BY hl.date ASC`,
    [habitId, userId],
  );

  return result.rows;
}

async function getDashboardStats(userId, today) {
  const result = await db.query(
    `SELECT
       h.id AS "habitId",
       COALESCE(MAX(CASE WHEN hl.date = $2 AND hl.completed THEN 1 ELSE 0 END), 0) = 1 AS "completedToday",
       COUNT(CASE WHEN hl.completed THEN 1 END)::int AS "totalCompleted"
     FROM habits h
     LEFT JOIN habit_logs hl ON hl.habit_id = h.id
     WHERE h.user_id = $1
     GROUP BY h.id
     ORDER BY h.created_at ASC`,
    [userId, today],
  );

  return result.rows;
}

module.exports = {
  createHabit,
  deleteHabit,
  getAllHabitLogs,
  getDashboardStats,
  getHabitById,
  getHabitLogsForMonth,
  getHabitsByUserId,
  updateHabit,
  upsertHabitLog,
};
