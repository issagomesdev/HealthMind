import React, { useEffect } from "react";
import { View, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AppText } from "../../components/ui/AppText";
import { useTheme } from "../../../core/theme";

interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const { isDark } = useTheme();

  useEffect(() => {
    const t = setTimeout(onFinish, 2200);
    return () => clearTimeout(t);
  }, [onFinish]);

  return (
    <LinearGradient
      colors={isDark ? ["#0F172A", "#1B263B"] : ["#E8F7F5", "#F2F4F7"]}
      className="flex-1 items-center justify-center px-8"
    >
      <View className="items-center gap-4">
        <View className="w-[300px] h-[300px] rounded-full bg-white dark:bg-secondary-dark items-center justify-center mb-2">
          <Image
            source={require("../../../assets/images/logo.png")}
            className="w-[250px] h-[250px]"
            resizeMode="contain"
          />
        </View>
      </View>

      <View className="absolute bottom-14 flex-row gap-2 items-center">
        <View className="h-2 w-6 rounded-full bg-secondary dark:bg-secondary-dark" />
        <View className="h-2 w-2 rounded-full bg-muted dark:bg-muted-dark" />
        <View className="h-2 w-2 rounded-full bg-muted dark:bg-muted-dark" />
      </View>
    </LinearGradient>
  );
}
