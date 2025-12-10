import { useEffect, useMemo } from "react";
import { Text, View, useWindowDimensions } from "react-native";
import { Asset } from "expo-asset";
import { SvgUri } from "react-native-svg";
import { useRouter } from "expo-router";
import TapScale from "../../../components/TapScale";
import { useAuth } from "../../../src/auth/AuthContext";
import { usePalette, useTheme } from "../../../styles/theme";

export default function HubScreen() {
  const theme = useTheme();
  const palette = usePalette();
  const router = useRouter();
  const { user, loading } = useAuth();
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  const tiles = useMemo(
    () => [
      {
        id: "notes",
        title: "Notes",
        icon: Asset.fromModule(require("../../../assets/hub-notes.svg")).uri,
        route: "/hub/notes",
      },
      {
        id: "mood",
        title: "Mood Journal",
        icon: Asset.fromModule(require("../../../assets/hub-journal.svg")).uri,
        route: "/hub/mood-journal",
      },
      {
        id: "tasks",
        title: "Tasks",
        icon: Asset.fromModule(require("../../../assets/hub-tasks.svg")).uri,
        route: "/hub/tasks",
      },
    ],
    []
  );

  const contentWidth = Math.min(420, Math.max(280, width - 40)); // theme.screen has 20px horizontal padding
  const tileSize = Math.min(164, Math.max(130, (contentWidth - 24) / 2));
  const iconSize = Math.floor(tileSize * 0.58);

  const renderTile = (tile) => (
    <TapScale
      key={tile.id}
      onPress={() => router.push(tile.route)}
      style={{
        alignItems: "center",
        marginHorizontal: 6,
      }}
    >
      <View
        style={{
          width: tileSize,
          height: tileSize,
          borderRadius: 22,
          backgroundColor: palette.card,
          borderWidth: 1,
          borderColor: palette.border,
          shadowColor: palette.text,
          shadowOpacity: 0.08,
          shadowOffset: { width: 0, height: 10 },
          shadowRadius: 18,
          elevation: 3,
          alignItems: "center",
          justifyContent: "center",
          padding: 18,
        }}
      >
        <SvgUri width={iconSize} height={iconSize} uri={tile.icon} />
      </View>
      <Text
        style={{
          color: palette.text,
          fontWeight: "800",
          fontSize: 18,
          marginTop: 12,
          letterSpacing: 0.3,
        }}
      >
        {tile.title}
      </Text>
    </TapScale>
  );

  return (
    <View style={[theme.screen, { justifyContent: "center", alignItems: "center" }]}>
      <View style={{ gap: 18, width: contentWidth }}>
        <View style={{ alignItems: "center" }}>{renderTile(tiles[0])}</View>
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          {renderTile(tiles[1])}
          {renderTile(tiles[2])}
        </View>
      </View>
    </View>
  );
}
