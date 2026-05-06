import React, { useState, useMemo } from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { AppCard } from "../ui/AppCard";
import { CalendarAppointmentDate } from "../../../core/types";
import { useTheme } from "../../../core/theme";

interface AppointmentsCalendarProps {
  appointmentDates: CalendarAppointmentDate[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

const WEEKDAYS = ["D", "S", "T", "Q", "Q", "S", "S"];
const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function toYMD(date: Date) {
  return date.toISOString().split("T")[0];
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function firstWeekdayOf(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export function AppointmentsCalendar({
  appointmentDates,
  selectedDate,
  onSelectDate,
}: AppointmentsCalendarProps) {
  const { colors } = useTheme();
  const today = toYMD(new Date());

  const initialDate = new Date();
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());

  const apptDateSet = useMemo(
    () => new Set(appointmentDates.map((d) => d.date)),
    [appointmentDates]
  );

  const totalDays = daysInMonth(viewYear, viewMonth);
  const startOffset = firstWeekdayOf(viewYear, viewMonth);

  // Build grid cells: null = empty slot, number = day
  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];
  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  const makeDate = (day: number) => {
    const mm = String(viewMonth + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return `${viewYear}-${mm}-${dd}`;
  };

  return (
    <AppCard className="mx-5 p-4">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <AppText variant="heading3" className="font-bold">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </AppText>
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={prevMonth}
            activeOpacity={0.7}
            className="w-8 h-8 rounded-full bg-muted dark:bg-muted-dark items-center justify-center"
          >
            <Ionicons name="chevron-back" size={16} color={colors.subtle} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={nextMonth}
            activeOpacity={0.7}
            className="w-8 h-8 rounded-full bg-muted dark:bg-muted-dark items-center justify-center"
          >
            <Ionicons name="chevron-forward" size={16} color={colors.subtle} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Weekday headers */}
      <View className="flex-row mb-1">
        {WEEKDAYS.map((wd, i) => (
          <View key={i} className="flex-1 items-center py-1">
            <AppText variant="caption" color="muted" className="font-semibold">
              {wd}
            </AppText>
          </View>
        ))}
      </View>

      {/* Grid rows */}
      {Array.from({ length: cells.length / 7 }, (_, row) => (
        <View key={row} className="flex-row">
          {cells.slice(row * 7, row * 7 + 7).map((day, col) => {
            if (day === null) {
              return <View key={col} className="flex-1 items-center py-1" />;
            }
            const dateStr = makeDate(day);
            const isSelected = dateStr === selectedDate;
            const isToday = dateStr === today;
            const hasAppt = apptDateSet.has(dateStr);
            const isPast = dateStr < today;

            return (
              <TouchableOpacity
                key={col}
                onPress={() => onSelectDate(dateStr)}
                activeOpacity={0.7}
                className="flex-1 items-center py-1"
              >
                <View
                  className="w-9 h-9 rounded-full items-center justify-center"
                  style={
                    isSelected
                      ? { backgroundColor: colors.secondary }
                      : isToday
                      ? { backgroundColor: colors.secondary + "22" }
                      : undefined
                  }
                >
                  <AppText
                    variant="small"
                    className={`font-medium ${isPast && !isSelected ? "opacity-40" : ""}`}
                    style={isSelected ? { color: "#fff" } : isToday ? { color: colors.secondary } : undefined}
                  >
                    {String(day)}
                  </AppText>
                </View>
                {/* Appointment dot */}
                {hasAppt && (
                  <View
                    className="w-1.5 h-1.5 rounded-full mt-0.5"
                    style={{
                      backgroundColor: isSelected ? "#fff" : colors.secondary,
                      opacity: isPast ? 0.4 : 1,
                    }}
                  />
                )}
                {!hasAppt && <View className="w-1.5 h-1.5 mt-0.5" />}
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </AppCard>
  );
}
