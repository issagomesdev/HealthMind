import React, { useState } from "react";
import { View, TouchableOpacity, LayoutAnimation, Platform, UIManager } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { useTheme } from "../../../core/theme";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface FAQItem {
  title: string;
  content: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

function FAQRow({ item, isLast }: { item: FAQItem; isLast: boolean }) {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(false);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((v) => !v);
  };

  return (
    <View className={!isLast ? "border-b border-border dark:border-border-dark" : ""}>
      <TouchableOpacity
        onPress={toggle}
        activeOpacity={0.7}
        className="flex-row items-center justify-between px-5 py-4 gap-3"
      >
        <AppText variant="bodyMedium" className="font-semibold flex-1 leading-snug">
          {item.title}
        </AppText>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={18}
          color={colors.subtle}
        />
      </TouchableOpacity>

      {expanded && (
        <View className="px-5 pb-4">
          <AppText variant="body" color="muted" className="leading-6">
            {item.content}
          </AppText>
        </View>
      )}
    </View>
  );
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  return (
    <View>
      {items.map((item, i) => (
        <FAQRow key={i} item={item} isLast={i === items.length - 1} />
      ))}
    </View>
  );
}
