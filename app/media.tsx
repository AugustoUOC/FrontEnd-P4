import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { playerService } from '../services/playerService';
import { Player } from '../types/player';

const positions = ['Base', 'Escolta', 'Alero', 'Ala-Pívot', 'Pívot'];

export default function MediaScreen() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    try {
      setLoading(true);
      const data = await playerService.getPlayers();
      setPlayers(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los jugadores');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePositionFilter = (position: string) => {
    setSelectedPosition(position === selectedPosition ? '' : position);
  };

  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesPosition = !selectedPosition || player.position === selectedPosition;
    return matchesSearch && matchesPosition;
  });

  const renderPlayerItem = ({ item }: { item: Player }) => (
    <TouchableOpacity
      style={styles.playerCard}
      onPress={() => router.push(`/player/${item.id}`)}
    >
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.playerImage}
      />
      <View style={styles.playerInfo}>
        <Text style={styles.playerName}>{item.name}</Text>
        <Text style={styles.playerPosition}>{item.position}</Text>
        <Text style={styles.playerNumber}>#{item.number}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#d00000" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
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
      <View style={styles.header}>
        <Text style={styles.title}>Listado de Jugadores</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar jugador..."
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={setSearchText}
        />
        <FlatList
          horizontal
          data={positions}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedPosition === item && styles.activeFilter,
              ]}
              onPress={() => handlePositionFilter(item)}
            >
              <Text style={styles.filterText}>{item}</Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
        />
      </View>

      <FlatList
        data={filteredPlayers}
        renderItem={renderPlayerItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.noPlayersText}>No se encontraron jugadores.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },
  header: {
    padding: 20,
    backgroundColor: '#222',
  },
  title: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 16,
    color: '#222',
    borderWidth: 1,
    borderColor: '#d00000',
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  filterButton: {
    borderWidth: 1,
    borderColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#222',
    minWidth: 80,
    alignItems: 'center',
  },
  activeFilter: {
    backgroundColor: '#d00000',
    borderColor: '#d00000',
  },
  filterText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 10,
  },
  playerCard: {
    flexDirection: 'row',
    backgroundColor: '#222',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  playerImage: {
    width: 100,
    height: 100,
    backgroundColor: '#333',
  },
  playerInfo: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
  },
  playerName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  playerPosition: {
    color: '#bbb',
    fontSize: 14,
    marginBottom: 5,
  },
  playerNumber: {
    color: '#d00000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noPlayersText: {
    color: '#bbb',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
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
    marginTop: 20,
    marginHorizontal: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

