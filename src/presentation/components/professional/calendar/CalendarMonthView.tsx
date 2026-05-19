import React, { useMemo } from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../../ui/AppText";
import { useTheme } from "../../../../core/theme";
import { CalendarDayData } from "../../../../types/professionalCalendar";

const PT_MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];
const WEEK_DAYS = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];

const DOT_APPOINTMENT = "#2A9D8F";
const DOT_REMINDER = "#F59E0B";
const DOT_TASK = "#6DBF7B";

interface CalendarMonthViewProps {
  year: number;
  month: number; // 1-12
  selectedDate: string; // YYYY-MM-DD
  onDayPress: (date: string) => void;
  calendarDots: CalendarDayData[];
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month - 1, 1).getDay(); // 0 = Sunday
}

function padDate(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function CalendarMonthView({
  year,
  month,
  selectedDate,
  onDayPress,
  calendarDots,
  onPrevMonth,
  onNextMonth,
}: CalendarMonthViewProps) {
  const { colors } = useTheme();
  const todayStr = new Date().toISOString().slice(0, 10);

  const dotMap = useMemo(() => {
    const map = new Map<string, CalendarDayData>();
    calendarDots.forEach((d) => map.set(d.date, d));
    return map;
  }, [calendarDots]);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDow = getFirstDayOfWeek(year, month);

  // Build 6×7 grid
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const rows: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7));
  }

  return (
    <View>
      {/* Month header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
          paddingHorizontal: 4,
        }}
      >
        <TouchableOpacity
          onPress={onPrevMonth}
          activeOpacity={0.7}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: colors.muted,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="chevron-back" size={18} color={colors.content} />
        </TouchableOpacity>

        <AppText style={{ fontSize: 17, fontWeight: "700", color: colors.content }}>
          {PT_MONTHS[month - 1]} {year}
        </AppText>

        <TouchableOpacity
          onPress={onNextMonth}
          activeOpacity={0.7}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: colors.muted,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="chevron-forward" size={18} color={colors.content} />
        </TouchableOpacity>
      </View>

      {/* Day headers */}
      <View style={{ flexDirection: "row", marginBottom: 4 }}>
        {WEEK_DAYS.map((d) => (
          <View key={d} style={{ flex: 1, alignItems: "center" }}>
            <AppText
              style={{
                fontSize: 11,
                fontWeight: "600",
                color: colors.subtle,
                letterSpacing: 0.5,
              }}
            >
              {d}
            </AppText>
          </View>
        ))}
      </View>

      {/* Grid rows */}
      {rows.map((row, ri) => (
        <View key={ri} style={{ flexDirection: "row" }}>
          {row.map((day, ci) => {
            if (day === null) {
              return <View key={`empty-${ri}-${ci}`} style={{ flex: 1, height: 52 }} />;
            }

            const dateStr = padDate(year, month, day);
            const isSelected = dateStr === selectedDate;
            const isToday = dateStr === todayStr;
            const dots = dotMap.get(dateStr);

            return (
              <TouchableOpacity
                key={dateStr}
                onPress={() => onDayPress(dateStr)}
                activeOpacity={0.75}
                style={{ flex: 1, height: 52, alignItems: "center", justifyContent: "center" }}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: isSelected ? colors.secondary : "transparent",
                    borderWidth: isToday && !isSelected ? 1.5 : 0,
                    borderColor: colors.secondary,
                  }}
                >
                  <AppText
                    style={{
                      fontSize: 14,
                      fontWeight: isToday || isSelected ? "700" : "400",
                      color: isSelected
                        ? "#fff"
                        : isToday
                        ? colors.secondary
                        : colors.content,
                    }}
                  >
                    {day}
                  </AppText>
                </View>

                {/* Dot indicators */}
                {dots && (
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 2,
                      marginTop: 2,
                      height: 5,
                      alignItems: "center",
                    }}
                  >
                    {dots.hasAppointment && (
                      <View
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: 2.5,
                          backgroundColor: DOT_APPOINTMENT,
                        }}
                      />
                    )}
                    {dots.hasReminder && (
                      <View
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: 2.5,
                          backgroundColor: DOT_REMINDER,
                        }}
                      />
                    )}
                    {dots.hasTask && (
                      <View
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: 2.5,
                          backgroundColor: DOT_TASK,
                        }}
                      />
                    )}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
}
