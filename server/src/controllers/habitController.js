const {
  createHabit,
  deleteHabit,
  getAllHabitLogs,
  getDashboardStats,
  getHabitById,
  getHabitLogsForMonth,
  getHabitsByUserId,
  updateHabit,
  upsertHabitLog,
} = require("../models/habitModel");

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function startOfMonthUtc(year, month) {
  return new Date(Date.UTC(year, month, 1));
}

function endOfMonthUtc(year, month) {
  return new Date(Date.UTC(year, month + 1, 0));
}

function subtractDays(dateString, days) {
  const date = new Date(`${dateString}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() - days);
  return formatDate(date);
}

function differenceInDays(currentDate, previousDate) {
  const current = new Date(`${currentDate}T00:00:00Z`);
  const previous = new Date(`${previousDate}T00:00:00Z`);
  return Math.round((current - previous) / (1000 * 60 * 60 * 24));
}

function calculateStreaks(logs) {
  if (!logs.length) {
    return { currentStreak: 0, bestStreak: 0 };
  }

  const dates = logs.map((log) => log.date).sort();
  const dateSet = new Set(dates);

  let currentStreak = 0;
  let cursor = formatDate(new Date());

  if (!dateSet.has(cursor)) {
    cursor = subtractDays(cursor, 1);
  }

  while (dateSet.has(cursor)) {
    currentStreak += 1;
    cursor = subtractDays(cursor, 1);
  }

  let bestStreak = 1;
  let streak = 1;

  for (let index = 1; index < dates.length; index += 1) {
    if (differenceInDays(dates[index], dates[index - 1]) === 1) {
      streak += 1;
      bestStreak = Math.max(bestStreak, streak);
    } else {
      streak = 1;
    }
  }

  return { currentStreak, bestStreak: Math.max(bestStreak, currentStreak) };
}

function calculateMonthSummary(logs, year, month) {
  const daysInMonth = endOfMonthUtc(year, month).getUTCDate();
  const today = new Date();
  const isCurrentMonth =
    today.getUTCFullYear() === year && today.getUTCMonth() === month;
  const relevantDays = isCurrentMonth ? today.getUTCDate() : daysInMonth;
  const totalCompleted = logs.filter((log) => log.completed).length;

  return {
    totalCompleted,
    completionPercentage:
      relevantDays > 0 ? Math.round((totalCompleted / relevantDays) * 100) : 0,
  };
}

async function createHabitHandler(req, res) {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Habit name is required" });
    }

    const habit = await createHabit(req.user.id, name.trim());
    return res.status(201).json(habit);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getHabitsHandler(req, res) {
  try {
    const habits = await getHabitsByUserId(req.user.id);
    return res.json(habits);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getHabitHandler(req, res) {
  try {
    const habit = await getHabitById(req.params.id, req.user.id);

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    return res.json(habit);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function updateHabitHandler(req, res) {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Habit name is required" });
    }

    const habit = await updateHabit(req.params.id, req.user.id, name.trim());

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    return res.json(habit);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function deleteHabitHandler(req, res) {
  try {
    const deleted = await deleteHabit(req.params.id, req.user.id);

    if (!deleted) {
      return res.status(404).json({ message: "Habit not found" });
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function upsertHabitLogHandler(req, res) {
  try {
    const { habitId, date, completed } = req.body;

    if (!habitId || !date || typeof completed !== "boolean") {
      return res
        .status(400)
        .json({ message: "habitId, date and completed are required" });
    }

    const log = await upsertHabitLog(habitId, req.user.id, date, completed);

    if (!log) {
      return res.status(404).json({ message: "Habit not found" });
    }

    return res.json(log);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getHabitStatsHandler(req, res) {
  try {
    const { habitId } = req.query;

    if (!habitId) {
      const today = formatDate(new Date());
      const stats = await getDashboardStats(req.user.id, today);
      const items = await Promise.all(
        stats.map(async (item) => {
          const allLogs = await getAllHabitLogs(item.habitId, req.user.id);
          const streaks = calculateStreaks(allLogs);

          return {
            ...item,
            currentStreak: streaks.currentStreak,
            bestStreak: streaks.bestStreak,
          };
        }),
      );

      return res.json({ items });
    }

    const year = Number(req.query.year ?? new Date().getUTCFullYear());
    const month = Number(req.query.month ?? new Date().getUTCMonth());
    const startDate = formatDate(startOfMonthUtc(year, month));
    const endDate = formatDate(endOfMonthUtc(year, month));

    const habit = await getHabitById(habitId, req.user.id);

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    const monthLogs = await getHabitLogsForMonth(
      habitId,
      req.user.id,
      startDate,
      endDate,
    );
    const allLogs = await getAllHabitLogs(habitId, req.user.id);
    const streaks = calculateStreaks(allLogs);
    const summary = calculateMonthSummary(monthLogs, year, month);

    return res.json({
      monthLogs,
      allLogs,
      summary: {
        ...summary,
        currentStreak: streaks.currentStreak,
        bestStreak: streaks.bestStreak,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createHabitHandler,
  deleteHabitHandler,
  getHabitHandler,
  getHabitsHandler,
  getHabitStatsHandler,
  updateHabitHandler,
  upsertHabitLogHandler,
};
