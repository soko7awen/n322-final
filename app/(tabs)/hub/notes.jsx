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

export default function NotesScreen() {
  const theme = useTheme();
  const palette = usePalette();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingNotes, setLoadingNotes] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "notes"),
      where("userId", "==", user.uid),
      orderBy("updatedAt", "desc")
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setNotes(rows);
        setError("");
        setLoadingNotes(false);
      },
      (err) => {
        setError(err.message || "Could not load notes.");
        setNotes([]);
        setLoadingNotes(false);
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
    setTitle("");
    setBody("");
    setEditingId(null);
  };

  const onSave = async () => {
    if (!user || saving) return;
    if (!title.trim()) {
      setError("Give your note a title.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      if (editingId) {
        const ref = doc(db, "notes", editingId);
        await updateDoc(ref, {
          title: title.trim(),
          body: body.trim(),
          updatedAt: serverTimestamp(),
        });
        setSuccess("Note updated");
      } else {
        await addDoc(collection(db, "notes"), {
          userId: user.uid,
          title: title.trim(),
          body: body.trim(),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        setSuccess("Note saved");
      }
      resetForm();
    } catch (e) {
      setError(e.message || "Could not save note.");
    } finally {
      setSaving(false);
    }
  };

  const onEdit = (note) => {
    setEditingId(note.id);
    setTitle(note.title || "");
    setBody(note.body || "");
  };

  const onDelete = (id) => {
    const doDelete = async () => {
      try {
        await deleteDoc(doc(db, "notes", id));
        setSuccess("Note deleted");
      } catch (e) {
        setError(e.message || "Could not delete note.");
      }
    };

    if (Platform.OS === "web") {
      if (typeof window !== "undefined" && window.confirm("Delete this note permanently?")) {
        doDelete();
      }
      return;
    }

    Alert.alert("Delete note", "Remove this note permanently?", [
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
        <Text style={theme.heading}>{editingId ? "Edit note" : "New note"}</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Title"
          placeholderTextColor={palette.muted}
          style={theme.input}
        />
        <TextInput
          value={body}
          onChangeText={setBody}
          placeholder="Details"
          placeholderTextColor={palette.muted}
          style={[theme.input, { minHeight: 100 }]}
          multiline
        />
        {!!error && <StatusMessage message={error} type="error" />}
        {!!success && <StatusMessage message={success} type="success" />}
        <PrimaryButton
          title={saving ? "Saving..." : editingId ? "Update note" : "Save note"}
          onPress={onSave}
          loading={saving}
        />
        {editingId && (
          <PrimaryButton title="Cancel edit" onPress={resetForm} />
        )}
        {loadingNotes && (
          <Text style={theme.subheading}>Loading your notes...</Text>
        )}
      </View>
    ),
    [body, editingId, error, loadingNotes, palette.danger, palette.muted, saving, theme.heading, theme.input, theme.subheading, title]
  );

  const renderItem = ({ item }) => (
    <View style={theme.card}>
      <Text style={theme.heading}>{item.title}</Text>
      <Text style={theme.subheading}>
        {item.body || "No details yet."}
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
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={
          !loadingNotes ? (
            <Text style={theme.subheading}>
              No notes yet. Save one to get started.
            </Text>
          ) : null
        }
      />
    </View>
  );
}
