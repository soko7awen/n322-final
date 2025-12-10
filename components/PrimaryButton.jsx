import { ActivityIndicator, Animated, Pressable, StyleSheet, Text } from "react-native";
import { useMemo, useRef } from "react";
import { usePalette } from "../styles/theme";

export default function PrimaryButton({ title, onPress, loading = false, disabled = false }) {
  const palette = usePalette();
  const styles = useMemo(() => createStyles(palette), [palette]);
  const isDisabled = disabled || loading;
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (toValue) =>
    Animated.spring(scale, {
      toValue,
      useNativeDriver: true,
      friction: 6,
      tension: 120,
    }).start();

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      onPressIn={() => !isDisabled && animateTo(0.96)}
      onPressOut={() => animateTo(1)}
    >
      {({ pressed }) => (
        <Animated.View
          style={[
            styles.button,
            pressed && styles.pressed,
            isDisabled && styles.disabled,
            { transform: [{ scale }] },
          ]}
        >
          {loading ? (
            <ActivityIndicator color={palette.background} />
          ) : (
            <Text style={styles.text}>{title}</Text>
          )}
        </Animated.View>
      )}
    </Pressable>
  );
}

const createStyles = (palette) =>
  StyleSheet.create({
    button: {
      backgroundColor: palette.accent,
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: palette.accent,
      shadowOpacity: 0.15,
      shadowOffset: { width: 0, height: 6 },
      shadowRadius: 10,
      elevation: 2,
    },
    text: {
      color: palette.background,
      fontWeight: "700",
      fontSize: 16,
    },
    disabled: {
      opacity: 0.6,
    },
    pressed: {
      opacity: 0.92,
    },
  });
