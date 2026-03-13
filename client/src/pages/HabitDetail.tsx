import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { addMonths, format, subMonths } from "date-fns";
import { getHabitById } from "@/api/habitApi";
import { useHabitLogs, useAllHabitLogs } from "@/hooks/useHabitLogs";
import { useHabits } from "@/hooks/useHabits";
import { calculateStats, calculateStreaks } from "@/lib/streaks";
import AppLayout from "@/components/AppLayout";
import MonthlyCalendar from "@/components/MonthlyCalendar";
import HabitStats from "@/components/HabitStats";
import EditHabitDialog from "@/components/EditHabitDialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dailog";

export default function HabitDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { updateHabit, deleteHabit } = useHabits();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [showEdit, setShowEdit] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const habitQuery = useQuery({
    queryKey: ["habit", id],
    queryFn: () => getHabitById(id!),
    enabled: !!id,
  });

  const { logsQuery, toggleLog } = useHabitLogs(id!, year, month);
  const { data: allLogs } = useAllHabitLogs(id!);

  const completedDates = useMemo(
    () =>
      new Set(
        (logsQuery.data ?? [])
          .filter((log) => log.completed)
          .map((log) => log.date),
      ),
    [logsQuery.data],
  );

  const monthStats = useMemo(
    () => calculateStats(logsQuery.data ?? [], year, month),
    [logsQuery.data, year, month],
  );

  const streaks = useMemo(
    () => calculateStreaks(allLogs ?? []),
    [allLogs],
  );

  const habit = habitQuery.data;

  if (habitQuery.isLoading) {
    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((item) => (
              <Skeleton key={item} className="h-24 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-[320px] rounded-xl" />
        </div>
      </AppLayout>
    );
  }

  if (!habit) {
    return (
      <AppLayout>
        <div className="text-center py-16">
          <p className="text-muted-foreground">Habit not found</p>
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mt-4"
          >
            Go back
          </Button>
        </div>
      </AppLayout>
    );
  }

  const handleDelete = () => {
    deleteHabit.mutate(habit.id, { onSuccess: () => navigate("/") });
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold font-heading">{habit.name}</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setShowEdit(true)}>
            <Pencil className="w-4 h-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete habit?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete "{habit.name}" and all its
                  tracking data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <HabitStats
          totalCompleted={monthStats.totalCompleted}
          completionPercentage={monthStats.completionPercentage}
          currentStreak={streaks.currentStreak}
          bestStreak={streaks.bestStreak}
        />

        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h2 className="font-heading font-semibold">
              {format(currentDate, "MMMM yyyy")}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <MonthlyCalendar
            year={year}
            month={month}
            completedDates={completedDates}
            onToggle={(date) => toggleLog.mutate(date)}
          />
        </div>
      </div>

      <EditHabitDialog
        open={showEdit}
        onOpenChange={setShowEdit}
        habitName={habit.name}
        onSave={(name) => updateHabit.mutate({ id: String(habit.id), name })}
        loading={updateHabit.isPending}
      />
    </AppLayout>
  );
}
