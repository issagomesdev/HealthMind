import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { AppText } from "../ui/AppText";
import { ContentCategory } from "../../../core/types";

const FILTERS: { label: string; value: ContentCategory }[] = [
  { label: "Todos",           value: "todos"          },
  { label: "Ansiedade",       value: "ansiedade"      },
  { label: "Autoestima",      value: "autoestima"     },
  { label: "Relacionamentos", value: "relacionamentos" },
  { label: "Trabalho",        value: "trabalho"       },
  { label: "Faculdade",       value: "faculdade"      },
  { label: "Família",         value: "família"        },
];

interface ContentFilterChipsProps {
  active: ContentCategory;
  onSelect: (c: ContentCategory) => void;
}

export function ContentFilterChips({ active, onSelect }: ContentFilterChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingHorizontal: 2 }}
    >
      {FILTERS.map(({ label, value }) => {
        const isActive = active === value;
        return (
          <TouchableOpacity
            key={value}
            onPress={() => onSelect(value)}
            activeOpacity={0.75}
            className={`px-4 py-2 rounded-full border ${
              isActive
                ? "bg-secondary dark:bg-secondary-dark border-secondary dark:border-secondary-dark"
                : "bg-surface dark:bg-surface-dark border-border dark:border-border-dark"
            }`}
          >
            <AppText
              variant="small"
              className="font-semibold"
              color={isActive ? "white" : "muted"}
            >
              {label}
            </AppText>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
