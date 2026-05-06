import React, { useState } from "react";
import { View, TouchableOpacity, Modal, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { useTheme } from "../../../core/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TOPICS = [
  "Ansiedade",
  "Sono",
  "Autoestima",
  "Relacionamentos",
  "Trabalho",
  "Faculdade",
  "Família",
  "Produtividade",
  "Autocuidado",
];

interface TopicSelectorProps {
  value: string;
  onChange: (topic: string) => void;
}

export function TopicSelector({ value, onChange }: TopicSelectorProps) {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);

  const select = (topic: string) => {
    onChange(topic);
    setOpen(false);
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        activeOpacity={0.8}
        className="flex-row items-center justify-between bg-surface dark:bg-surface-dark rounded-2xl px-4 py-3.5"
        style={{
          borderWidth: 1.5,
          borderColor: value ? colors.secondary : (isDark ? colors.border : "#E5E7EB"),
        }}
      >
        <AppText
          variant="body"
          color={value ? "default" : "muted"}
        >
          {value || "Selecione um tópico..."}
        </AppText>
        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={18}
          color={colors.subtle}
        />
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/40 justify-end"
          activeOpacity={1}
          onPress={() => setOpen(false)}
        >
          <View
            className="bg-surface dark:bg-surface-dark rounded-t-3xl"
            style={{ paddingBottom: insets.bottom + 16 }}
          >
            <View className="w-10 h-1 bg-border dark:bg-border-dark rounded-full self-center mt-3 mb-4" />
            <AppText variant="bodyMedium" className="font-semibold px-5 pb-3">
              Escolha o tópico
            </AppText>
            <FlatList
              data={TOPICS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => {
                const isSelected = value === item;
                return (
                  <TouchableOpacity
                    onPress={() => select(item)}
                    activeOpacity={0.7}
                    className="flex-row items-center justify-between px-5 py-3.5"
                  >
                    <AppText
                      variant="body"
                      color={isSelected ? "secondary" : "default"}
                      className={isSelected ? "font-semibold" : ""}
                    >
                      {item}
                    </AppText>
                    {isSelected && (
                      <Ionicons name="checkmark" size={18} color={colors.secondary} />
                    )}
                  </TouchableOpacity>
                );
              }}
              ItemSeparatorComponent={() => (
                <View className="h-px bg-border dark:bg-border-dark mx-5" />
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}
