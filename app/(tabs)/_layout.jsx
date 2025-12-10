import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { usePalette } from "../../styles/theme";
import ThemeToggleButton from "../../components/ThemeToggleButton";

export default function TabsLayout() {
  const palette = usePalette();
  return (
    <Tabs
      sceneContainerStyle={{ backgroundColor: palette.background }}
      screenOptions={{
        tabBarActiveTintColor: palette.accent,
        tabBarInactiveTintColor: palette.muted,
        tabBarStyle: {
          backgroundColor: palette.background,
          borderTopColor: palette.border,
        },
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
        popToTopOnBlur: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="hub"
        options={{
          title: "Hub",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
