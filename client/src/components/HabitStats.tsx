import { Flame, Target, TrendingUp, Award } from "lucide-react";

interface Props {
  totalCompleted: number;
  completionPercentage: number;
  currentStreak: number;
  bestStreak: number;
}

export default function HabitStats({ totalCompleted, completionPercentage, currentStreak, bestStreak }: Props) {
  const stats = [
    { label: "Completed", value: totalCompleted, suffix: "days", icon: Target, color: "text-primary" },
    { label: "Completion", value: completionPercentage, suffix: "%", icon: TrendingUp, color: "text-success" },
    { label: "Current Streak", value: currentStreak, suffix: "🔥", icon: Flame, color: "text-accent" },
    { label: "Best Streak", value: bestStreak, suffix: "⭐", icon: Award, color: "text-accent" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((s) => (
        <div key={s.label} className="glass-card rounded-xl p-4 text-center">
          <s.icon className={`w-5 h-5 mx-auto mb-2 ${s.color}`} />
          <div className="text-2xl font-bold font-heading">
            {s.value}
            {s.suffix === "%" && <span className="text-sm text-muted-foreground">%</span>}
          </div>
          <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
