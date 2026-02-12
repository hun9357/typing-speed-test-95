"use client";

import { DailyProgress } from "@/hooks/useStreak";
import { getTodayDateString } from "@/lib/daily-passage";

interface CalendarViewProps {
  history: DailyProgress[];
}

export default function CalendarView({ history }: CalendarViewProps) {
  const today = new Date(getTodayDateString());
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Get first day of the month
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);

  // Get starting day of week (0 = Sunday)
  const startingDayOfWeek = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  // Create array of days
  const days: (number | null)[] = [];

  // Add empty cells for days before the first of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }

  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  // Check if a day is completed
  const isDayCompleted = (day: number): boolean => {
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return history.some((p) => p.date === dateString && p.completed);
  };

  // Check if a day is today
  const isToday = (day: number): boolean => {
    return day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
  };

  // Check if a day is in the future
  const isFuture = (day: number): boolean => {
    const date = new Date(currentYear, currentMonth, day);
    return date > today;
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
        {monthNames[currentMonth]} {currentYear}
      </h3>

      <div className="grid grid-cols-7 gap-2">
        {/* Day headers */}
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}

        {/* Days */}
        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const completed = isDayCompleted(day);
          const today = isToday(day);
          const future = isFuture(day);

          let bgColor = "bg-gray-50";
          let textColor = "text-gray-400";
          let border = "border border-gray-200";
          let emoji = "";

          if (future) {
            bgColor = "bg-gray-50";
            textColor = "text-gray-300";
          } else if (completed) {
            bgColor = "bg-green-100";
            textColor = "text-green-700";
            border = "border-2 border-green-500";
            emoji = "🟢";
          } else if (today) {
            bgColor = "bg-blue-100";
            textColor = "text-blue-700";
            border = "border-2 border-blue-500";
            emoji = "⭕";
          }

          return (
            <div
              key={`day-${day}`}
              className={`aspect-square flex flex-col items-center justify-center rounded-lg ${bgColor} ${border} ${textColor} font-semibold text-sm transition-transform hover:scale-105 cursor-default`}
            >
              <div className="text-xs mb-0.5">{emoji}</div>
              <div>{day}</div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-600 justify-center">
        <div className="flex items-center gap-2">
          <span className="text-lg">🟢</span>
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg">⭕</span>
          <span>Today</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
          <span>Not completed</span>
        </div>
      </div>
    </div>
  );
}
