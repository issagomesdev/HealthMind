import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { useTheme } from "../../../core/theme";
import type { ChatFilterType } from "../../../types/chat";

interface EmptyChatStateProps {
  filter: ChatFilterType;
}

function getContent(filter: ChatFilterType): { icon: string; title: string; subtitle: string } {
  switch (filter) {
    case "unread":
      return {
        icon: "checkmark-done-circle-outline",
        title: "Nenhuma mensagem não lida",
        subtitle: "Você está em dia com todas as conversas.",
      };
    case "professionals":
      return {
        icon: "person-circle-outline",
        title: "Nenhum profissional encontrado",
        subtitle: "Conecte-se com um profissional para iniciar uma conversa.",
      };
    case "patients":
      return {
        icon: "people-outline",
        title: "Nenhum paciente encontrado",
        subtitle: "Seus pacientes aparecerão aqui quando iniciarem conversa.",
      };
    case "community":
      return {
        icon: "chatbubbles-outline",
        title: "Nenhuma conversa na comunidade",
        subtitle: "Participe de grupos e conecte-se com outros membros.",
      };
    case "support":
      return {
        icon: "headset-outline",
        title: "Sem mensagens do suporte",
        subtitle: "Nossa equipe de suporte está disponível para ajudar.",
      };
    case "online":
      return {
        icon: "radio-outline",
        title: "Ninguém online agora",
        subtitle: "Envie uma mensagem mesmo assim — ela será recebida em breve.",
      };
    default:
      return {
        icon: "chatbubble-ellipses-outline",
        title: "Nenhuma conversa ainda",
        subtitle: "Inicie uma conversa com seu profissional ou equipe.",
      };
  }
}

export function EmptyChatState({ filter }: EmptyChatStateProps) {
  const { colors } = useTheme();
  const { icon, title, subtitle } = getContent(filter);

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 60,
        paddingHorizontal: 40,
        gap: 16,
      }}
    >
      <View
        style={{
          width: 72,
          height: 72,
          borderRadius: 36,
          backgroundColor: colors.secondary + "18",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name={icon as any} size={36} color={colors.secondary} />
      </View>
      <View style={{ alignItems: "center", gap: 8 }}>
        <AppText
          style={{
            fontSize: 17,
            fontWeight: "700",
            color: colors.content,
            textAlign: "center",
          }}
        >
          {title}
        </AppText>
        <AppText
          style={{
            fontSize: 14,
            color: colors.subtle,
            textAlign: "center",
            lineHeight: 21,
          }}
        >
          {subtitle}
        </AppText>
      </View>
    </View>
  );
}
