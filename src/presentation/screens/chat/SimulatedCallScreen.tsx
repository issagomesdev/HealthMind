import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, StatusBar } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../../components/ui/AppText";

function useCallTimer() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

export function SimulatedCallScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { participantName, participantId, callType } = useLocalSearchParams<{
    participantName: string;
    participantId: string;
    callType: "voice" | "video";
  }>();

  const name = decodeURIComponent(participantName ?? "Participante");
  const isVideo = callType === "video";
  const timer = useCallTimer();

  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  const handleEnd = () => router.back();

  if (isVideo) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0F172A" }}>
        <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

        {/* Fake remote video area */}
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
            paddingTop: insets.top + 16,
          }}
        >
          {/* Avatar placeholder (no video yet) */}
          <View
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: "#1E40AF40",
              borderWidth: 3,
              borderColor: "#60A5FA50",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AppText style={{ fontSize: 44, fontWeight: "700", color: "#60A5FA", lineHeight: 34 }}>
              {initials}
            </AppText>
          </View>

          <View style={{ alignItems: "center", gap: 8 }}>
            <AppText style={{ fontSize: 24, fontWeight: "800", color: "#fff" }}>{name}</AppText>
            <AppText style={{ fontSize: 14, color: "#94A3B8" }}>
              Iniciando chamada de vídeo com {name}...
            </AppText>
            <AppText style={{ fontSize: 13, color: "#64748B", marginTop: 4 }}>
              Aguardando resposta • {timer}
            </AppText>
          </View>

          {/* "Aguardando vídeo" badge */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              backgroundColor: "#1E293B",
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 20,
            }}
          >
            <Ionicons name="videocam-off-outline" size={15} color="#94A3B8" />
            <AppText style={{ fontSize: 12, color: "#94A3B8" }}>Aguardando vídeo</AppText>
          </View>
        </View>

        {/* Self camera placeholder (top-right) */}
        <View
          style={{
            position: "absolute",
            top: insets.top + 16,
            right: 16,
            width: 80,
            height: 110,
            borderRadius: 12,
            backgroundColor: "#1E293B",
            borderWidth: 1,
            borderColor: "#334155",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="camera-outline" size={22} color="#475569" />
        </View>

        {/* Controls bar */}
        <View
          style={{
            paddingBottom: insets.bottom + 24,
            paddingTop: 20,
            paddingHorizontal: 32,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#0F172A",
          }}
        >
          {/* Mic */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              width: 52,
              height: 52,
              borderRadius: 26,
              backgroundColor: "#1E293B",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="mic-outline" size={24} color="#94A3B8" />
          </TouchableOpacity>

          {/* End call */}
          <TouchableOpacity
            onPress={handleEnd}
            activeOpacity={0.85}
            style={{
              width: 68,
              height: 68,
              borderRadius: 34,
              backgroundColor: "#EF4444",
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#EF4444",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.4,
              shadowRadius: 8,
              elevation: 6,
            }}
          >
            <Ionicons name="call" size={28} color="#fff" style={{ transform: [{ rotate: "135deg" }] }} />
          </TouchableOpacity>

          {/* Camera */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              width: 52,
              height: 52,
              borderRadius: 26,
              backgroundColor: "#1E293B",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="videocam-outline" size={24} color="#94A3B8" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── Voice call ───────────────────────────────────────────────────────────────
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0F172A",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: insets.top + 40,
        paddingBottom: insets.bottom + 48,
      }}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* Participant info */}
      <View style={{ alignItems: "center", gap: 20, width: "100%" }}>
        {/* Pulsing avatar rings */}
        <View style={{ position: "relative", alignItems: "center", justifyContent: "center" }}>
          <View
            style={{
              position: "absolute",
              width: 168,
              height: 168,
              borderRadius: 84,
              backgroundColor: "#10B98110",
            }}
          />
          <View
            style={{
              position: "absolute",
              width: 140,
              height: 140,
              borderRadius: 70,
              backgroundColor: "#10B98118",
            }}
          />
          <View
            style={{
              width: 116,
              height: 116,
              borderRadius: 58,
              backgroundColor: "#10B98125",
              borderWidth: 3,
              borderColor: "#10B98160",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AppText style={{ fontSize: 40, fontWeight: "700", color: "#10B981", lineHeight: 30 }}>
              {initials}
            </AppText>
          </View>
        </View>

        <View style={{ alignItems: "center", gap: 10 }}>
          <AppText style={{ fontSize: 26, fontWeight: "800", color: "#fff"}}>
            {name}
          </AppText>
          <AppText style={{ fontSize: 15, color: "#94A3B8" }}>
            Chamando {name}...
          </AppText>
          <AppText style={{ fontSize: 13, color: "#64748B" }}>
            Aguardando resposta • {timer}
          </AppText>
        </View>
      </View>

      {/* End call button */}
      <View style={{ alignItems: "center", gap: 12 }}>
        <TouchableOpacity
          onPress={handleEnd}
          activeOpacity={0.85}
          style={{
            width: 76,
            height: 76,
            borderRadius: 38,
            backgroundColor: "#EF4444",
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#EF4444",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <Ionicons name="call" size={32} color="#fff" style={{ transform: [{ rotate: "135deg" }] }} />
        </TouchableOpacity>
        <AppText style={{ fontSize: 13, color: "#64748B" }}>Cancelar chamada</AppText>
      </View>
    </View>
  );
}
