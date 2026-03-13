import { AxiosError } from "axios";
import { http } from "@/api/http";

export interface Habit {
  id: number;
  user_id: number;
  name: string;
  created_at: string;
}

export interface HabitLog {
  id: number;
  habit_id: number;
  date: string;
  completed: boolean;
}

export interface HabitStatsSummary {
  habitId: number;
  completedToday: boolean;
  currentStreak: number;
  bestStreak: number;
  totalCompleted: number;
}

export interface HabitDetailStats {
  monthLogs: HabitLog[];
  allLogs: HabitLog[];
  summary: {
    totalCompleted: number;
    completionPercentage: number;
    currentStreak: number;
    bestStreak: number;
  };
}

function toError(error: unknown) {
  if (error instanceof AxiosError) {
    return new Error(error.response?.data?.message ?? "Request failed");
  }

  return error instanceof Error ? error : new Error("Request failed");
}

export async function getHabits() {
  try {
    const { data } = await http.get<Habit[]>("/habits");
    return data;
  } catch (error) {
    throw toError(error);
  }
}

export async function getHabitById(id: string) {
  try {
    const { data } = await http.get<Habit>(`/habits/${id}`);
    return data;
  } catch (error) {
    throw toError(error);
  }
}

export async function createHabit(name: string) {
  try {
    const { data } = await http.post<Habit>("/habits", { name });
    return data;
  } catch (error) {
    throw toError(error);
  }
}

export async function updateHabit(id: number, name: string) {
  try {
    const { data } = await http.put<Habit>(`/habits/${id}`, { name });
    return data;
  } catch (error) {
    throw toError(error);
  }
}

export async function deleteHabit(id: number) {
  try {
    await http.delete(`/habits/${id}`);
  } catch (error) {
    throw toError(error);
  }
}

export async function upsertHabitLog(
  habitId: number,
  date: string,
  completed: boolean,
) {
  try {
    const { data } = await http.post<HabitLog>("/habit-log", {
      habitId,
      date,
      completed,
    });
    return data;
  } catch (error) {
    throw toError(error);
  }
}

export async function getHabitStats(
  habitId?: string,
  year?: number,
  month?: number,
) {
  try {
    const { data } = await http.get<HabitDetailStats | { items: HabitStatsSummary[] }>(
      "/habits/stats",
      {
        params: { habitId, year, month },
      },
    );
    return data;
  } catch (error) {
    throw toError(error);
  }
}
