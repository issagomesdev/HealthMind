import React, { useRef, useState } from "react";
import {
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ViewToken,
  Image,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../../../components/ui/AppText";
import { AppButton } from "../../../components/ui/AppButton";
import { useTheme } from "../../../../core/theme";

const { width, height } = Dimensions.get("window");

const IMAGES = [
  require("../../../../assets/images/onboarding/1.png"),
  require("../../../../assets/images/onboarding/2.png"),
  require("../../../../assets/images/onboarding/3.png"),
];

const features = [
  { icon: "pulse-outline" as const, label: "Respiração" },
  { icon: "journal-outline" as const, label: "Diário" },
  { icon: "water-outline" as const, label: "Hidratação" },
  { icon: "body-outline" as const, label: "Autocuidado" },
];

interface SlideData {
  id: string;
  title: string;
  description: string;
  isLast?: boolean;
}

const slides: SlideData[] = [
  {
    id: "1",
    title: "Cuide da sua mente todos os dias",
    description:
      "Acompanhe seu humor, registre sentimentos e receba apoio para sua rotina emocional.",
  },
  {
    id: "2",
    title: "Entenda melhor suas emoções",
    description:
      "Responda perguntas diárias e acompanhe sua evolução emocional ao longo do tempo.",
  },
  {
    id: "3",
    title: "Sugestões para cada momento",
    description:
      "Receba atividades, conteúdos e lembretes de autocuidado de acordo com seu estado emocional.",
    isLast: true,
  },
];

interface OnboardingScreenProps {
  onFinish: () => void;
  onLogin: () => void;
}

export function OnboardingScreen({ onFinish, onLogin }: OnboardingScreenProps) {
  const { isDark } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleViewable = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems[0]) setActiveIndex(viewableItems[0].index ?? 0);
    }
  ).current;

  const goNext = () => {
    if (activeIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
    } else {
      onFinish();
    }
  };

  const goPrev = () => {
    if (activeIndex > 0) {
      flatListRef.current?.scrollToIndex({ index: activeIndex - 1, animated: true });
    }
  };

  const renderSlide = ({ item }: { item: SlideData }) => {
    const idx = parseInt(item.id, 10) - 1;

    if (idx === 0) {
      return (
        <View style={{ width }} className="flex-1 bg-background dark:bg-background-dark">
          <View className="px-7 pt-12 pb-4 flex-row items-center gap-2">
            <View className="w-8 h-8 rounded-full bg-secondary dark:bg-secondary-dark items-center justify-center">
              <Ionicons name="leaf" size={16} color="#fff" />
            </View>
            <AppText variant="bodyMedium" className="font-bold text-primary dark:text-content-dark">
              HealthMind
            </AppText>
          </View>

          <View className="px-5">
            <Image
              source={IMAGES[0]}
              style={{ width: width - 40, height: height * 0.44 }}
              className="rounded-3xl"
              resizeMode="cover"
            />
          </View>

          <View className="px-7 pt-6 gap-2">
            <AppText variant="heading2" className="font-bold text-primary dark:text-content-dark">
              {item.title}
            </AppText>
            <AppText variant="body" color="muted" className="leading-6">
              {item.description}
            </AppText>
          </View>
        </View>
      );
    }

    if (idx === 1) {
      return (
        <View style={{ width }} className="flex-1 bg-background dark:bg-background-dark">

          <ImageBackground
            source={IMAGES[1]}
            style={{ width, height: height * 0.5 }}
            resizeMode="cover"
          >
            <LinearGradient
              colors={["rgba(0,0,0,0.15)", "rgba(0,0,0,0.55)"]}
              className="flex-1 pt-12 px-5 pb-5 justify-between"
            >
              <View className="flex-row items-center gap-2">
                <View className="w-8 h-8 rounded-full items-center justify-center bg-white/25">
                  <Ionicons name="leaf" size={16} color="#fff" />
                </View>
                <AppText variant="bodyMedium" className="font-bold text-white">
                  HealthMind
                </AppText>
              </View>
              <View
                className="absolute bottom-4 left-4 right-4 rounded-2xl p-4 bg-white dark:bg-surface-dark"
                style={{ opacity: 0.95 }}
              >

                <View className="flex-row items-center gap-1.5 mb-3">
                  <Ionicons name="heart" size={14} color="#E74C3C" />
                  <AppText variant="smallMedium" className="font-semibold text-content dark:text-content-dark">
                    HUMOR HOJE
                  </AppText>
                </View>
                <View className="flex-row items-end gap-2 h-11">
                  {[0.4, 0.7, 0.5, 0.9, 0.6].map((h, i) => (
                    <View key={i} className="flex-1 items-center gap-1 justify-end">
                      <View
                        className="w-full rounded"
                        style={{
                          height: h * 40,
                          backgroundColor: i === 3 ? "#2A9D8F" : "#2A9D8F55",
                        }}
                      />
                      <AppText variant="caption" color="muted">
                        {["S", "T", "Q", "Q", "S"][i]}
                      </AppText>
                    </View>
                  ))}
                </View>
              </View>

            </LinearGradient>
          </ImageBackground>



          <View className="px-7 pt-6 gap-2">
            <AppText variant="heading2" className="font-bold text-primary dark:text-content-dark">
              {item.title}
            </AppText>
            <AppText variant="body" color="muted" className="leading-6">
              {item.description}
            </AppText>
          </View>
        </View>
      );
    }

    return (
      <View style={{ width }} className="flex-1 bg-background dark:bg-background-dark">
        <ImageBackground
          source={IMAGES[2]}
          style={{ width, height: height * 0.5 }}
          resizeMode="cover"
        >
          <LinearGradient
            colors={["rgba(0,0,0,0.15)", "rgba(0,0,0,0.55)"]}
            className="flex-1 pt-12 px-5 pb-5 justify-between"
          >
            <View className="flex-row items-center gap-2">
              <View className="w-8 h-8 rounded-full items-center justify-center bg-white/25">
                <Ionicons name="leaf" size={16} color="#fff" />
              </View>
              <AppText variant="bodyMedium" className="font-bold text-white">
                HealthMind
              </AppText>
            </View>

            <View className="flex-row flex-wrap gap-3">
              {features.map((feat) => (
                <View
                  key={feat.label}
                  className="rounded-2xl p-4 items-center gap-2 bg-white/20"
                  style={{ width: (width - 58) / 2 }}
                >
                  <Ionicons name={feat.icon} size={24} color="#fff" />
                  <AppText variant="smallMedium" className="text-white font-semibold">
                    {feat.label}
                  </AppText>
                </View>
              ))}
            </View>
          </LinearGradient>
        </ImageBackground>

        <View className="px-7 pt-5 gap-2">
          <AppText variant="heading2" className="font-bold text-primary dark:text-content-dark">
            {item.title}
          </AppText>
          <AppText variant="body" color="muted" className="leading-6">
            {item.description}
          </AppText>
        </View>
      </View>
    );
  };

  const isLast = activeIndex === slides.length - 1;

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={handleViewable}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        scrollEventThrottle={16}
      />

      <View className="px-7 pb-10 pt-4 gap-4 bg-background dark:bg-background-dark">
        <View className="flex-row justify-center items-center gap-2">
          {slides.map((_, i) => (
            <View
              key={i}
              className={`h-2 rounded-full ${i === activeIndex
                  ? "bg-secondary dark:bg-secondary-dark"
                  : "bg-muted dark:bg-muted-dark"
                }`}
              style={{ width: i === activeIndex ? 24 : 8 }}
            />
          ))}
        </View>

        {isLast ? (
          <View className="gap-3">
            <AppButton label="Criar conta" onPress={onFinish} variant="primary" />
            <TouchableOpacity onPress={onLogin} className="items-center py-2">
              <AppText variant="bodyMedium" color="secondary">
                Entrar
              </AppText>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex-row items-center justify-between">
            {activeIndex > 0 ? (
              <TouchableOpacity
                onPress={goPrev}
                className="flex-row items-center gap-1 w-20"
              >
                <Ionicons
                  name="chevron-back"
                  size={22}
                  color={isDark ? "#9CA3AF" : "#64748B"}
                />
                <AppText variant="bodyMedium" color="muted">
                  Voltar
                </AppText>
              </TouchableOpacity>
            ) : (
              <View className="w-20" />
            )}

            <AppButton
              label={activeIndex === 0 ? "Começar" : "Continuar"}
              onPress={goNext}
              variant="gradient"
              fullWidth={false}
              className="px-7"
            />
          </View>
        )}
      </View>
    </View>
  );
}
