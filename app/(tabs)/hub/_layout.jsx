import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import ThemeToggleButton from "../../../components/ThemeToggleButton";
import { usePalette } from "../../../styles/theme";

export default function HubStack() {
  const palette = usePalette();
  const router = useRouter();

  const headerLeft = ({ tintColor }) => (
    <TouchableOpacity
      onPress={() => router.back()}
      style={{ paddingHorizontal: 8, paddingVertical: 6 }}
      accessibilityRole="button"
      accessibilityLabel="Back"
    >
      <Ionicons
        name="arrow-back"
        size={24}
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
        contentStyle: { backgroundColor: palette.background },
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
        options={{
          title: "Hub",
          // Ensure no back arrow on the root
          headerLeft: () => null,
        }}
      />
      <Stack.Screen
        name="tasks"
        options={{
          title: "Tasks",
          headerLeft,
        }}
      />
      <Stack.Screen
        name="item-form"
        options={{
          title: "Add / Edit Task",
          headerLeft,
        }}
      />
      <Stack.Screen
        name="notes"
        options={{
          title: "Notes",
          headerLeft,
        }}
      />
      <Stack.Screen
        name="mood-journal"
        options={{
          title: "Mood Journal",
          headerLeft,
        }}
      />
    </Stack>
  );
}
