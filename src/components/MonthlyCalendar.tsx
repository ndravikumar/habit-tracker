import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isToday, isFuture } from "date-fns";
import { cn } from "@/lib/utils";

interface Props {
  year: number;
  month: number;
  completedDates: Set<string>;
  onToggle: (date: string) => void;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function MonthlyCalendar({ year, month, completedDates, onToggle }: Props) {
  const monthStart = startOfMonth(new Date(year, month));
  const monthEnd = endOfMonth(monthStart);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days: Date[] = [];
  let day = calStart;
  while (day <= calEnd) {
    days.push(day);
    day = addDays(day, 1);
  }

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((d) => {
          const dateStr = format(d, "yyyy-MM-dd");
          const inMonth = isSameMonth(d, monthStart);
          const completed = completedDates.has(dateStr);
          const future = isFuture(d);
          const today = isToday(d);

          return (
            <button
              key={dateStr}
              onClick={() => !future && inMonth && onToggle(dateStr)}
              disabled={future || !inMonth}
              className={cn(
                "aspect-square rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center relative",
                !inMonth && "opacity-20 cursor-default",
                inMonth && !completed && !future && "hover:bg-secondary cursor-pointer",
                completed && "habit-completed animate-check-bounce shadow-sm",
                future && inMonth && "opacity-40 cursor-default",
                today && !completed && "ring-2 ring-primary/30",
                today && completed && "ring-2 ring-success/50"
              )}
            >
              {format(d, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );
}
