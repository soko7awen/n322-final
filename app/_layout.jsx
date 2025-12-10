import React, { useEffect } from "react";
import { View } from "react-native";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { LexendZetta_400Regular } from "@expo-google-fonts/lexend-zetta";
import { NotoSans_400Regular } from "@expo-google-fonts/noto-sans";
import * as SplashScreen from "expo-splash-screen";
import { AuthProvider } from "../src/auth/AuthContext";
import { ThemeProvider, usePalette } from "../styles/theme";
import ThemeToggleButton from "../components/ThemeToggleButton";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    LexendZetta_400Regular,
    NotoSans_400Regular,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <AuthProvider>
      <ThemeProvider>
        <AppStack />
      </ThemeProvider>
    </AuthProvider>
  );
}

function AppStack() {
  const palette = usePalette();
  const isDark = palette.background.toLowerCase() === "#0f172a";
  return (
    <View style={{ flex: 1, backgroundColor: palette.background }}>
      <Stack
        screenOptions={{
          headerShown: true,
          headerStyle: { backgroundColor: palette.background, height: 48 },
          contentStyle: { backgroundColor: palette.background },
          headerTintColor: palette.text,
          headerTitleStyle: {
            fontFamily: "LexendZetta_400Regular",
            fontSize: 18,
            paddingBottom: 6,
          },
          headerTitleContainerStyle: { justifyContent: "flex-end" },
          headerRightContainerStyle: { alignItems: "flex-end", paddingBottom: 6 },
          headerBackTitleVisible: false,
          headerShadowVisible: false,
          headerRight: () => (
            <ThemeToggleButton style={{ paddingRight: 8, marginRight: 12 }} />
          ),
          statusBarStyle: isDark ? "light" : "dark",
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: "fade" }} />
        <Stack.Screen name="login" options={{ title: "Login" }} />
        <Stack.Screen name="register" options={{ title: "Register" }} />
      </Stack>
    </View>
  );
}
