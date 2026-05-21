import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { OnlineStatusBadge } from "./OnlineStatusBadge";
import type { ColorTokens } from "../../../core/theme/colors";

interface PublicProfileHeaderProps {
  avatarInitials: string;
  name: string;
  subtitle: string;
  isOnline: boolean;
  lastSeen: string | null;
  badge?: string;
  city?: string;
  state?: string;
  username?: string;
  colors: ColorTokens;
}

export function PublicProfileHeader({
  avatarInitials,
  name,
  subtitle,
  isOnline,
  lastSeen,
  badge,
  city,
  state,
  username,
  colors,
}: PublicProfileHeaderProps) {
  const statusLabel = isOnline
    ? "Online"
    : lastSeen
    ? `Visto em ${new Date(lastSeen).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      })} às ${new Date(lastSeen).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })}`
    : "Offline";

  return (
    <View style={{ alignItems: "center", paddingHorizontal: 20, paddingVertical: 24, gap: 10 }}>
      {/* Avatar */}
      <View style={{ position: "relative" }}>
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: colors.secondary + "22",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AppText style={{ fontSize: 30, fontWeight: "700", color: colors.secondary }}>
            {avatarInitials}
          </AppText>
        </View>
        <View style={{ position: "absolute", bottom: 2, right: 2 }}>
          <OnlineStatusBadge isOnline={isOnline} />
        </View>
      </View>

      {/* Name */}
      <AppText style={{ fontSize: 20, fontWeight: "700", color: colors.content, textAlign: "center" }}>
        {name}
      </AppText>

      {/* Subtitle */}
      <AppText style={{ fontSize: 14, color: colors.subtle, textAlign: "center" }}>
        {subtitle}
      </AppText>

      {/* Username */}
      {username && (
        <AppText style={{ fontSize: 13, color: colors.secondary, textAlign: "center" }}>
          {username}
        </AppText>
      )}

      {/* City / State */}
      {(city || state) && (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Ionicons name="location-outline" size={14} color={colors.subtle} />
          <AppText style={{ fontSize: 13, color: colors.subtle }}>
            {[city, state].filter(Boolean).join(", ")}
          </AppText>
        </View>
      )}

      {/* Status */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: isOnline ? "#6DBF7B" : colors.border,
          }}
        />
        <AppText style={{ fontSize: 13, color: colors.subtle }}>{statusLabel}</AppText>
      </View>

      {/* Role badge */}
      {badge && (
        <View
          style={{
            backgroundColor: colors.muted,
            borderRadius: 99,
            paddingHorizontal: 12,
            paddingVertical: 4,
          }}
        >
          <AppText style={{ fontSize: 12, fontWeight: "600", color: colors.subtle }}>
            {badge}
          </AppText>
        </View>
      )}
    </View>
  );
}
