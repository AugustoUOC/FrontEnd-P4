import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Video as ExpoVideo, ResizeMode } from "expo-av";

import { getPlayers } from "../../services/playerService";
import { Player } from "../../models/types";

export default function PlayerDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [player, setPlayer] = useState<Player | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerIndex, setPlayerIndex] = useState<number>(0);
  const [zoomImageUri, setZoomImageUri] = useState<string | null>(null);
  const videoRef = useRef<ExpoVideo>(null);
  const { width: screenWidth } = useWindowDimensions();

  useEffect(() => {
    const fetchPlayers = async () => {
      const allPlayers = await getPlayers();
      setPlayers(allPlayers);

      const index = allPlayers.findIndex(p => p.id === id);
      setPlayerIndex(index);

      if (index !== -1) {
        setPlayer(allPlayers[index]);
      } else {
        router.replace("/");
      }
    };

    fetchPlayers();
  }, [id]);

  const goToPrevious = () => {
    if (playerIndex > 0) {
      const prevPlayer = players[playerIndex - 1];
      router.replace(`/player/${prevPlayer.id}`);
    }
  };

  const goToNext = () => {
    if (playerIndex < players.length - 1) {
      const nextPlayer = players[playerIndex + 1];
      router.replace(`/player/${nextPlayer.id}`);
    }
  };

  const goBack = () => {
    router.push("/media");
  };

  const goHome = () => {
    router.push("/")
  }

  if (!player) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando jugador...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#111" }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.buttons}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Text style={styles.backText}>⬅ Volver</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={goHome} style={styles.backButton}>
          <Text style={styles.backText}>Inicio</Text>
        </TouchableOpacity>
        </View>
        
        <View style={styles.detailContainer}>
          <TouchableOpacity onPress={() => setZoomImageUri(player.imageUrl)}>
            <Image source={{ uri: player.imageUrl }} style={styles.image} />
          </TouchableOpacity>
          <View style={styles.info}>
            <Text style={styles.name}>{player.name}</Text>
            <Text style={styles.detail}><Text style={styles.label}>Posición:</Text> {player.position}</Text>
            <Text style={styles.detail}><Text style={styles.label}>Edad:</Text> {player.age} años</Text>
            <Text style={styles.detail}><Text style={styles.label}>Altura:</Text> {player.height} cm</Text>
            <Text style={styles.detail}><Text style={styles.label}>Número:</Text> {player.number}</Text>
            <Text style={styles.detail}><Text style={styles.label}>Equipo:</Text> {player.team}</Text>
          </View>
        </View>

        {player.videoUrl && (
          <View style={[styles.videoContainer, { width: screenWidth - 40, height: (screenWidth - 40) * 0.56 }]}>
            <ExpoVideo
              ref={videoRef}
              source={{ uri: player.videoUrl }}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              style={{ width: "100%", height: "100%" }}
              videoStyle={Platform.OS === "web" ? { position: "relative" } : undefined}
              isLooping
              shouldPlay
            />
          </View>
        )}

        <View style={styles.navButtons}>
          <TouchableOpacity onPress={goToPrevious} disabled={playerIndex === 0} style={[styles.navButton, playerIndex === 0 && styles.disabled]}>
            <Text style={styles.navText}>Anterior</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={goToNext} disabled={playerIndex === players.length - 1} style={[styles.navButton, playerIndex === players.length - 1 && styles.disabled]}>
            <Text style={styles.navText}>Siguiente</Text>
          </TouchableOpacity>
        </View>

        {zoomImageUri && (
          <View style={styles.zoomOverlay}>
            <TouchableOpacity onPress={() => setZoomImageUri(null)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <Image
              source={{ uri: zoomImageUri }}
              style={styles.zoomedImage}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    fontSize: 18,
  },
  buttons: {
    flexDirection: "row", 
    justifyContent: "space-between", 
    width: "100%"
  },
  container: {
    padding: 20,
    backgroundColor: "#111",
    paddingBottom: 40,
    justifyContent: "space-between",
  },
  backButton: {
    marginBottom: 18,
    alignSelf: "flex-start",
    backgroundColor: "#222",
    padding: 10,
    borderRadius: 8,
    flexDirection: "row",
  },
  backText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  detailContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
    alignItems: "center",
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginRight: 20,
    backgroundColor: "#eee",
  },
  info: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 8,
  },
  detail: {
    fontSize: 16,
    marginBottom: 6,
    color: "#444",
  },
  label: {
    fontWeight: "bold",
    color: "#888",
  },
  videoContainer: {
    backgroundColor: "#000",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  navButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  navButton: {
    borderColor: "#ff3b30",
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 28,
    backgroundColor: "#222",
    marginHorizontal: 8,
  },
  disabled: {
    borderColor: "#777",
    opacity: 0.5,
    backgroundColor: "#333",
  },
  navText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  zoomOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 11,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 28,
  },
  zoomedImage: {
    width: '90%',
    height: '70%',
    resizeMode: 'contain',
    borderRadius: 12,
  },
});
