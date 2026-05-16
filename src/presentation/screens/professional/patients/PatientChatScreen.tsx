import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../../../components/ui/AppText";
import { LoadingState } from "../../../components/ui/LoadingState";
import { ChatBubble } from "../../../components/professional/patients/ChatBubble";
import { useTheme } from "../../../../core/theme";
import { patientsService } from "../../../../services/patients/PatientsService";
import { ProfessionalPatient, ChatMessage } from "../../../../types/patient";
import { getInitials } from "../../../../utils/patient";

const PROFESSIONAL_ID = "prof1";

export function PatientChatScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList<ChatMessage>>(null);

  const [patient, setPatient] = useState<ProfessionalPatient | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setIsLoading(true);
      try {
        const [p, msgs] = await Promise.all([
          patientsService.getPatientById(id),
          patientsService.getPatientMessages(id),
        ]);
        setPatient(p);
        setMessages(msgs);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: false });
      }, 100);
    }
  }, [messages.length]);

  const handleSend = useCallback(async () => {
    const text = inputText.trim();
    if (!text || !id || isSending) return;
    setInputText("");
    setIsSending(true);
    try {
      const newMsg = await patientsService.sendChatMessage(id, text, PROFESSIONAL_ID);
      setMessages((prev) => [...prev, newMsg]);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 50);
    } finally {
      setIsSending(false);
    }
  }, [inputText, id, isSending]);

  const handleCallPress = () => {
    Alert.alert("Chamada", "Solicitação de chamada enviada ao paciente.");
  };

  const handleVideoPress = () => {
    Alert.alert("Videochamada", "Solicitação de chamada enviada ao paciente.");
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <StatusBar
          barStyle={isDark ? "light-content" : "dark-content"}
          backgroundColor={colors.background}
        />
        <View
          style={{
            paddingTop: insets.top + 8,
            paddingBottom: 12,
            paddingHorizontal: 16,
            backgroundColor: colors.surface,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
            <Ionicons name="chevron-back" size={24} color={colors.content} />
          </TouchableOpacity>
          <AppText variant="bodyMedium" style={{ fontWeight: "700" }}>
            Chat
          </AppText>
        </View>
        <LoadingState message="Carregando mensagens..." fullScreen />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.surface}
      />

      {/* Custom Header */}
      <View
        style={{
          paddingTop: insets.top + 6,
          paddingBottom: 12,
          paddingHorizontal: 16,
          backgroundColor: colors.surface,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color={colors.content} />
        </TouchableOpacity>

        {/* Avatar + name */}
        <View
          style={{
            width: 38,
            height: 38,
            borderRadius: 19,
            backgroundColor: colors.secondary + "20",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AppText variant="small" style={{ color: colors.secondary, fontWeight: "700" }}>
            {patient ? getInitials(patient.name) : "?"}
          </AppText>
        </View>
        <View style={{ flex: 1 }}>
          <AppText variant="bodyMedium" style={{ fontWeight: "700" }}>
            {patient?.name ?? "Paciente"}
          </AppText>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <View
              style={{
                width: 7,
                height: 7,
                borderRadius: 4,
                backgroundColor: "#6DBF7B",
              }}
            />
            <AppText variant="caption" color="muted">
              Online
            </AppText>
          </View>
        </View>

        {/* Action buttons */}
        <TouchableOpacity
          onPress={handleCallPress}
          activeOpacity={0.7}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: colors.secondary + "15",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="call-outline" size={18} color={colors.secondary} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleVideoPress}
          activeOpacity={0.7}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: colors.secondary + "15",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="videocam-outline" size={18} color={colors.secondary} />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      {messages.length === 0 ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 32 }}>
          <Ionicons name="chatbubbles-outline" size={48} color={colors.subtle} />
          <AppText variant="body" color="muted" style={{ textAlign: "center", marginTop: 12 }}>
            Nenhuma mensagem ainda. Inicie a conversa!
          </AppText>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChatBubble
              message={item}
              isOwn={item.senderId === PROFESSIONAL_ID}
            />
          )}
          contentContainerStyle={{ paddingVertical: 12 }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => {
            flatListRef.current?.scrollToEnd({ animated: false });
          }}
        />
      )}

      {/* Message input */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: insets.bottom + 8,
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          gap: 10,
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: colors.background,
            borderRadius: 22,
            borderWidth: 1,
            borderColor: colors.border,
            paddingHorizontal: 16,
            paddingVertical: 10,
            minHeight: 44,
            maxHeight: 120,
          }}
        >
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Escreva uma mensagem..."
            placeholderTextColor={colors.subtle}
            style={{
              color: colors.content,
              fontSize: 15,
              lineHeight: 22,
            }}
            multiline
            returnKeyType="send"
            blurOnSubmit={false}
            onSubmitEditing={handleSend}
          />
        </View>
        <TouchableOpacity
          onPress={handleSend}
          disabled={!inputText.trim() || isSending}
          activeOpacity={0.8}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor:
              inputText.trim() ? colors.secondary : colors.border,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="send" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
