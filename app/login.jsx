import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../src/firebase/firebaseConfig";
import { useAuth } from "../src/auth/AuthContext";
import PrimaryButton from "../components/PrimaryButton";
import { usePalette, useTheme } from "../styles/theme";

export default function LoginScreen() {
  const theme = useTheme();
  const palette = usePalette();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && user) {
      router.replace("/");
    }
  }, [loading, user, router]);

  const onSubmit = async () => {
    if (submitting) return;
    setError("");
    if (!email.trim() || !password) {
      setError("Enter your email and password to continue.");
      return;
    }
    try {
      setSubmitting(true);
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (e) {
      setError(e.message || "Could not sign in.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={theme.screen}>
        <View style={theme.card}>
          <Text style={theme.heading}>Welcome back</Text>
          <Text style={theme.subheading}>Sign in to manage your tasks.</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor={palette.muted}
            style={theme.input}
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            returnKeyType="next"
            onSubmitEditing={() => {
              if (password) {
                onSubmit();
              }
            }}
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor={palette.muted}
            style={theme.input}
            secureTextEntry
            textContentType="password"
            returnKeyType="go"
            onSubmitEditing={onSubmit}
          />
          {!!error && <Text style={{ color: palette.danger }}>{error}</Text>}
          <PrimaryButton
            title={submitting ? "Signing in..." : "Login"}
            onPress={onSubmit}
            loading={submitting}
          />
          <Pressable onPress={() => router.push("/register")}>
            <Text style={theme.subheading}>
              Need an account? <Text style={theme.link}>Register</Text>
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
