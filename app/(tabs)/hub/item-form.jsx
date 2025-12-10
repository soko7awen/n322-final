import { useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useAuth } from "../../../src/auth/AuthContext";
import { db } from "../../../src/firebase/firebaseConfig";
import PrimaryButton from "../../../components/PrimaryButton";
import { usePalette, useTheme } from "../../../styles/theme";

export default function ItemFormScreen() {
  const theme = useTheme();
  const router = useRouter();
  const palette = usePalette();
  const { id } = useLocalSearchParams();
  const { user, loading } = useAuth();
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    let cancelled = false;
    const loadTask = async () => {
      if (!id || Array.isArray(id)) return;
      try {
        const ref = doc(db, "tasks", id);
        const snap = await getDoc(ref);
        if (!snap.exists()) return;
        const data = snap.data();
        if (data.userId !== user?.uid) return;
        if (cancelled) return;
        setTitle(data.title || "");
        setDetails(data.details || "");
      } catch (e) {
        setError(e.message || "Could not load task.");
      }
    };
    loadTask();
    return () => {
      cancelled = true;
    };
  }, [id, user]);

  const onSave = async () => {
    if (!user || saving) return;
    if (!title.trim()) {
      setError("Give your task a title before saving.");
      return;
    }
    setError("");
    try {
      setSaving(true);
      if (id && !Array.isArray(id)) {
        const ref = doc(db, "tasks", id);
        await updateDoc(ref, {
          title: title.trim(),
          details: details.trim(),
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, "tasks"), {
          title: title.trim(),
          details: details.trim(),
          userId: user.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      router.replace("/hub/tasks");
    } catch (e) {
      setError(e.message || "Could not save task.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={theme.screen}>
      <View style={theme.card}>
        <Text style={theme.heading}>{id ? "Edit task" : "New task"}</Text>
        <Text style={theme.subheading}>
          Each task keeps a title and details. You can extend this with more
          fields later.
        </Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Title"
          placeholderTextColor={palette.muted}
          style={theme.input}
        />
        <TextInput
          value={details}
          onChangeText={setDetails}
          placeholder="Details"
          placeholderTextColor={palette.muted}
          style={[theme.input, { minHeight: 100 }]}
          multiline
        />
        {!!error && <Text style={{ color: palette.danger }}>{error}</Text>}
        <PrimaryButton
          title={saving ? "Saving..." : "Save task"}
          onPress={onSave}
          loading={saving}
        />
      </View>
    </View>
  );
}
