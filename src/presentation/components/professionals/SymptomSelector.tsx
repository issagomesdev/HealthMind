import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { Symptom } from "../../../core/types";
import { useTheme } from "../../../core/theme";

interface SymptomConfig {
  value: Symptom;
  label: string;
}

const SYMPTOMS: SymptomConfig[] = [
  { value: "ansiedade",           label: "Ansiedade"            },
  { value: "estresse",            label: "Estresse"             },
  { value: "insonia",             label: "Insônia"              },
  { value: "autoestima",          label: "Baixa autoestima"     },
  { value: "relacionamentos",     label: "Relacionamentos"      },
  { value: "dependencia_emocional",label: "Dependência emocional"},
  { value: "burnout",             label: "Burnout"              },
  { value: "tristeza_constante",  label: "Tristeza constante"   },
  { value: "crises_ansiedade",    label: "Crises de ansiedade"  },
  { value: "falta_motivacao",     label: "Falta de motivação"   },
  { value: "organizacao_emocional",label: "Organização emocional"},
  { value: "controle_emocional",  label: "Controle emocional"   },
  { value: "pressao_trabalho",    label: "Pressão no trabalho"  },
  { value: "pressao_academica",   label: "Pressão acadêmica"    },
  { value: "procrastinacao",      label: "Procrastinação"       },
  { value: "luto",                label: "Luto"                 },
  { value: "autoconhecimento",    label: "Autoconhecimento"     },
  { value: "autoaceitacao",       label: "Autoaceitação"        },
  { value: "inseguranca",         label: "Insegurança"          },
  { value: "medos_sociais",       label: "Medos sociais"        },
  { value: "dificuldade_foco",    label: "Dificuldade de foco"  },
  { value: "sono",                label: "Sono desregulado"     },
  { value: "exaustao_mental",     label: "Exaustão mental"      },
  { value: "compulsao_alimentar", label: "Compulsão alimentar"  },
  { value: "isolamento_social",   label: "Isolamento social"    },
  { value: "desenvolvimento_pessoal",label: "Desenvolvimento pessoal"},
  { value: "inteligencia_emocional",label: "Inteligência emocional"},
  { value: "conflitos_familiares",label: "Conflitos familiares" },
  { value: "saude_emocional",     label: "Saúde emocional"      },
  { value: "rotina_saudavel",     label: "Rotina saudável"      },
];

interface SymptomSelectorProps {
  selected: Symptom[];
  onToggle: (symptom: Symptom) => void;
}

export function SymptomSelector({ selected, onToggle }: SymptomSelectorProps) {
  const { colors } = useTheme();

  return (
    <View className="flex-row flex-wrap gap-2">
      {SYMPTOMS.map(({ value, label }) => {
        const isSelected = selected.includes(value);
        return (
          <TouchableOpacity
            key={value}
            onPress={() => onToggle(value)}
            activeOpacity={0.75}
          >
            <View
              className={`flex-row items-center gap-1.5 px-3.5 py-2 rounded-full border-2 ${
                isSelected
                  ? "border-secondary dark:border-secondary-dark bg-secondary/10 dark:bg-secondary-dark/15"
                  : "border-border dark:border-border-dark bg-surface dark:bg-surface-dark"
              }`}
            >
              {isSelected && (
                <Ionicons name="checkmark" size={12} color={colors.secondary} />
              )}
              <AppText
                variant="small"
                color={isSelected ? "secondary" : "muted"}
                className={isSelected ? "font-semibold" : ""}
              >
                {label}
              </AppText>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
