import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppText } from "./AppText";
import { useTheme } from "../../../core/theme";

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  rightElement?: React.ReactNode;
}

export function AppHeader({ title, showBack = false, onBackPress, rightElement }: AppHeaderProps) {
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-row items-center justify-between px-5"
      style={{ paddingTop: insets.top + 8, paddingBottom: 12 }}
    >
      {showBack ? (
        <TouchableOpacity
          onPress={onBackPress ?? (() => router.back())}
          className="w-10 h-10 rounded-full items-center justify-center bg-muted dark:bg-muted-dark"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="chevron-back" size={22} color={colors.content} />
        </TouchableOpacity>
      ) : (
        <View className="w-10 h-10" />
      )}

      {title && (
        <AppText variant="heading3" className="flex-1 text-center">
          {title}
        </AppText>
      )}

      {rightElement ?? <View className="w-10 h-10" />}
    </View>
  );
}
