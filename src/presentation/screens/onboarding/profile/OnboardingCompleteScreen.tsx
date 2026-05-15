import React, { useEffect, useRef } from "react";
import {
  View,
  Image,
  StatusBar,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../../../components/ui/AppText";
import { AppButton } from "../../../components/ui/AppButton";

interface OnboardingCompleteScreenProps {
  onStart: () => void;
}

const { width, height } = Dimensions.get("window");

// ─── Loading screen content ───────────────────────────────────────────────────

const SCREENS = [
  {
    image: require("../../../../assets/images/loading/1.png"),
    title: "Personalizando sua experiência",
    subtitle: "Estamos preparando tudo com base no seu perfil.",
    glowColor: "rgba(42, 157, 143, 0.25)",
    animation: "float" as const,
  },
  {
    image: require("../../../../assets/images/loading/2.png"),
    title: "Configurando seu espaço",
    subtitle: "Seu ambiente de cuidado está sendo criado.",
    glowColor: "rgba(76, 120, 217, 0.25)",
    animation: "pulse" as const,
  },
  {
    image: require("../../../../assets/images/loading/3.png"),
    title: "Quase lá...",
    subtitle: "Últimos ajustes para sua jornada começar.",
    glowColor: "rgba(138, 92, 246, 0.25)",
    animation: "glow" as const,
  },
];

// ─── Animated image with float ────────────────────────────────────────────────

function FloatingImage({ source }: { source: number }) {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(withTiming(-18, { duration: 1400, easing: Easing.inOut(Easing.sin) }), -1, true);
  }, []);

  const style = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.value }] }));

  return (
    <Animated.View style={style}>
      <Image source={source} style={{ width: 250, height: 250, borderRadius: 125 }} resizeMode="contain" />
    </Animated.View>
  );
}

function PulsingImage({ source }: { source: number }) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(withTiming(1.1, { duration: 900, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, []);

  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={style}>
      <Image source={source} style={{ width: 250, height: 250, borderRadius: 125 }} resizeMode="contain" />
    </Animated.View>
  );
}

function GlowingImage({ source }: { source: number }) {
  const opacity = useSharedValue(0.7);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, []);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View style={style}>
      <Image source={source} style={{ width: 250, height: 250, borderRadius: 125 }} resizeMode="contain" />
    </Animated.View>
  );
}

// ─── Glow circle ─────────────────────────────────────────────────────────────

function GlowCircle({ color, size = 280 }: { color: string; size?: number }) {
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, []);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          alignSelf: "center",
        },
        style,
      ]}
    />
  );
}

// ─── Particle dots ────────────────────────────────────────────────────────────

function Particle({ x, y, delay, size }: { x: number; y: number; delay: number; size: number }) {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.6, { duration: 1200 }),
          withTiming(0, { duration: 1200 })
        ),
        -1,
        false
      )
    );
  }, []);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          left: x,
          top: y,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: "rgba(42, 157, 143, 0.7)",
        },
        style,
      ]}
    />
  );
}

const PARTICLES = [
  { x: width * 0.15, y: height * 0.2, delay: 0, size: 6 },
  { x: width * 0.82, y: height * 0.18, delay: 400, size: 4 },
  { x: width * 0.08, y: height * 0.55, delay: 800, size: 5 },
  { x: width * 0.88, y: height * 0.6, delay: 200, size: 3 },
  { x: width * 0.25, y: height * 0.75, delay: 600, size: 4 },
  { x: width * 0.72, y: height * 0.78, delay: 1000, size: 6 },
];

// ─── Progress dots ────────────────────────────────────────────────────────────

function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={{
            width: i === current ? 20 : 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: i === current ? "#2A9D8F" : "rgba(255,255,255,0.25)",
          }}
        />
      ))}
    </View>
  );
}

// ─── Final heart screen ───────────────────────────────────────────────────────

