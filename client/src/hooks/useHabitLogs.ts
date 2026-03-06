import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export function useHabitLogs(habitId: string, year: number, month: number) {
  const queryClient = useQueryClient();

  const startDate = format(new Date(year, month, 1), "yyyy-MM-dd");
  const endDate = format(new Date(year, month + 1, 0), "yyyy-MM-dd");

  const logsQuery = useQuery({
    queryKey: ["habit-logs", habitId, year, month],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("habit_logs")
        .select("*")
        .eq("habit_id", habitId)
        .gte("date", startDate)
        .lte("date", endDate);
      if (error) throw error;
      return data;
    },
    enabled: !!habitId,
  });

  const toggleLog = useMutation({
    mutationFn: async (date: string) => {
      const existing = logsQuery.data?.find((l) => l.date === date);
      if (existing) {
        if (existing.completed) {
          const { error } = await supabase.from("habit_logs").delete().eq("id", existing.id);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from("habit_logs")
            .update({ completed: true })
            .eq("id", existing.id);
          if (error) throw error;
        }
      } else {
        const { error } = await supabase
          .from("habit_logs")
          .insert({ habit_id: habitId, date, completed: true });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habit-logs", habitId] });
    },
  });

  return { logsQuery, toggleLog };
}

// Fetch all logs for a habit (for streak calculation)
export function useAllHabitLogs(habitId: string) {
  return useQuery({
    queryKey: ["habit-logs-all", habitId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("habit_logs")
        .select("*")
        .eq("habit_id", habitId)
        .eq("completed", true)
        .order("date", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!habitId,
  });
}
