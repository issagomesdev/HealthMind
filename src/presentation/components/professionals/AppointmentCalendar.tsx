import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { AppCard } from "../ui/AppCard";
import { useTheme } from "../../../core/theme";

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro",
];

function toYMD(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

interface AppointmentCalendarProps {
  availableDates: string[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}

export function AppointmentCalendar({
  availableDates,
  selectedDate,
  onSelectDate,
}: AppointmentCalendarProps) {
  const { colors } = useTheme();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  const canGoPrev = viewYear > today.getFullYear() || viewMonth > today.getMonth();

  // Build grid
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Pad to full rows
  while (cells.length % 7 !== 0) cells.push(null);

  const availableSet = new Set(availableDates);

  return (
    <AppCard className="gap-4">
      {/* Month nav */}
      <View className="flex-row items-center justify-between">
        <TouchableOpacity
          onPress={prevMonth}
          disabled={!canGoPrev}
          activeOpacity={0.7}
          className="w-8 h-8 rounded-full bg-muted dark:bg-muted-dark items-center justify-center"
          style={{ opacity: canGoPrev ? 1 : 0.3 }}
        >
          <Ionicons name="chevron-back" size={16} color={colors.content} />
        </TouchableOpacity>

        <AppText variant="bodyMedium" className="font-bold">
          {MONTHS[viewMonth]} {viewYear}
        </AppText>

        <TouchableOpacity
          onPress={nextMonth}
          activeOpacity={0.7}
          className="w-8 h-8 rounded-full bg-muted dark:bg-muted-dark items-center justify-center"
        >
          <Ionicons name="chevron-forward" size={16} color={colors.content} />
        </TouchableOpacity>
      </View>

      {/* Weekday headers */}
      <View className="flex-row">
        {WEEKDAYS.map((d) => (
          <View key={d} className="flex-1 items-center">
            <AppText variant="caption" color="muted" className="font-semibold">
              {d}
            </AppText>
          </View>
        ))}
      </View>

      {/* Day grid */}
      <View className="gap-1">
        {Array.from({ length: cells.length / 7 }, (_, rowIdx) => (
          <View key={rowIdx} className="flex-row">
            {cells.slice(rowIdx * 7, rowIdx * 7 + 7).map((day, colIdx) => {
              if (!day) {
                return <View key={colIdx} className="flex-1" />;
              }

              const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const cellDate = new Date(viewYear, viewMonth, day);
              const isPast = cellDate < today;
              const isAvailable = availableSet.has(dateStr);
              const isSelected = selectedDate === dateStr;
              const isToday = toYMD(cellDate) === toYMD(today);

              return (
                <View key={colIdx} className="flex-1 items-center py-0.5">
                  <TouchableOpacity
                    onPress={() => !isPast && isAvailable && onSelectDate(dateStr)}
                    disabled={isPast || !isAvailable}
                    activeOpacity={0.75}
                  >
                    <View
                      className="w-9 h-9 rounded-full items-center justify-center"
                      style={{
                        backgroundColor: isSelected
                          ? colors.secondary
                          : isAvailable && !isPast
                          ? colors.secondary + "18"
                          : "transparent",
                        borderWidth: isToday && !isSelected ? 1.5 : 0,
                        borderColor: colors.secondary,
                      }}
                    >
                      <AppText
                        variant="small"
                        className={isSelected || (isAvailable && !isPast) ? "font-semibold" : ""}
                        style={{
                          color: isSelected
                            ? "#fff"
                            : isPast
                            ? colors.subtle + "66"
                            : isAvailable
                            ? colors.secondary
                            : colors.content,
                          opacity: isPast ? 0.4 : 1,
                        }}
                      >
                        {day}
                      </AppText>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        ))}
      </View>

      {/* Legend */}
      <View className="flex-row items-center gap-4 pt-1">
        <View className="flex-row items-center gap-1.5">
          <View className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.secondary + "40" }} />
          <AppText variant="caption" color="muted">Disponível</AppText>
        </View>
        <View className="flex-row items-center gap-1.5">
          <View className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.secondary }} />
          <AppText variant="caption" color="muted">Selecionado</AppText>
        </View>
      </View>
    </AppCard>
  );
}
