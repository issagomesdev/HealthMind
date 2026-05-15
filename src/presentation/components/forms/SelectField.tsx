import React, { useState } from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  FlatList,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { useTheme } from "../../../core/theme";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  value: string | null;
  onChange: (value: string) => void;
  icon?: keyof typeof Ionicons.glyphMap;
}

export function SelectField({
  label,
  placeholder,
  options,
  value,
  onChange,
  icon,
}: SelectFieldProps) {
  const [open, setOpen] = useState(false);
  const { colors } = useTheme();
  const selected = value ? options.find((o) => o.value === value) : null;

  return (
    <>
      <View className="gap-1.5">
        {label && (
          <AppText variant="label" color="muted" className="uppercase tracking-[0.8px]">
            {label}
          </AppText>
        )}
        <TouchableOpacity
          onPress={() => setOpen(true)}
          activeOpacity={0.8}
          className="flex-row items-center rounded-xl border min-h-[52px] px-3.5 bg-surface dark:bg-surface-dark border-border dark:border-border-dark"
        >
          {icon && (
            <Ionicons
              name={icon}
              size={20}
              color={colors.subtle}
              style={{ marginRight: 10 }}
            />
          )}
          <AppText
            variant="body"
            className="flex-1"
            color={selected ? "default" : "muted"}
          >
            {selected ? selected.label : (placeholder ?? "Selecione...")}
          </AppText>
          <Ionicons name="chevron-down" size={18} color={colors.subtle} />
        </TouchableOpacity>
      </View>

      <Modal
        visible={open}
        transparent
        animationType="slide"
        onRequestClose={() => setOpen(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setOpen(false)}
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }}
        >
          <TouchableOpacity activeOpacity={1} onPress={() => {}}>
            <View
              style={{
                backgroundColor: colors.surface,
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                paddingBottom: Platform.OS === "ios" ? 34 : 20,
              }}
            >
              {/* Drag handle */}
              <View style={{ alignItems: "center", paddingTop: 12, paddingBottom: 8 }}>
                <View
                  style={{
                    width: 40,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: colors.border,
                  }}
                />
              </View>

              {/* Header */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingHorizontal: 20,
                  paddingBottom: 12,
                }}
              >
                <AppText variant="heading3" className="font-semibold">
                  {label ?? "Selecionar"}
                </AppText>
                <TouchableOpacity
                  onPress={() => setOpen(false)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="close" size={22} color={colors.subtle} />
                </TouchableOpacity>
              </View>

              {/* Options list */}
              <FlatList
                data={options}
                keyExtractor={(item) => item.value}
                style={{ maxHeight: 380 }}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      onChange(item.value);
                      setOpen(false);
                    }}
                    activeOpacity={0.7}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingHorizontal: 20,
                      paddingVertical: 14,
                      borderBottomWidth: 1,
                      borderBottomColor: colors.border + "40",
                    }}
                  >
                    <AppText variant="body" className="flex-1">
                      {item.label}
                    </AppText>
                    {value === item.value && (
                      <Ionicons name="checkmark" size={20} color={colors.secondary} />
                    )}
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}
