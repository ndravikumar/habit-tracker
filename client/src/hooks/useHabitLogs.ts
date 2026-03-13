import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getHabitStats, upsertHabitLog } from "@/api/habitApi";
import { toast } from "sonner";

export function useHabitLogs(habitId: string, year: number, month: number) {
  const queryClient = useQueryClient();

  const logsQuery = useQuery({
    queryKey: ["habit-logs", habitId, year, month],
    queryFn: async () => {
      const data = await getHabitStats(habitId, year, month);

      if ("items" in data) {
        throw new Error("Unexpected stats response");
      }

      return data.monthLogs;
    },
    enabled: !!habitId,
  });

  const toggleLog = useMutation({
    mutationFn: async (date: string) => {
      const existing = logsQuery.data?.find((log) => log.date === date);
      return upsertHabitLog(Number(habitId), date, !existing?.completed);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habit-logs", habitId] });
      queryClient.invalidateQueries({ queryKey: ["habit-logs-all", habitId] });
      queryClient.invalidateQueries({ queryKey: ["habit-stats"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { logsQuery, toggleLog };
}

export function useAllHabitLogs(habitId: string) {
  return useQuery({
    queryKey: ["habit-logs-all", habitId],
    queryFn: async () => {
      const data = await getHabitStats(habitId);

      if ("items" in data) {
        throw new Error("Unexpected stats response");
      }

      return data.allLogs;
    },
    enabled: !!habitId,
  });
}
