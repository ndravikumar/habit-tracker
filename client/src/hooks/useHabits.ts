import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createHabit as createHabitRequest,
  deleteHabit as deleteHabitRequest,
  getHabits,
  updateHabit as updateHabitRequest,
} from "@/api/habitApi";
import { toast } from "sonner";

export function useHabits() {
  const queryClient = useQueryClient();

  const habitsQuery = useQuery({
    queryKey: ["habits"],
    queryFn: getHabits,
  });

  const createHabit = useMutation({
    mutationFn: createHabitRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      queryClient.invalidateQueries({ queryKey: ["habit-stats"] });
      toast.success("Habit created!");
    },
    onError: (error) => toast.error(error.message),
  });

  const updateHabit = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) =>
      updateHabitRequest(Number(id), name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      queryClient.invalidateQueries({ queryKey: ["habit"] });
      toast.success("Habit updated!");
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteHabit = useMutation({
    mutationFn: async (id: string | number) => deleteHabitRequest(Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      queryClient.invalidateQueries({ queryKey: ["habit-stats"] });
      toast.success("Habit deleted!");
    },
    onError: (error) => toast.error(error.message),
  });

  return { habitsQuery, createHabit, updateHabit, deleteHabit };
}
