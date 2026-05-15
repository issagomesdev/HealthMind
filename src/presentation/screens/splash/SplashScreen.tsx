import React, { useEffect, useRef } from "react";
import { View, Image, Animated, Easing, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AppText } from "../../components/ui/AppText";
import { useTheme } from "../../../core/theme";

const TOTAL_DURATION = 4000;

interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const { isDark } = useTheme();

  // ─── Animated values ──────────────────────────────────────────────────────
  const screenOpacity    = useRef(new Animated.Value(0)).current;

  const glowOpacity      = useRef(new Animated.Value(0)).current;
  const glowScale        = useRef(new Animated.Value(0.65)).current;

  const rippleScale      = useRef(new Animated.Value(0.5)).current;
  const rippleOpacity    = useRef(new Animated.Value(0)).current;

  const logoOpacity      = useRef(new Animated.Value(0)).current;
  const logoScale        = useRef(new Animated.Value(0.78)).current;
  const logoFloat        = useRef(new Animated.Value(0)).current;

  const titleOpacity     = useRef(new Animated.Value(0)).current;
  const titleY           = useRef(new Animated.Value(22)).current;

  const dividerOpacity   = useRef(new Animated.Value(0)).current;
  const dividerWidth     = useRef(new Animated.Value(0)).current;

  const taglineOpacity   = useRef(new Animated.Value(0)).current;
  const taglineY         = useRef(new Animated.Value(14)).current;

  const dotsOpacity      = useRef(new Animated.Value(0)).current;
  const dot1             = useRef(new Animated.Value(0.25)).current;
  const dot2             = useRef(new Animated.Value(0.25)).current;
  const dot3             = useRef(new Animated.Value(0.25)).current;

  useEffect(() => {
    // ── Screen fade in ───────────────────────────────────────────────────────
    Animated.timing(screenOpacity, {
      toValue: 1,
      duration: 750,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    // ── Glow entrance → pulse loop ───────────────────────────────────────────
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(glowOpacity, {
          toValue: 1,
          duration: 1000,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(glowScale, {
          toValue: 1,
          duration: 1200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Glow breathes after entrance
        Animated.loop(
          Animated.sequence([
            Animated.timing(glowScale, {
              toValue: 1.08,
              duration: 3000,
              easing: Easing.inOut(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.timing(glowScale, {
              toValue: 0.95,
              duration: 3000,
              easing: Easing.inOut(Easing.quad),
              useNativeDriver: true,
            }),
          ])
        ).start();

        // Ripple ring: expands outward and fades
        Animated.loop(
          Animated.sequence([
            Animated.parallel([
              Animated.timing(rippleOpacity, {
                toValue: 1,
                duration: 0,
                useNativeDriver: true,
              }),
              Animated.timing(rippleScale, {
                toValue: 0.5,
                duration: 0,
                useNativeDriver: true,
              }),
            ]),
            Animated.parallel([
              Animated.timing(rippleScale, {
                toValue: 1.6,
                duration: 2800,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
              }),
              Animated.timing(rippleOpacity, {
                toValue: 0,
                duration: 2800,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
              }),
            ]),
            Animated.delay(800),
          ])
        ).start();
      });
    }, 80);

    // ── Logo entrance → float loop ───────────────────────────────────────────
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 700,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(logoFloat, {
              toValue: -10,
              duration: 2600,
              easing: Easing.inOut(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.timing(logoFloat, {
              toValue: 0,
              duration: 2600,
              easing: Easing.inOut(Easing.quad),
              useNativeDriver: true,
            }),
          ])
        ).start();
      });
    }, 300);

    // ── Title ────────────────────────────────────────────────────────────────
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 700,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(titleY, {
          toValue: 0,
          duration: 750,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }, 680);

    // ── Divider line ─────────────────────────────────────────────────────────
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(dividerOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(dividerWidth, {
          toValue: 36,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
      ]).start();
    }, 880);

    // ── Tagline ──────────────────────────────────────────────────────────────
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(taglineOpacity, {
          toValue: 1,
          duration: 700,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(taglineY, {
          toValue: 0,
          duration: 750,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }, 1000);

    // ── Loading dots ─────────────────────────────────────────────────────────
    setTimeout(() => {
      Animated.timing(dotsOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();

      const dotWave = (val: Animated.Value, startDelay: number) =>
        Animated.sequence([
          Animated.delay(startDelay),
          Animated.loop(
            Animated.sequence([
              Animated.timing(val, {
                toValue: 1,
                duration: 450,
                easing: Easing.inOut(Easing.quad),
                useNativeDriver: true,
              }),
              Animated.timing(val, {
                toValue: 0.2,
                duration: 450,
                easing: Easing.inOut(Easing.quad),
                useNativeDriver: true,
              }),
              Animated.delay(180),
            ])
          ),
        ]).start();

      dotWave(dot1, 0);
      dotWave(dot2, 220);
      dotWave(dot3, 440);
    }, 1350);

    // ── Finish ───────────────────────────────────────────────────────────────
    const timer = setTimeout(onFinish, TOTAL_DURATION);
    return () => clearTimeout(timer);
  }, [onFinish]);

  // ─── Theme tokens ─────────────────────────────────────────────────────────
  const bgColors = isDark
    ? (["#091520", "#0C1C2C", "#0A1F22"] as const)
    : (["#E6F6F3", "#ECF1F7", "#F4F4F6"] as const);

  const glowBg    = isDark ? "rgba(42,157,143,0.13)" : "rgba(42,157,143,0.10)";
  const rippleBg  = isDark ? "rgba(42,157,143,0.20)" : "rgba(42,157,143,0.15)";
  const titleClr  = isDark ? "#E2F5F2" : "#192F38";
  const tagClr    = isDark ? "#5DAAA0" : "#357D76";
  const divClr    = isDark ? "#2A9D8F" : "#2A9D8F";
  const dotClr    = isDark ? "#2A9D8F" : "#2A9D8F";

  return (
    <Animated.View style={[styles.root, { opacity: screenOpacity }]}>
      <LinearGradient
        colors={bgColors}
        style={styles.fill}
        start={{ x: 0.15, y: 0 }}
        end={{ x: 0.85, y: 1 }}
      >
        {/* Ripple ring */}
        <Animated.View
          style={[
            styles.ripple,
            {
              backgroundColor: rippleBg,
              opacity: rippleOpacity,
              transform: [{ scale: rippleScale }],
            },
          ]}
        />

        {/* Ambient glow */}
        <Animated.View
          style={[
            styles.glow,
            {
              backgroundColor: glowBg,
              opacity: glowOpacity,
              transform: [{ scale: glowScale }],
            },
          ]}
        />

        {/* Center content */}
        <View style={styles.center}>
          {/* Logo */}
          <Animated.View
            style={[
              styles.logoWrap,
              {
                opacity: logoOpacity,
                transform: [{ scale: logoScale }, { translateY: logoFloat }],
              },
            ]}
          >
            <Image
              source={require("../../../../assets/favicon.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>

          {/* Brand name */}
          <Animated.View
            style={[
              styles.titleWrap,
              { opacity: titleOpacity, transform: [{ translateY: titleY }] },
            ]}
          >
            <AppText style={[styles.title, { color: titleClr }]}>
              HealthMind
            </AppText>
          </Animated.View>

          {/* Accent divider */}
          <Animated.View
            style={[
              styles.divider,
              {
                width: dividerWidth,
                opacity: dividerOpacity,
                backgroundColor: divClr,
              },
            ]}
          />

          {/* Tagline */}
          <Animated.View
            style={[
              styles.taglineWrap,
              { opacity: taglineOpacity, transform: [{ translateY: taglineY }] },
            ]}
          >
            <AppText style={[styles.tagline, { color: tagClr }]}>
              Cuidado emocional ao seu alcance
            </AppText>
          </Animated.View>
        </View>

        {/* Dots loader */}
        <Animated.View style={[styles.dotsRow, { opacity: dotsOpacity }]}>
          {[dot1, dot2, dot3].map((anim, i) => (
            <Animated.View
              key={i}
              style={[
                styles.dot,
                { backgroundColor: dotClr, opacity: anim },
              ]}
            />
          ))}
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  fill: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  glow: {
    position: "absolute",
    width: 360,
    height: 360,
    borderRadius: 180,
  },
  ripple: {
    position: "absolute",
    width: 340,
    height: 340,
    borderRadius: 170,
  },
  center: {
    alignItems: "center",
  },
  logoWrap: {
    width: 200,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 400,
    height: 400,
  },
  titleWrap: {
    alignItems: "center",
    marginTop: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    letterSpacing: -0.8,
    lineHeight: 25,
  },
  divider: {
    height: 2,
    borderRadius: 1,
    marginTop: 14,
    marginBottom: 10,
    opacity: 0.55,
  },
  taglineWrap: {
    alignItems: "center",
  },
  tagline: {
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  dotsRow: {
    position: "absolute",
    bottom: 62,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
});
