import { useEffect } from "react";
import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import PrimaryButton from "../../../components/PrimaryButton";
import { useAuth } from "../../../src/auth/AuthContext";
import { useTheme } from "../../../styles/theme";

export default function SettingsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  return (
    <View style={theme.screen}>
      <View style={theme.card}>
        <Text style={theme.heading}>Settings</Text>
        <Text style={theme.subheading}>Manage your profile and preferences.</Text>
        <PrimaryButton
          title="Profile"
          onPress={() => router.push("/settings/profile")}
        />
        <PrimaryButton title="Log out" onPress={signOut} />
      </View>
    </View>
  );
}
