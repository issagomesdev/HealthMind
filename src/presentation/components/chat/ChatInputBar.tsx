import React from "react";
import { View, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../core/theme";

interface ChatInputBarProps {
  value: string;
  onChangeText: (v: string) => void;
  onSend: () => void;
  onAttachmentPress: () => void;
  isSending?: boolean;
}

export function ChatInputBar({
  value,
  onChangeText,
  onSend,
  onAttachmentPress,
  isSending = false,
}: ChatInputBarProps) {
  const { colors, isDark } = useTheme();
  const hasText = value.trim().length > 0;
  const canSend = hasText && !isSending;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-end",
        paddingHorizontal: 16,
        paddingVertical: 8,
        gap: 10,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        backgroundColor: colors.background,
      }}
    >
      {/* Attachment button */}
      <TouchableOpacity
        onPress={onAttachmentPress}
        activeOpacity={0.75}
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: colors.muted,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 3,
        }}
      >
        <Ionicons name="add" size={22} color={colors.subtle} />
      </TouchableOpacity>

      {/* Text input */}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Escreva sua mensagem..."
        placeholderTextColor={colors.subtle}
        multiline
        style={{
          flex: 1,
          minHeight: 40,
          maxHeight: 120,
          borderRadius: 22,
          borderWidth: 1.5,
          borderColor: colors.border,
          backgroundColor: isDark ? colors.surface : "#F9FAFB",
          paddingHorizontal: 14,
          paddingTop: 10,
          paddingBottom: 10,
          fontSize: 15,
          color: colors.content,
        }}
      />

      {/* Send button */}
      <TouchableOpacity
        onPress={canSend ? onSend : undefined}
        activeOpacity={canSend ? 0.75 : 1}
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: canSend ? colors.secondary : colors.border,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 0,
        }}
      >
        {isSending ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Ionicons
            name="send"
            size={20}
            color={canSend ? "#fff" : colors.subtle}
          />
        )}
      </TouchableOpacity>
    </View>
  );
}
