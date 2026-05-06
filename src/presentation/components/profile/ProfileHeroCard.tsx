import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { UserProfile } from "../../../core/types";
import { useTheme } from "../../../core/theme";

interface ProfileHeroCardProps {
  profile: UserProfile;
  onEditAvatar?: () => void;
}

function AvatarInitials({ name, size = 96 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <View
      className="rounded-full bg-secondary/20 dark:bg-secondary-dark/20 items-center justify-center overflow-hidden"
      style={{ width: size, height: size }}
    >
      <AppText
        style={{ fontSize: size * 0.35, fontWeight: "700", color: "#2A9D8F" }}
      >
        {initials}
      </AppText>
    </View>
  );
}

export function ProfileHeroCard({ profile, onEditAvatar }: ProfileHeroCardProps) {
  const { colors } = useTheme();

  return (
    <View className="items-center gap-4 pt-4 pb-2">
      {/* Avatar + edit button */}
      <View>
        <AvatarInitials name={profile.name} />
        <TouchableOpacity
          onPress={onEditAvatar}
          activeOpacity={0.8}
          className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-secondary dark:bg-secondary-dark items-center justify-center"
          style={{
            shadowColor: colors.secondary,
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.4,
            shadowRadius: 6,
            elevation: 5,
          }}
        >
          <Ionicons name="pencil" size={16} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Name */}
      <View className="items-center gap-2">
        <AppText variant="heading2" className="font-bold text-center">
          {profile.name}
        </AppText>
        <View className="flex-row items-center gap-1.5 bg-secondary/10 dark:bg-secondary-dark/15 px-4 py-1.5 rounded-full">
          <Ionicons name="shield-checkmark" size={14} color={colors.secondary} />
          <AppText variant="caption" color="secondary" className="font-semibold">
            {profile.badge} · Nível {profile.level}
          </AppText>
        </View>
      </View>
    </View>
  );
}
