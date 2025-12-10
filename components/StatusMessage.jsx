import { View, Text } from "react-native";
import { usePalette } from "../styles/theme";

// Lightweight inline banner for success/info/error messages.
export default function StatusMessage({ message, type = "info" }) {
  const palette = usePalette();
  if (!message) return null;

  const colorMap = {
    success: palette.accent,
    error: palette.danger,
    info: palette.muted,
  };
  const tone = colorMap[type] || palette.muted;

  return (
    <View
      style={{
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 12,
        backgroundColor: `${tone}1a`,
        borderWidth: 1,
        borderColor: `${tone}33`,
      }}
    >
      <Text style={{ color: tone, fontWeight: "700" }}>{message}</Text>
    </View>
  );
}
