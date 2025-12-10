import { useEffect, useMemo, useState } from "react";
import { Alert, FlatList, Platform, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import PrimaryButton from "../../../components/PrimaryButton";
import StatusMessage from "../../../components/StatusMessage";
import { useAuth } from "../../../src/auth/AuthContext";
import { db } from "../../../src/firebase/firebaseConfig";
import { usePalette, useTheme } from "../../../styles/theme";
import { SvgUri } from "react-native-svg";
import { Asset } from "expo-asset";
import TapScale from "../../../components/TapScale";

const moodOptions = [
  { id: "terrible", icon: require("../../../assets/emotion-1.svg"), color: "#ef4444" },
  { id: "bad", icon: require("../../../assets/emotion-2.svg"), color: "#f97316" },
  { id: "okay", icon: require("../../../assets/emotion-3.svg"), color: "#eab308" },
  { id: "good", icon: require("../../../assets/emotion-4.svg"), color: "#22c55e" },
  { id: "great", icon: require("../../../assets/emotion-5.svg"), color: "#3b82f6" },
];

export default function MoodJournalScreen() {
  const theme = useTheme();
  const palette = usePalette();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [entries, setEntries] = useState([]);
  const [mood, setMood] = useState("");
  const [note, setNote] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingEntries, setLoadingEntries] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "moodEntries"),
      where("userId", "==", user.uid),
      orderBy("updatedAt", "desc")
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setEntries(rows);
        setError("");
        setLoadingEntries(false);
      },
      (err) => {
        setError(err.message || "Could not load mood entries.");
        setEntries([]);
        setLoadingEntries(false);
      }
    );
    return unsub;
  }, [user]);

  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => setSuccess(""), 2600);
    return () => clearTimeout(timer);
  }, [success]);

  const resetForm = () => {
    setMood("");
    setNote("");
    setEditingId(null);
  };

  const onSave = async () => {
    if (!user || saving) return;
    if (!mood.trim()) {
      setError("Choose a mood before saving.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      if (editingId) {
        const ref = doc(db, "moodEntries", editingId);
        await updateDoc(ref, {
          mood: mood.trim(),
          note: note.trim(),
          updatedAt: serverTimestamp(),
        });
        setSuccess("Entry updated");
      } else {
        await addDoc(collection(db, "moodEntries"), {
          userId: user.uid,
          mood: mood.trim(),
          note: note.trim(),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        setSuccess("Entry saved");
      }
      resetForm();
    } catch (e) {
      setError(e.message || "Could not save entry.");
    } finally {
      setSaving(false);
    }
  };

  const onEdit = (entry) => {
    setEditingId(entry.id);
    setMood(entry.mood || "");
    setNote(entry.note || "");
  };

  const onDelete = (id) => {
    const doDelete = async () => {
      try {
        await deleteDoc(doc(db, "moodEntries", id));
        setSuccess("Entry deleted");
      } catch (e) {
        setError(e.message || "Could not delete entry.");
      }
    };

    if (Platform.OS === "web") {
      if (typeof window !== "undefined" && window.confirm("Delete this mood entry permanently?")) {
        doDelete();
      }
      return;
    }

    Alert.alert("Delete entry", "Remove this mood entry permanently?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: doDelete,
      },
    ]);
  };

  const header = useMemo(
    () => (
      <View style={{ gap: 12, marginBottom: 12 }}>
        <Text style={theme.heading}>
          {editingId ? "Edit entry" : "New entry"}
        </Text>
        <View style={{ flexDirection: "row", gap: 12, justifyContent: "space-between" }}>
          {moodOptions.map((option) => {
            const active = mood === option.id;
            const uri = Asset.fromModule(option.icon).uri;
            return (
              <View key={option.id} style={{ alignItems: "center", flex: 1 }}>
                <TapScale
                  onPress={() => setMood(option.id)}
                  style={{
                    padding: 12,
                    borderRadius: 16,
                    borderWidth: 2,
                    borderColor: active ? option.color : palette.border,
                    backgroundColor: active ? `${option.color}20` : "transparent",
                  }}
                >
                  <SvgUri
                    width={36}
                    height={36}
                    uri={uri}
                    fill={option.color}
                    stroke="none"
                  />
                </TapScale>
                <Text
                  style={{
                    marginTop: 6,
                    color: active ? option.color : palette.text,
                    fontWeight: "700",
                    textTransform: "capitalize",
                  }}
                >
                  {option.id}
                </Text>
              </View>
            );
          })}
        </View>
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="Reflection"
          placeholderTextColor={palette.muted}
          style={[theme.input, { minHeight: 100 }]}
          multiline
        />
        {!!error && <StatusMessage message={error} type="error" />}
        {!!success && <StatusMessage message={success} type="success" />}
        <PrimaryButton
          title={saving ? "Saving..." : editingId ? "Update entry" : "Save entry"}
          onPress={onSave}
          loading={saving}
        />
        {editingId && <PrimaryButton title="Cancel edit" onPress={resetForm} />}
        {loadingEntries && (
          <Text style={theme.subheading}>Loading your entries...</Text>
        )}
      </View>
    ),
    [editingId, error, loadingEntries, mood, note, palette.danger, palette.muted, saving, theme.heading, theme.input, theme.subheading]
  );

  const renderItem = ({ item }) => (
    <View style={theme.card}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        {(() => {
          const match = moodOptions.find((m) => m.id === item.mood);
          if (match) {
            const uri = Asset.fromModule(match.icon).uri;
            return (
              <SvgUri
                width={28}
                height={28}
                uri={uri}
                fill={match.color}
                stroke="none"
              />
            );
          }
          return null;
        })()}
        <Text style={[theme.heading, { marginBottom: 0 }]}>
          {item.mood || "Mood"}
        </Text>
      </View>
      <Text style={theme.subheading}>
        {item.note || "No reflection added."}
      </Text>
      <View style={{ flexDirection: "row", gap: 12 }}>
        <PrimaryButton title="Edit" onPress={() => onEdit(item)} />
        <PrimaryButton
          title="Delete"
          onPress={() => onDelete(item.id)}
          disabled={saving}
        />
      </View>
    </View>
  );

  return (
    <View style={theme.screen}>
      {header}
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={
          !loadingEntries ? (
            <Text style={theme.subheading}>
              No entries yet. Save one to get started.
            </Text>
          ) : null
        }
      />
    </View>
  );
}
