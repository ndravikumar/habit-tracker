import { format, subDays, parseISO, differenceInDays } from "date-fns";

export interface HabitStats {
  totalCompleted: number;
  completionPercentage: number;
  currentStreak: number;
  bestStreak: number;
}

export function calculateStats(
  logs: { date: string; completed: boolean }[],
  year: number,
  month: number,
): HabitStats {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() === month;
  const relevantDays = isCurrentMonth ? today.getDate() : daysInMonth;

  const completedDates = new Set(
    logs.filter((l) => l.completed).map((l) => l.date),
  );

  const totalCompleted = completedDates.size;
  const completionPercentage =
    relevantDays > 0 ? Math.round((totalCompleted / relevantDays) * 100) : 0;

  return {
    totalCompleted,
    completionPercentage,
    currentStreak: 0,
    bestStreak: 0,
  };
}

export function calculateStreaks(
  allLogs: { date: string; completed: boolean }[],
): { currentStreak: number; bestStreak: number } {
  if (allLogs.length === 0) return { currentStreak: 0, bestStreak: 0 };

  const completedDates = allLogs
    .filter((l) => l.completed)
    .map((l) => l.date)
    .sort();

  if (completedDates.length === 0) return { currentStreak: 0, bestStreak: 0 };

  // Current streak: count back from today
  let currentStreak = 0;
  let checkDate = format(new Date(), "yyyy-MM-dd");
  const dateSet = new Set(completedDates);

  // If today isn't completed, check yesterday
  if (!dateSet.has(checkDate)) {
    checkDate = format(subDays(new Date(), 1), "yyyy-MM-dd");
  }

  while (dateSet.has(checkDate)) {
    currentStreak++;
    checkDate = format(subDays(parseISO(checkDate), 1), "yyyy-MM-dd");
  }

  // Best streak
  let bestStreak = 1;
  let streak = 1;
  for (let i = 1; i < completedDates.length; i++) {
    const diff = differenceInDays(
      parseISO(completedDates[i]),
      parseISO(completedDates[i - 1]),
    );
    if (diff === 1) {
      streak++;
      bestStreak = Math.max(bestStreak, streak);
    } else {
      streak = 1;
    }
  }
  bestStreak = Math.max(bestStreak, currentStreak);

  return { currentStreak, bestStreak };
}
