import { useState } from "react";
import { useHabits } from "@/hooks/useHabits";
import { useProfile } from "@/hooks/useProfile";
import AppLayout from "@/components/AppLayout";
import HabitCard from "@/components/HabitCard";
import AddHabitDialog from "@/components/AddHabitDialog";
import UpgradeModal from "@/components/UpgradeModal";
import { Skeleton } from "@/components/ui/skeleton";
import { Flame } from "lucide-react";

const FREE_HABIT_LIMIT = 25;

export default function Dashboard() {
  const { habitsQuery, createHabit } = useHabits();
  const { data: profile } = useProfile();
  const [showUpgrade, setShowUpgrade] = useState(false);

  const habits = habitsQuery.data ?? [];
  const isPro = profile?.is_pro ?? false;

  const handleAddHabit = (name: string) => {
    if (!isPro && habits.length >= FREE_HABIT_LIMIT) {
      setShowUpgrade(true);
      return;
    }
    createHabit.mutate(name);
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold font-heading">My Habits</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {habits.length} habit{habits.length !== 1 && "s"}
              {!isPro && ` · ${FREE_HABIT_LIMIT - habits.length} remaining`}
            </p>
          </div>
          <AddHabitDialog onAdd={handleAddHabit} loading={createHabit.isPending} />
        </div>

        {/* Habits List */}
        {habitsQuery.isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[72px] rounded-xl" />
            ))}
          </div>
        ) : habits.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-secondary mx-auto flex items-center justify-center mb-4">
              <Flame className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-heading font-semibold mb-1">No habits yet</h2>
            <p className="text-sm text-muted-foreground">Create your first habit to start tracking!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {habits.map((habit) => (
              <HabitCard key={habit.id} habit={habit} />
            ))}
          </div>
        )}
      </div>

      <UpgradeModal open={showUpgrade} onOpenChange={setShowUpgrade} />
    </AppLayout>
  );
}
