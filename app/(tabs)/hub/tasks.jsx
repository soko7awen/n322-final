import { useEffect, useMemo, useState } from "react";
import { Alert, FlatList, Platform, Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useAuth } from "../../../src/auth/AuthContext";
import { db } from "../../../src/firebase/firebaseConfig";
import PrimaryButton from "../../../components/PrimaryButton";
import StatusMessage from "../../../components/StatusMessage";
import TapScale from "../../../components/TapScale";
import { usePalette, useTheme } from "../../../styles/theme";

export default function TaskListScreen() {
  const theme = useTheme();
  const router = useRouter();
  const palette = usePalette();
  const { user, loading, signOut } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loadingTasks, setLoadingTasks] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    const tasksQuery = query(
      collection(db, "tasks"),
      where("userId", "==", user.uid),
      orderBy("updatedAt", "desc")
    );
    const unsubscribe = onSnapshot(
      tasksQuery,
      (snap) => {
        const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setTasks(rows);
        setError("");
        setLoadingTasks(false);
      },
      (err) => {
        setError(err.message || "Could not load tasks.");
        setTasks([]);
        setLoadingTasks(false);
      }
    );
    return unsubscribe;
  }, [user]);

  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => setSuccess(""), 2600);
    return () => clearTimeout(timer);
  }, [success]);

  const handleDelete = async (taskId) => {
    const doDelete = async () => {
      try {
        await deleteDoc(doc(db, "tasks", taskId));
        setSuccess("Task deleted");
      } catch (e) {
        setError(e.message || "Could not delete task.");
      }
    };

    if (Platform.OS === "web") {
      if (typeof window !== "undefined" && window.confirm("Delete this task permanently?")) {
        doDelete();
      }
      return;
    }

    Alert.alert("Delete task", "Remove this task permanently?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: doDelete },
    ]);
  };

    const header = useMemo(
    () => (
      <View style={{ gap: 12, marginBottom: 12 }}>
        <Text style={theme.heading}>Your tasks</Text>
        <Text style={theme.subheading}>
          Create tasks, edit them, and remove what you no longer need.
        </Text>
        {!!success && <StatusMessage message={success} type="success" />}
        {!!error && <StatusMessage message={error} type="error" />}
        <PrimaryButton
          title="Add task"
          onPress={() => router.push("/hub/item-form")}
        />
        <Pressable onPress={signOut}>
          <Text style={[theme.subheading, theme.link]}>Log out</Text>
        </Pressable>
        {loadingTasks && (
          <Text style={theme.subheading}>Loading your tasks...</Text>
        )}
      </View>
    ),
    [error, loadingTasks, router, signOut, success, theme]
  );

  const renderItem = ({ item }) => (
    <View style={theme.card}>
      <Text style={theme.heading}>{item.title}</Text>
      <Text style={theme.subheading}>{item.details || "No details yet."}</Text>
      <View style={{ flexDirection: "row", gap: 12 }}>
        <PrimaryButton
          title="Edit"
          onPress={() =>
            router.push({ pathname: "/hub/item-form", params: { id: item.id } })
          }
        />
        <TapScale onPress={() => handleDelete(item.id)}>
          <View
            style={{
              paddingVertical: 10,
              paddingHorizontal: 14,
              borderRadius: 12,
              backgroundColor: `${palette.danger}15`,
              borderWidth: 1,
              borderColor: `${palette.danger}33`,
            }}
          >
            <Text style={{ color: palette.danger, fontWeight: "700" }}>
              Delete
            </Text>
          </View>
        </TapScale>
      </View>
    </View>
  );

  return (
    <View style={theme.screen}>
      {header}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={
          !loadingTasks ? (
            <Text style={theme.subheading}>
              No tasks yet. Tap "Add task" to create your first one.
            </Text>
          ) : null
        }
      />
    </View>
  );
}
