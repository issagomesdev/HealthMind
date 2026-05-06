import React from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { CommunityPost } from "../../../core/types";
import { useTheme } from "../../../core/theme";

interface CommunityPostCardProps {
  post: CommunityPost;
  onLike: (id: string) => void;
  onComment?: (id: string) => void;
  onOptions?: (id: string) => void;
}

function formatTimeAgo(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 3600) return `Há ${Math.round(diff / 60)} minutos`;
  if (diff < 86400) return `Há ${Math.round(diff / 3600)} horas`;
  return `Há ${Math.round(diff / 86400)} dias`;
}

function AvatarCircle({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

  const colors = ["#2A9D8F", "#4C78D9", "#6366F1", "#F59E0B", "#EC4899", "#6DBF7B"];
  const color = colors[name.charCodeAt(0) % colors.length];

  return (
    <View
      className="w-10 h-10 rounded-full items-center justify-center"
      style={{ backgroundColor: color }}
    >
      <AppText variant="caption" className="font-bold text-white">
        {initials}
      </AppText>
    </View>
  );
}

export function CommunityPostCard({
  post,
  onLike,
  onComment,
  onOptions,
}: CommunityPostCardProps) {
  const { colors } = useTheme();

  return (
    <View
      className="bg-surface dark:bg-surface-dark rounded-2xl p-4 gap-3"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 3,
      }}
    >
      {/* Header */}
      <View className="flex-row items-center gap-3">
        <AvatarCircle name={post.user.name} />

        <View className="flex-1">
          <AppText variant="smallMedium" className="font-semibold">
            {post.user.name}
          </AppText>
          <AppText variant="caption" color="muted">
            {formatTimeAgo(post.createdAt)} · Tópico: {post.topic}
          </AppText>
        </View>

        <TouchableOpacity
          onPress={() => onOptions?.(post.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          activeOpacity={0.7}
        >
          <Ionicons name="ellipsis-horizontal" size={18} color={colors.subtle} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <AppText variant="body" className="leading-6">
        {post.content}
      </AppText>

      {/* Image */}
      {post.image && (
        <View className="rounded-xl overflow-hidden">
          <Image
            source={{ uri: post.image }}
            className="w-full h-48"
            resizeMode="cover"
          />
        </View>
      )}

      {/* Actions */}
      <View className="flex-row items-center gap-5 pt-1">
        <TouchableOpacity
          onPress={() => onLike(post.id)}
          activeOpacity={0.7}
          className="flex-row items-center gap-1.5"
        >
          <Ionicons
            name={post.liked ? "heart" : "heart-outline"}
            size={20}
            color={post.liked ? "#EF4444" : colors.subtle}
          />
          <AppText variant="small" color="muted">
            {post.likes}
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onComment?.(post.id)}
          activeOpacity={0.7}
          className="flex-row items-center gap-1.5"
        >
          <Ionicons name="chatbubble-outline" size={18} color={colors.subtle} />
          <AppText variant="small" color="muted">
            {post.comments}
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
}
