import React from "react";
import { View, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { UserAppointment } from "../../../core/types";

interface NextAppointmentCardProps {
  appointment: UserAppointment;
  onReschedule: (id: string) => void;
}

function formatDateLabel(dateStr: string): string {
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
  if (dateStr === today) return "Hoje";
  if (dateStr === tomorrow) return "Amanhã";
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
}

export function NextAppointmentCard({ appointment, onReschedule }: NextAppointmentCardProps) {
  const dateLabel = formatDateLabel(appointment.date);

  const handleEnterRoom = () => {
    Alert.alert("Em breve", "Funcionalidade disponível em breve.");
  };

  return (
    <View
      className="rounded-3xl overflow-hidden mx-5"
      style={{
        shadowColor: "#1F7A73",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 12,
      }}
    >
      {/* Gradient background via layered views */}
      <View
        style={{ backgroundColor: "#1a6b5c" }}
        className="p-5"
      >
        {/* Decorative circle top-right */}
        <View
          className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10"
          style={{ backgroundColor: "#ffffff", transform: [{ translateX: 16 }, { translateY: -16 }] }}
          pointerEvents="none"
        />
        <View
          className="absolute bottom-0 left-0 w-24 h-24 rounded-full opacity-10"
          style={{ backgroundColor: "#ffffff", transform: [{ translateX: -12 }, { translateY: 12 }] }}
          pointerEvents="none"
        />

        {/* Badge */}
        <View className="self-start px-3 py-1 rounded-full mb-4" style={{ backgroundColor: "rgba(255,255,255,0.18)" }}>
          <AppText variant="caption" color="white" className="font-bold tracking-widest uppercase">
            Próxima Consulta
          </AppText>
        </View>

        {/* Professional info */}
        <AppText
          variant="heading2"
          color="white"
          className="font-bold mb-1"
        >
          {appointment.professionalName}
        </AppText>
        <AppText variant="small" color="white" className="opacity-80 mb-5">
          {appointment.specialty}
        </AppText>

        {/* Date + time */}
        <View className="flex-row items-center gap-2 mb-6">
          <View className="gap-0.5">
            <AppText variant="bodyMedium" color="white" className="font-bold capitalize">
              {dateLabel}
            </AppText>
            <AppText variant="body" color="white" className="opacity-75">
              {appointment.time}
            </AppText>
          </View>
          {appointment.type && (
            <View
              className="ml-auto px-3 py-1 rounded-full"
              style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
            >
              <View className="flex-row items-center gap-1">
                <Ionicons
                  name={appointment.type === "Online" ? "videocam-outline" : "location-outline"}
                  size={13}
                  color="rgba(255,255,255,0.9)"
                />
                <AppText variant="caption" color="white" className="opacity-90">
                  {appointment.type}
                </AppText>
              </View>
            </View>
          )}
        </View>

        {/* Buttons */}
        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={handleEnterRoom}
            activeOpacity={0.8}
            className="flex-1 py-3 rounded-2xl items-center justify-center border border-white/40"
          >
            <AppText variant="smallMedium" color="white" className="font-semibold">
              Entrar na Sala
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onReschedule(appointment.id)}
            activeOpacity={0.8}
            className="flex-1 py-3 rounded-2xl items-center justify-center"
            style={{ backgroundColor: "rgba(255,255,255,0.22)" }}
          >
            <AppText variant="smallMedium" color="white" className="font-semibold">
              Reagendar
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
