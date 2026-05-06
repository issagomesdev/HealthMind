import React from "react";
import { View, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../core/theme";

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function SearchInput({
  value,
  onChangeText,
  placeholder = "Buscar por tema ou palavra-chave...",
}: SearchInputProps) {
  const { colors, isDark } = useTheme();

  return (
    <View
      className="flex-row items-center gap-3 bg-surface dark:bg-surface-dark rounded-2xl px-4"
      style={{
        height: 52,
        borderWidth: 1.5,
        borderColor: isDark ? colors.border : "#E5E7EB",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <Ionicons name="search-outline" size={20} color={colors.subtle} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.subtle}
        style={{
          flex: 1,
          fontSize: 15,
          color: isDark ? colors.content : "#1F2937",
        }}
        returnKeyType="search"
      />
    </View>
  );
}
