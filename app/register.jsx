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
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../src/firebase/firebaseConfig";
import { useAuth } from "../src/auth/AuthContext";
import PrimaryButton from "../components/PrimaryButton";
import { usePalette, useTheme } from "../styles/theme";

export default function RegisterScreen() {
  const theme = useTheme();
  const palette = usePalette();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [displayName, setDisplayName] = useState("");
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
    if (!email.trim() || !password.trim()) {
      setError("Add an email and password to create your account.");
      return;
    }
    try {
      setSubmitting(true);
      const cred = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      if (displayName.trim()) {
        await updateProfile(cred.user, { displayName: displayName.trim() });
      }
    } catch (e) {
      setError(e.message || "Could not register.");
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
          <Text style={theme.heading}>Create account</Text>
          <Text style={theme.subheading}>
            Register to start saving your own tasks.
          </Text>
          <TextInput
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Display name"
            placeholderTextColor={palette.muted}
            style={theme.input}
            textContentType="name"
            returnKeyType="next"
          />
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
            textContentType="newPassword"
            returnKeyType="go"
            onSubmitEditing={onSubmit}
          />
          {!!error && <Text style={{ color: palette.danger }}>{error}</Text>}
          <PrimaryButton
            title={submitting ? "Creating..." : "Register"}
            onPress={onSubmit}
            loading={submitting}
          />
          <Pressable onPress={() => router.push("/login")}>
            <Text style={theme.subheading}>
              Already have an account? <Text style={theme.link}>Log in</Text>
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
