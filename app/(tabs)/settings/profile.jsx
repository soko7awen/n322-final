import { useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { updateProfile } from "firebase/auth";
import PrimaryButton from "../../../components/PrimaryButton";
import StatusMessage from "../../../components/StatusMessage";
import { useAuth } from "../../../src/auth/AuthContext";
import { usePalette, useTheme } from "../../../styles/theme";

export default function ProfileScreen() {
  const theme = useTheme();
  const palette = usePalette();
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    setDisplayName(user?.displayName || "");
  }, [user]);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(""), 2000);
    return () => clearTimeout(t);
  }, [message]);

  const onSave = async () => {
    if (!user || saving) return;
    if (!displayName.trim()) {
      setError("Add a name before saving.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      await updateProfile(user, { displayName: displayName.trim() });
      setMessage("Display name saved");
    } catch (e) {
      setError(e.message || "Could not save name.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={theme.screen}>
      <View style={theme.card}>
        <Text style={theme.heading}>Profile</Text>
        <Text style={theme.subheading}>Signed in as {user?.email || "unknown"}.</Text>
        <TextInput
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="Display name"
          placeholderTextColor={palette.muted}
          style={theme.input}
          autoCapitalize="words"
        />
        {!!error && <StatusMessage message={error} type="error" />}
        {!!message && <StatusMessage message={message} type="success" />}
        <PrimaryButton
          title={saving ? "Saving..." : "Save name"}
          onPress={onSave}
          loading={saving}
        />
        <PrimaryButton title="Log out" onPress={signOut} />
      </View>
    </View>
  );
}
