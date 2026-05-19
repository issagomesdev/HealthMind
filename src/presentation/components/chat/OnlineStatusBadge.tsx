import React from "react";
import { View } from "react-native";

interface OnlineStatusBadgeProps {
  isOnline: boolean;
}

const ONLINE_GREEN = "#6DBF7B";

export function OnlineStatusBadge({ isOnline }: OnlineStatusBadgeProps) {
  if (!isOnline) return null;

  return (
    <View
      style={{
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: ONLINE_GREEN,
        borderWidth: 1.5,
        borderColor: "#fff",
      }}
    />
  );
}
