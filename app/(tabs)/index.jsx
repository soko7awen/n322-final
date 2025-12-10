import { useEffect, useMemo, useState } from "react";
import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import PrimaryButton from "../../components/PrimaryButton";
import { useAuth } from "../../src/auth/AuthContext";
import { db } from "../../src/firebase/firebaseConfig";
import { usePalette, useTheme } from "../../styles/theme";
import TapScale from "../../components/TapScale";

export default function DashboardScreen() {
  const theme = useTheme();
  const palette = usePalette();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [counts, setCounts] = useState({ notes: 0, tasks: 0, moods: 0 });
  const [loadingTiles, setLoadingTiles] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    const fetchCounts = async () => {
      if (!user) return;
      try {
        const [notesSnap, tasksSnap, moodSnap] = await Promise.all([
          getDocs(
            query(collection(db, "notes"), where("userId", "==", user.uid), limit(20))
          ),
          getDocs(
            query(collection(db, "tasks"), where("userId", "==", user.uid), limit(20))
          ),
          getDocs(
            query(collection(db, "moodEntries"), where("userId", "==", user.uid), limit(20))
          ),
        ]);
        setCounts({
          notes: notesSnap.size,
          tasks: tasksSnap.size,
          moods: moodSnap.size,
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn("Could not load counts", e);
      } finally {
        setLoadingTiles(false);
      }
    };
    fetchCounts();
  }, [user]);

  const name = useMemo(() => {
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split("@")[0];
    return "there";
  }, [user]);

  const tiles = useMemo(
    () => [
      {
        id: "notes",
        title: "Notes",
        count: counts.notes,
        cta: "Open notes",
        route: "/hub/notes",
        accent: "#38bdf8",
      },
      {
        id: "mood",
        title: "Mood journal",
        count: counts.moods,
        cta: "View entries",
        route: "/hub/mood-journal",
        accent: "#a855f7",
      },
      {
        id: "tasks",
        title: "Tasks",
        count: counts.tasks,
        cta: "Go to tasks",
        route: "/hub/tasks",
        accent: "#22c55e",
      },
    ],
    [counts]
  );

  const renderTile = (tile) => (
    <TapScale key={tile.id} onPress={() => router.push(tile.route)}>
      <View
        style={{
          flex: 1,
          backgroundColor: palette.card,
          borderRadius: 16,
          padding: 16,
          gap: 12,
          borderWidth: 1,
          borderColor: palette.border,
        }}
      >
        <Text style={{ color: palette.muted, fontSize: 13, fontWeight: "700" }}>
          {tile.title}
        </Text>
        <Text style={{ color: palette.text, fontSize: 28, fontWeight: "800" }}>
          {loadingTiles ? "—" : tile.count}
        </Text>
        <PrimaryButton title={tile.cta} onPress={() => router.push(tile.route)} />
      </View>
    </TapScale>
  );

  return (
    <View style={theme.screen}>
      <View style={theme.card}>
        <Text style={theme.heading}>Hey, {name} 👋</Text>
        <Text style={theme.subheading}>
          Jump back into your workspace. Your tools are below.
        </Text>
        <PrimaryButton title="Open Hub" onPress={() => router.push("/hub")} />
      </View>

      <View style={{ flexDirection: "row", gap: 12 }}>
        {renderTile(tiles[0])}
        {renderTile(tiles[1])}
      </View>
      <View style={{ flexDirection: "row", gap: 12 }}>
        {renderTile(tiles[2])}
      </View>
    </View>
  );
}
