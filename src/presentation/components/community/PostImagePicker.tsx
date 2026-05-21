import React from "react";
import { View, TouchableOpacity, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { SuccessModal } from "../ui/SuccessModal";
import { useModal } from "../../../hooks/useModal";
import { useTheme } from "../../../core/theme";

interface PostImagePickerProps {
  value: string | null;
  onChange: (uri: string | null) => void;
}

export function PostImagePicker({ value, onChange }: PostImagePickerProps) {
  const { colors } = useTheme();
  const { show: showModal, modalProps } = useModal();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      showModal({ type: "warning", title: "Permissão necessária", message: "Precisamos de acesso à galeria para adicionar fotos." });
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      onChange(result.assets[0].uri);
    }
  };

  if (value) {
    return (
      <>
        <SuccessModal {...modalProps} />
        <View className="rounded-2xl overflow-hidden">
          <Image source={{ uri: value }} className="w-full h-44" resizeMode="cover" />
          <TouchableOpacity
            onPress={() => onChange(null)}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/55 items-center justify-center"
            activeOpacity={0.8}
          >
            <Ionicons name="close" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </>
    );
  }

  return (
    <>
      <SuccessModal {...modalProps} />
      <TouchableOpacity
        onPress={pickImage}
        activeOpacity={0.75}
        className="flex-row items-center gap-3 border-2 border-dashed border-border dark:border-border-dark rounded-2xl px-4 py-4"
      >
        <View className="w-10 h-10 rounded-full bg-muted dark:bg-muted-dark items-center justify-center">
          <Ionicons name="camera-outline" size={20} color={colors.subtle} />
        </View>
        <View className="gap-0.5">
          <AppText variant="bodyMedium" className="font-medium">
            Adicionar imagem
          </AppText>
          <AppText variant="small" color="muted">
            Opcional — enriqueça sua publicação
          </AppText>
        </View>
      </TouchableOpacity>
    </>
  );
}
