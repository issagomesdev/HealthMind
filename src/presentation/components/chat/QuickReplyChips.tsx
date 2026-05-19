import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { AppText } from "../ui/AppText";
import { useTheme } from "../../../core/theme";

interface QuickReplyChipsProps {
  onSelect: (text: string) => void;
  userRole: "patient" | "professional";
}

const PATIENT_REPLIES = [
  "Como você está se sentindo?",
  "Tudo bem!",
  "Vamos falar na sessão.",
  "Obrigada pelo apoio!",
];

const PROFESSIONAL_REPLIES = [
  "Como você está se sentindo hoje?",
  "Podemos falar sobre isso na próxima sessão.",
  "Lembre-se de registrar seu check-in.",
  "Estou disponível no horário combinado.",
];

export function QuickReplyChips({ onSelect, userRole }: QuickReplyChipsProps) {
  const { colors } = useTheme();
  const replies = userRole === "patient" ? PATIENT_REPLIES : PROFESSIONAL_REPLIES;

  return (
    <View style={{ borderTopWidth: 1, borderTopColor: colors.border }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 8,
          gap: 8,
          flexDirection: "row",
        }}
      >
        {replies.map((reply) => (
          <TouchableOpacity
            key={reply}
            onPress={() => onSelect(reply)}
            activeOpacity={0.75}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 18,
              borderWidth: 1.5,
              borderColor: colors.secondary + "60",
              backgroundColor: colors.secondary + "0f",
            }}
          >
            <AppText
              style={{
                fontSize: 13,
                color: colors.secondary,
                fontWeight: "500",
              }}
            >
              {reply}
            </AppText>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
