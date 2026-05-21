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
import type { PublicUserProfile } from "../../../types/publicProfile";

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

function roleBadgeLabel(role: string): string {
  if (role === "patient") return "Paciente";
  if (role === "community") return "Membro da Comunidade";
  return role;
}

export function PublicUserProfileScreen() {
  const { participantId, participantType } = useLocalSearchParams<{
    participantId: string;
    participantType: string;
  }>();
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [profile, setProfile] = useState<PublicUserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    publicProfileService.getUserProfile(participantId).then((data) => {
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
    router.push("/(protected)/messages" as any);
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
            subtitle={profile.username}
            isOnline={profile.isOnline}
            lastSeen={profile.lastSeen}
            username={profile.username}
            city={profile.city}
            state={profile.state}
            badge={roleBadgeLabel(profile.role)}
            colors={colors}
          />

          <View style={{ paddingHorizontal: 16 }}>
            {/* Bio */}
            <PublicProfileSection title="Sobre" colors={colors}>
              <AppText style={{ fontSize: 14, color: colors.content, lineHeight: 22 }}>
                {profile.bio}
              </AppText>
            </PublicProfileSection>

            {/* Interests */}
            {profile.interests.length > 0 && (
              <PublicProfileSection title="Interesses" colors={colors}>
                <ChipList items={profile.interests} colors={colors} />
              </PublicProfileSection>
            )}

            {/* Joined at */}
            <PublicProfileSection title="Na plataforma desde" colors={colors}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Ionicons name="calendar-outline" size={16} color={colors.subtle} />
                <AppText style={{ fontSize: 14, color: colors.content }}>
                  {new Date(profile.joinedAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </AppText>
              </View>
            </PublicProfileSection>

            {/* Badges */}
            {profile.badges.length > 0 && (
              <PublicProfileSection title="Conquistas" colors={colors}>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  {profile.badges.map((badge) => (
                    <View
                      key={badge}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 5,
                        backgroundColor: colors.muted,
                        borderRadius: 99,
                        paddingHorizontal: 12,
                        paddingVertical: 5,
                      }}
                    >
                      <Ionicons name="star-outline" size={12} color={colors.subtle} />
                      <AppText style={{ fontSize: 12, fontWeight: "600", color: colors.subtle }}>
                        {badge}
                      </AppText>
                    </View>
                  ))}
                </View>
              </PublicProfileSection>
            )}

            {/* Action button */}
            {/* <View style={{ marginTop: 4 }}>
              <PublicProfileActionButton
                icon="chatbubble-outline"
                label="Abrir chat"
                onPress={handleOpenChat}
                colors={colors}
              />
            </View> */}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