function HeartIcon() {
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.3);

  useEffect(() => {
    scale.value = withRepeat(withTiming(1.12, { duration: 900, easing: Easing.inOut(Easing.ease) }), -1, true);
    glowOpacity.value = withRepeat(withTiming(0.65, { duration: 900, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, []);

  const iconStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const glowStyle = useAnimatedStyle(() => ({ opacity: glowOpacity.value }));

  return (
    <View style={{ alignItems: "center", justifyContent: "center", width: 180, height: 180 }}>
      {/* Outer glow */}
      <Animated.View
        style={[
          {
            position: "absolute",
            width: 180,
            height: 180,
            borderRadius: 90,
            backgroundColor: "rgba(42, 157, 143, 0.18)",
          },
          glowStyle,
        ]}
      />
      {/* Inner glow */}
      <Animated.View
        style={[
          {
            position: "absolute",
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: "rgba(42, 157, 143, 0.25)",
          },
          glowStyle,
        ]}
      />
      <Animated.View style={iconStyle}>
        <Ionicons name="heart" size={80} color="#2A9D8F" />
      </Animated.View>
    </View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────

export function OnboardingCompleteScreen({ onStart }: OnboardingCompleteScreenProps) {
  const insets = useSafeAreaInsets();
  const currentScreen = useRef(0);
  const [screenIndex, setScreenIndex] = React.useState(0);
  const isFinalRef = useRef(false);

  useEffect(() => {
    if (screenIndex >= SCREENS.length) {
      isFinalRef.current = true;
      return;
    } 
    const timer = setTimeout(() => {
      setScreenIndex((prev) => prev + 1);
    }, 2000);
    return () => clearTimeout(timer);
  }, [screenIndex]);

  const isFinal = screenIndex >= SCREENS.length;
  const screen = isFinal ? null : SCREENS[screenIndex];

  return (
    <View style={{ flex: 1, backgroundColor: "#050D1A" }}>
      <StatusBar barStyle="light-content" backgroundColor="#050D1A" />
      <LinearGradient
        colors={["#050D1A", "#0A1628", "#0D2137"]}
        style={{ flex: 1 }}
      >
        {/* Particles */}
        {PARTICLES.map((p, i) => (
          <Particle key={i} {...p} />
        ))}

        {isFinal ? (
          // ── Final screen ──
          <Animated.View
            entering={FadeIn.duration(600)}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 32,
              paddingTop: insets.top,
              paddingBottom: insets.bottom + 32,
              gap: 32,
            }}
          >
            {/* Background glow */}
            <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, alignItems: "center", justifyContent: "center" }}>
              <View
                style={{
                  width: 320,
                  height: 320,
                  borderRadius: 160,
                  backgroundColor: "rgba(42, 157, 143, 0.08)",
                }}
              />
            </View>

            <HeartIcon />

            <View style={{ alignItems: "center", gap: 12 }}>
              <AppText
                variant="heading1"
                color="white"
                className="text-center font-bold"
              >
                Tudo pronto!
              </AppText>
              <AppText
                variant="body"
                className="text-center"
                style={{ color: "rgba(255,255,255,0.65)", lineHeight: 26 }}
              >
                Sua jornada de cuidado começa agora. Estamos aqui com você em cada passo.
              </AppText>
            </View>

            <TouchableOpacity
              onPress={onStart}
              activeOpacity={0.85}
              style={{
                width: "100%",
                height: 56,
                borderRadius: 28,
                backgroundColor: "#2A9D8F",
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#2A9D8F",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.4,
                shadowRadius: 16,
                elevation: 8,
              }}
            >
              <AppText variant="bodyMedium" color="white" style={{ fontWeight: "700", fontSize: 17 }}>
                Começar
              </AppText>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          // ── Loading screens ──
          screen && (
            <Animated.View
              key={screenIndex}
              entering={FadeIn.duration(500)}
              exiting={FadeOut.duration(300)}
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 32,
                paddingTop: insets.top,
                paddingBottom: insets.bottom + 48,
                gap: 40,
              }}
            >
              {/* Image area with glow */}
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <GlowCircle color={screen.glowColor} />
                {screen.animation === "float" && <FloatingImage source={screen.image} />}
                {screen.animation === "pulse" && <PulsingImage source={screen.image} />}
                {screen.animation === "glow" && <GlowingImage source={screen.image} />}
              </View>

              {/* Text */}
              <View style={{ alignItems: "center", gap: 10 }}>
                <AppText
                  variant="heading3"
                  color="white"
                  className="text-center font-bold"
                >
                  {screen.title}
                </AppText>
                <AppText
                  variant="body"
                  className="text-center"
                  style={{ color: "rgba(255,255,255,0.6)" }}
                >
                  {screen.subtitle}
                </AppText>
              </View>

              {/* Progress dots */}
              <ProgressDots current={screenIndex} total={SCREENS.length} />
            </Animated.View>
          )
        )}
      </LinearGradient>
    </View>
  );
}
