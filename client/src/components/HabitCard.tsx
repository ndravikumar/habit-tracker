import { Link } from "react-router-dom";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { getHabitStats } from "@/api/habitApi";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  habit: { id: string | number; name: string; created_at: string };
}

export default function HabitCard({ habit }: Props) {
  const { data } = useQuery({
    queryKey: ["habit-stats", "dashboard"],
    queryFn: async () => {
      const response = await getHabitStats();

      if (!("items" in response)) {
        throw new Error("Unexpected stats response");
      }

      return response.items;
    },
    staleTime: 30000,
  });

  const habitStats = data?.find((item) => item.habitId === Number(habit.id));
  const isCompleted = habitStats?.completedToday ?? false;

  return (
    <Link
      to={`/habit/${habit.id}`}
      className="glass-card rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition-all duration-200 group"
    >
      <div
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0",
          isCompleted ? "habit-completed shadow-sm" : "bg-secondary",
        )}
      >
        {isCompleted && <Check className="w-5 h-5" />}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-medium truncate">{habit.name}</h3>
        <p className="text-xs text-muted-foreground">
          Since {format(new Date(habit.created_at), "MMM d, yyyy")}
        </p>
      </div>

      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
    </Link>
  );
}
