import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Video, ResizeMode } from 'expo-av';
import { playerService } from '../../services/playerService';
import { Player } from '../../types/player';

export default function VideoScreen() {
  const { id } = useLocalSearchParams();
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadPlayer();
  }, [id]);

  const loadPlayer = async () => {
    try {
      setLoading(true);
      const data = await playerService.getPlayerById(id as string);
      setPlayer(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los datos del jugador');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#d00000" />
      </View>
    );
  }

  if (error || !player) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error || 'Jugador no encontrado'}</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Video
        source={{ uri: player.videoUrl }}
        style={styles.video}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        isLooping
      />
      
      <View style={styles.infoContainer}>
        <Text style={styles.title}>Video Destacado</Text>
        <Text style={styles.playerName}>{player.name}</Text>
        <Text style={styles.playerPosition}>{player.position}</Text>
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>Volver al Perfil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },
  video: {
    width: '100%',
    height: 300,
    backgroundColor: '#000',
  },
  infoContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  playerName: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 5,
  },
  playerPosition: {
    fontSize: 16,
    color: '#bbb',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  backButton: {
    backgroundColor: '#d00000',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    margin: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 