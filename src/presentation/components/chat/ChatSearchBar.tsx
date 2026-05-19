import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../core/theme";

interface ChatSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
}

export function ChatSearchBar({ value, onChangeText, onClear }: ChatSearchBarProps) {
  const { colors, isDark } = useTheme();

  return (
    <View className="mx-4 mb-3">
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          height: 44,
          backgroundColor: colors.surface,
          borderRadius: 22,
          paddingHorizontal: 14,
          borderWidth: 1,
          borderColor: colors.border,
          gap: 10,
        }}
      >
        <Ionicons name="search-outline" size={18} color={colors.subtle} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Buscar conversas..."
          placeholderTextColor={colors.subtle}
          style={{
            flex: 1,
            fontSize: 14,
            color: colors.content,
          }}
          returnKeyType="search"
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={onClear} activeOpacity={0.7}>
            <Ionicons name="close-circle" size={18} color={colors.subtle} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
