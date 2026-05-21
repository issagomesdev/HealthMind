import React, { useEffect, useState } from "react";
import { View, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppText } from "../../components/ui/AppText";
import { TopBar } from "../../components/navigation/TopBar";
import { PublicProfileHeader } from "../../components/chat/PublicProfileHeader";
import { PublicProfileSection } from "../../components/chat/PublicProfileSection";
import { PublicProfileActionButton } from "../../components/chat/PublicProfileActionButton";
import { publicProfileService } from "../../../services/publicProfileService";
import { useTheme } from "../../../core/theme";
import type { PublicProfessionalProfile } from "../../../types/publicProfile";

function ChipList({ items, colors }: { items: string[]; colors: ReturnType<typeof useTheme>["colors"] }) {
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
      {items.map((item) => (
        <View
          key={item}
          style={{
            backgroundColor: colors.secondary + "18",
            borderRadius: 99,
            paddingHorizontal: 12,
            paddingVertical: 5,
            borderWidth: 1,
            borderColor: colors.secondary + "35",
          }}
        >
          <AppText style={{ fontSize: 13, fontWeight: "600", color: colors.secondary }}>
            {item}
          </AppText>
        </View>
      ))}
    </View>
  );
}

export function PublicProfessionalProfileScreen() {
  const { participantId, conversationId } = useLocalSearchParams<{
    participantId: string;
    conversationId?: string;
  }>();
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [profile, setProfile] = useState<PublicProfessionalProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    publicProfileService.getProfessionalProfile(participantId).then((data) => {
      if (!cancelled) {
        setProfile(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [participantId]);

  function handleOpenChat() {
    if (conversationId) {
      router.push(
        `/(protected)/chat-conversation?conversationId=${conversationId}&userRole=patient` as any
      );
    } else {
      router.push("/(protected)/messages" as any);
    }
  }

  function handleViewAgenda() {
    router.push("/(protected)/appointments" as any);
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <TopBar title="Perfil" onBackPress={() => router.back()} showNotifications={false} />

      {loading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator color={colors.secondary} />
        </View>
      ) : !profile ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24 }}>
          <AppText style={{ color: colors.subtle, textAlign: "center" }}>
            Perfil não encontrado.
          </AppText>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        >
          {/* Header */}
          <PublicProfileHeader
            avatarInitials={profile.avatarInitials}
            name={profile.name}
            subtitle={`${profile.specialty} · ${profile.crp}`}
            isOnline={profile.isOnline}
            lastSeen={profile.lastSeen}
            username={profile.username}
            city={profile.city}
            state={profile.state}
            colors={colors}
          />

          <View style={{ paddingHorizontal: 16 }}>
            {/* Rating card */}
            <PublicProfileSection title="Avaliação" colors={colors}>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around" }}>
                {/* Rating */}
                <View style={{ alignItems: "center", gap: 4 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                    <Ionicons name="star" size={18} color="#F59E0B" />
                    <AppText style={{ fontSize: 20, fontWeight: "700", color: colors.content }}>
                      {profile.rating.toFixed(1)}
                    </AppText>
                  </View>
                  <AppText style={{ fontSize: 12, color: colors.subtle }}>
                    {profile.reviewCount} avaliações
                  </AppText>
                </View>

                {/* Divider */}
                <View style={{ width: 1, height: 40, backgroundColor: colors.border }} />

                {/* Experience */}
                <View style={{ alignItems: "center", gap: 4 }}>
                  <AppText style={{ fontSize: 20, fontWeight: "700", color: colors.content }}>
                    {profile.yearsOfExperience}
                  </AppText>
                  <AppText style={{ fontSize: 12, color: colors.subtle }}>
                    anos de experiência
                  </AppText>
                </View>
              </View>
            </PublicProfileSection>

            {/* Bio */}
            <PublicProfileSection title="Sobre" colors={colors}>
              <AppText style={{ fontSize: 14, color: colors.content, lineHeight: 22 }}>
                {profile.bio}
              </AppText>
            </PublicProfileSection>

            {/* Approaches */}
            <PublicProfileSection title="Abordagens" colors={colors}>
              <ChipList items={profile.approaches} colors={colors} />
            </PublicProfileSection>

            {/* Areas of expertise */}
            <PublicProfileSection title="Áreas de Atuação" colors={colors}>
              <ChipList items={profile.areasOfExpertise} colors={colors} />
            </PublicProfileSection>

            {/* Appointment info */}
            <PublicProfileSection title="Atendimento" colors={colors}>
              {profile.appointmentTypes.map((type) => (
                <View
                  key={type}
                  style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}
                >
                  <Ionicons name="checkmark-circle-outline" size={16} color="#6DBF7B" />
                  <AppText style={{ fontSize: 14, color: colors.content }}>{type}</AppText>
                </View>
              ))}
              <View style={{ marginTop: 8, padding: 12, backgroundColor: colors.secondary + "12", borderRadius: 10 }}>
                <AppText style={{ fontSize: 12, color: colors.subtle, marginBottom: 2 }}>
                  Próxima disponibilidade
                </AppText>
                <AppText style={{ fontSize: 14, fontWeight: "600", color: colors.secondary }}>
                  {new Date(profile.nextAvailability).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                  })}{" "}
                  às{" "}
                  {new Date(profile.nextAvailability).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </AppText>
              </View>
            </PublicProfileSection>

            {/* Action buttons */}
            {/* <View style={{ gap: 10, marginTop: 4 }}>
              <PublicProfileActionButton
                icon="chatbubble-outline"
                label="Abrir chat"
                onPress={handleOpenChat}
                colors={colors}
              />
              <PublicProfileActionButton
                icon="calendar-outline"
                label="Ver agenda"
                onPress={handleViewAgenda}
                ghost
                colors={colors}
              />
            </View> */}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
