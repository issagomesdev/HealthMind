import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { TopBar } from "../../components/navigation/TopBar";
import { AppText } from "../../components/ui/AppText";
import { useTheme } from "../../../core/theme";
import {
  professionalPlansService,
  ProfessionalPlan,
  ComparisonRow,
  PlanTestimonial,
} from "../../../services/professionalPlansService";

// ─── Plan Card ───────────────────────────────────────────────────────────────

function PlanCard({
  plan,
  isAnnual,
  colors,
}: {
  plan: ProfessionalPlan;
  isAnnual: boolean;
  colors: ReturnType<typeof useTheme>["colors"];
}) {
  const price =
    plan.monthlyPrice === 0
      ? null
      : isAnnual
      ? plan.annualPrice
      : plan.monthlyPrice;

  const buttonBg = plan.isRecommended ? colors.secondary : "transparent";
  const buttonBorder = plan.isRecommended ? colors.secondary : colors.border;
  const buttonText = plan.isRecommended ? "#fff" : colors.content;

  return (
    <View
      style={{
        borderRadius: 20,
        overflow: "hidden",
        borderWidth: plan.isRecommended ? 2 : 1,
        borderColor: plan.isRecommended ? colors.secondary : colors.border,
        backgroundColor: colors.surface,
        shadowColor: plan.isRecommended ? colors.secondary : "#000",
        shadowOffset: { width: 0, height: plan.isRecommended ? 8 : 2 },
        shadowOpacity: plan.isRecommended ? 0.18 : 0.06,
        shadowRadius: plan.isRecommended ? 16 : 8,
        elevation: plan.isRecommended ? 8 : 2,
      }}
    >
      {/* Recomendado banner */}
      {plan.isRecommended && (
        <View
          style={{
            backgroundColor: colors.secondary,
            alignItems: "center",
            paddingVertical: 7,
          }}
        >
          <AppText
            style={{
              fontSize: 11,
              fontWeight: "800",
              color: "#fff",
              letterSpacing: 1.5,
            }}
          >
            RECOMENDADO
          </AppText>
        </View>
      )}

      <View style={{ padding: 22, gap: 18 }}>
        {/* Name + description */}
        <View style={{ gap: 4 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <AppText style={{ fontSize: 20, fontWeight: "800", color: colors.content }}>
              {plan.name}
            </AppText>
            {plan.isCurrent && (
              <View
                style={{
                  backgroundColor: colors.secondary + "18",
                  borderRadius: 99,
                  paddingHorizontal: 10,
                  paddingVertical: 3,
                }}
              >
                <AppText style={{ fontSize: 11, fontWeight: "700", color: colors.secondary }}>
                  Plano atual
                </AppText>
              </View>
            )}
          </View>
          <AppText style={{ fontSize: 13, color: colors.subtle, lineHeight: 18 }}>
            {plan.description}
          </AppText>
        </View>

        {/* Price */}
        <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 4 }}>
          {price === null ? (
            <AppText
              style={{
                fontSize: 36,
                fontWeight: "800",
                color: colors.content,
                lineHeight: 40,
              }}
            >
              R$ 0
            </AppText>
          ) : (
            <>
              <AppText
                style={{
                  fontSize: 36,
                  fontWeight: "800",
                  color: plan.isRecommended ? colors.secondary : colors.content,
                  lineHeight: 40,
                }}
              >
                R$ {price}
              </AppText>
              <AppText
                style={{
                  fontSize: 14,
                  color: colors.subtle,
                  marginBottom: 4,
                }}
              >
                /mês
              </AppText>
            </>
          )}
          {price === null && (
            <AppText style={{ fontSize: 14, color: colors.subtle, marginBottom: 4 }}>
              /mês
            </AppText>
          )}
        </View>

        {/* Features */}
        <View style={{ gap: 10 }}>
          {plan.features.map((f) => (
            <View key={f.label} style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              {f.included ? (
                <Ionicons name="checkmark-circle" size={18} color={colors.secondary} />
              ) : (
                <AppText style={{ width: 18, textAlign: "center", fontSize: 16, color: colors.subtle }}>
                  —
                </AppText>
              )}
              <AppText
                style={{
                  fontSize: 14,
                  color: f.included ? colors.content : colors.subtle,
                }}
              >
                {f.label}
              </AppText>
            </View>
          ))}
        </View>

        {/* Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={{
            backgroundColor: buttonBg,
            borderRadius: 12,
            borderWidth: plan.isRecommended ? 0 : 1.5,
            borderColor: buttonBorder,
            paddingVertical: 14,
            alignItems: "center",
          }}
        >
          <AppText style={{ fontSize: 15, fontWeight: "700", color: buttonText }}>
            {plan.buttonLabel}
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Comparison Table ─────────────────────────────────────────────────────────

function ComparisonTable({
  rows,
  colors,
}: {
  rows: ComparisonRow[];
  colors: ReturnType<typeof useTheme>["colors"];
}) {
  return (
    <View>
      <AppText
        style={{
          fontSize: 20,
          fontWeight: "800",
          color: colors.content,
          marginBottom: 14,
        }}
      >
        Comparação Detalhada
      </AppText>

      <View
        style={{
          borderRadius: 16,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: colors.muted,
          }}
        >
          <AppText style={{ flex: 2, fontSize: 12, fontWeight: "700", color: colors.subtle }}>
            Recursos
          </AppText>
          <AppText style={{ flex: 1, fontSize: 12, fontWeight: "700", color: colors.subtle, textAlign: "center" }}>
            Basic
          </AppText>
          <AppText style={{ flex: 1, fontSize: 12, fontWeight: "700", color: colors.secondary, textAlign: "center" }}>
            Premium
          </AppText>
          <AppText style={{ flex: 1, fontSize: 12, fontWeight: "700", color: colors.subtle, textAlign: "center" }}>
            Cl.
          </AppText>
        </View>

        {/* Rows */}
        {rows.map((row, i) => (
          <View
            key={row.feature}
            style={{
              flexDirection: "row",
              paddingHorizontal: 16,
              paddingVertical: 14,
              borderTopWidth: 1,
              borderTopColor: colors.border,
              backgroundColor: i % 2 === 1 ? colors.muted + "60" : colors.surface,
            }}
          >
            <AppText style={{ flex: 2, fontSize: 13, color: colors.content, lineHeight: 18 }}>
              {row.feature}
            </AppText>
            <AppText style={{ flex: 1, fontSize: 12, color: colors.subtle, textAlign: "center" }}>
              {row.basic}
            </AppText>
            <AppText
              style={{
                flex: 1,
                fontSize: 12,
                color: row.premium === "✓" || row.premium === "Ilimitados" || row.premium === "Inteligente"
                  ? colors.secondary
                  : colors.subtle,
                textAlign: "center",
                fontWeight: "600",
              }}
            >
              {row.premium}
            </AppText>
            <AppText style={{ flex: 1, fontSize: 12, color: colors.subtle, textAlign: "center" }}>
              {row.clinic}
            </AppText>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Testimonial ──────────────────────────────────────────────────────────────

function TestimonialCard({
  testimonial,
  colors,
}: {
  testimonial: PlanTestimonial;
  colors: ReturnType<typeof useTheme>["colors"];
}) {
  const TEAL_DARK = "#1A6B62";

  return (
    <View
      style={{
        borderRadius: 20,
        overflow: "hidden",
        backgroundColor: TEAL_DARK,
        padding: 24,
        gap: 16,
      }}
    >
      {/* Decorative dots */}
      <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: 6, marginBottom: -8 }}>
        {["#2A9D8F", "#3BB89F", "#4DD0B0", "#6DDFC0"].map((c, i) => (
          <View
            key={i}
            style={{
              width: 12 + i * 4,
              height: 12 + i * 4,
              borderRadius: 99,
              backgroundColor: c,
              opacity: 0.6,
            }}
          />
        ))}
      </View>

      {/* Stars */}
      <View style={{ flexDirection: "row", gap: 3 }}>
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Ionicons key={i} name="star" size={16} color="#FFD166" />
        ))}
      </View>

      {/* Quote */}
      <AppText
        style={{
          fontSize: 15,
          fontStyle: "italic",
          color: "rgba(255,255,255,0.92)",
          lineHeight: 24,
        }}
      >
        "{testimonial.text}"
      </AppText>

      {/* Author */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: "rgba(255,255,255,0.2)",
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 2,
            borderColor: "rgba(255,255,255,0.3)",
          }}
        >
          <AppText style={{ fontSize: 16, fontWeight: "700", color: "#fff" }}>
            {testimonial.name.trim().split(" ").map((w) => w[0]).slice(0, 2).join("")}
          </AppText>
        </View>
        <View>
          <AppText style={{ fontSize: 14, fontWeight: "700", color: "#fff" }}>
            {testimonial.name}
          </AppText>
          <AppText style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
            {testimonial.specialty}
          </AppText>
        </View>
      </View>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export function ProfessionalSubscriptionScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [isAnnual, setIsAnnual] = useState(false);
  const [plans, setPlans] = useState<ProfessionalPlan[]>([]);
  const [comparison, setComparison] = useState<ComparisonRow[]>([]);
  const [testimonial, setTestimonial] = useState<PlanTestimonial | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      professionalPlansService.getPlans(),
      professionalPlansService.getComparison(),
      professionalPlansService.getTestimonial(),
    ])
      .then(([p, c, t]) => {
        setPlans(p);
        setComparison(c);
        setTestimonial(t);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <TopBar title="Plano atual" onBackPress={() => router.back()} showNotifications={false} />
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator color={colors.secondary} />
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <TopBar title="Plano atual" onBackPress={() => router.back()} showNotifications={false} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 40, gap: 24 }}
      >
        {/* Hero */}
        <View style={{ alignItems: "center", gap: 10 }}>
          <AppText
            style={{
              fontSize: 28,
              fontWeight: "800",
              color: colors.content,
              textAlign: "center",
            }}
          >
            Escolha seu Plano
          </AppText>
          <AppText
            style={{
              fontSize: 14,
              color: colors.subtle,
              textAlign: "center",
              lineHeight: 22,
            }}
          >
            Soluções empáticas e precisas para impulsionar sua prática clínica.
            Escolha o nível de suporte ideal para você e seus pacientes.
          </AppText>
        </View>

        {/* Toggle Mensal / Anual */}
        <View style={{ alignItems: "center" }}>
          <View
            style={{
              flexDirection: "row",
              backgroundColor: colors.muted,
              borderRadius: 99,
              padding: 4,
            }}
          >
            <TouchableOpacity
              onPress={() => setIsAnnual(false)}
              activeOpacity={0.8}
              style={{
                paddingHorizontal: 20,
                paddingVertical: 9,
                borderRadius: 99,
                backgroundColor: !isAnnual ? colors.surface : "transparent",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: !isAnnual ? 0.08 : 0,
                shadowRadius: 4,
                elevation: !isAnnual ? 2 : 0,
              }}
            >
              <AppText
                style={{
                  fontSize: 14,
                  fontWeight: !isAnnual ? "700" : "500",
                  color: !isAnnual ? colors.content : colors.subtle,
                }}
              >
                Mensal
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setIsAnnual(true)}
              activeOpacity={0.8}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                paddingHorizontal: 20,
                paddingVertical: 9,
                borderRadius: 99,
                backgroundColor: isAnnual ? colors.surface : "transparent",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: isAnnual ? 0.08 : 0,
                shadowRadius: 4,
                elevation: isAnnual ? 2 : 0,
              }}
            >
              <AppText
                style={{
                  fontSize: 14,
                  fontWeight: isAnnual ? "700" : "500",
                  color: isAnnual ? colors.content : colors.subtle,
                }}
              >
                Anual
              </AppText>
              <View
                style={{
                  backgroundColor: colors.secondary + "25",
                  borderRadius: 99,
                  paddingHorizontal: 7,
                  paddingVertical: 2,
                }}
              >
                <AppText style={{ fontSize: 10, fontWeight: "800", color: colors.secondary }}>
                  -20%
                </AppText>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Plan cards */}
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} isAnnual={isAnnual} colors={colors} />
        ))}

        {/* Comparison table */}
        {comparison.length > 0 && (
          <ComparisonTable rows={comparison} colors={colors} />
        )}

        {/* Testimonial */}
        {testimonial && (
          <TestimonialCard testimonial={testimonial} colors={colors} />
        )}

        {/* Footer note */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <Ionicons name="lock-closed-outline" size={13} color={colors.subtle} />
          <AppText style={{ fontSize: 12, color: colors.subtle, textAlign: "center" }}>
            Pagamento seguro. Cancele a qualquer momento.
          </AppText>
        </View>
      </ScrollView>
    </View>
  );
}
