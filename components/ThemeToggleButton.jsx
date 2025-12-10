import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { usePalette, useThemeToggle } from "../styles/theme";

export default function ThemeToggleButton({ style }) {
  const palette = usePalette();
  const toggle = useThemeToggle();
  const isDark = palette.background === "#0f172a";

  return (
    <Pressable
      onPress={toggle}
      style={[{ paddingHorizontal: 8 }, style]}
    >
      <Ionicons
        name={isDark ? "sunny" : "moon"}
        color={palette.text}
        size={22}
      />
    </Pressable>
  );
}
