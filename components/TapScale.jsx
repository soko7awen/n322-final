import { useRef } from "react";
import { Animated, Pressable } from "react-native";

// Simple reusable tap animation: scales down on press, back up on release.
export default function TapScale({ onPress, disabled, style, children }) {
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
      disabled={disabled}
      onPressIn={() => !disabled && animateTo(0.94)}
      onPressOut={() => !disabled && animateTo(1)}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
