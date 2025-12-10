import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import ThemeToggleButton from "../../../components/ThemeToggleButton";
import { usePalette } from "../../../styles/theme";

export default function SettingsStack() {
  const palette = usePalette();
  const router = useRouter();

  const headerLeft = ({ tintColor }) => (
    <TouchableOpacity
      onPress={() => router.replace("/settings")}
      style={{ paddingHorizontal: 6, paddingVertical: 4 }}
      accessibilityRole="button"
      accessibilityLabel="Back"
    >
      <Ionicons
        name="arrow-back"
        size={20}
        color={tintColor || palette.text}
      />
    </TouchableOpacity>
  );

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: palette.background, height: 48 },
        headerTintColor: palette.text,
        headerTitleStyle: {
          fontSize: 18,
          paddingBottom: 6,
          fontFamily: "LexendZetta_400Regular",
        },
        headerTitleContainerStyle: { justifyContent: "flex-end" },
        headerRightContainerStyle: { alignItems: "flex-end", paddingBottom: 6 },
        headerShadowVisible: false,
        headerRight: () => (
          <ThemeToggleButton style={{ paddingRight: 8, marginRight: 12 }} />
        ),
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: "Settings", headerLeft: () => null }}
      />
      <Stack.Screen
        name="profile"
        options={{ title: "Profile", headerLeft }}
      />
    </Stack>
  );
}
