import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { playerService } from '../services/playerService';
import { Player } from '../types/player';

const positions = ['Base', 'Escolta', 'Alero', 'Ala-Pívot', 'Pívot'];

export default function Home() {
  const [searchText, setSearchText] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  const renderPlayerCard = (player: Player) => (
    <TouchableOpacity
      key={player.id}
      style={styles.playerCard}
      onPress={() => router.push(`/player/${player.id}`)}
    >
      <Image
        source={{ uri: player.imageUrl }}
        style={styles.playerImage}
      />
      <View style={styles.playerInfo}>
        <Text style={styles.playerName}>{player.name}</Text>
        <Text style={styles.playerPosition}>{player.position}</Text>
        <Text style={styles.playerNumber}>#{player.number}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.root}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>
          El DevFlow Basket Team
        </Text>
        <Text style={styles.heroSubtitle}>
          Descubre nuestro equipo y sus jugadores
        </Text>
      </View>

      <LinearGradient
        colors={['#800000', '#d00000', '#222']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.infoEquipoGradient}
      >
        <Image
          source={require('../assets/images/portada.png')}
          style={styles.teamImage}
        />
        <View style={styles.textContainer}>
          <Text style={styles.infoTitle}>Since 1979</Text>
          <Text style={styles.infoText}>
            DevFlow Basket Team combina pasión, esfuerzo y juego limpio. Con dedicación y trabajo en equipo, buscamos mejorar en cada partido. ¡Únete a esta familia deportiva!
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.filterBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar jugador..."
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={setSearchText}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContainer}>
          {positions.map(pos => (
            <TouchableOpacity
              key={pos}
              onPress={() => handlePositionFilter(pos)}
              style={[
                styles.filterButton,
                selectedPosition === pos && styles.activeFilter,
              ]}
            >
              <Text style={styles.filterText}>{pos}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <Text style={styles.sectionTitle}>Jugadores destacados</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#d00000" style={styles.loader} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
          {filteredPlayers.length > 0 ? (
            filteredPlayers.map(renderPlayerCard)
          ) : (
            <Text style={styles.noPlayersText}>No se encontraron jugadores.</Text>
          )}
        </ScrollView>
      )}

      <TouchableOpacity 
        style={styles.fullListButton}
        onPress={() => router.push('/media')}
      >
        <Text style={styles.fullListText}>Ver Listado Completo →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#111',
  },
  hero: {
    backgroundColor: '#111',
    borderRadius: 18,
    padding: 32,
    margin: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.20,
    shadowRadius: 12,
    elevation: 5,
  },
  heroTitle: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#bbb',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  infoEquipoGradient: {
    flexDirection: 'column',
    alignItems: 'center',
    marginVertical: 30,
    paddingHorizontal: 10,
    borderRadius: 24,
    paddingVertical: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 6,
  },
  teamImage: {
    width: 180,
    height: 180,
    borderRadius: 24,
    marginBottom: 18,
    backgroundColor: '#eee',
  },
  textContainer: {
    width: '100%',
    alignItems: 'center',
    paddingLeft: 0,
    maxWidth: '100%',
  },
  infoTitle: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
  },
  filterBar: {
    marginBottom: 10,
    marginTop: 10,
    paddingHorizontal: 10,
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
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  filterButton: {
    borderWidth: 1,
    borderColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 5,
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
  sectionTitle: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 20,
    marginBottom: 10,
    marginTop: 15,
  },
  carousel: {
    flexDirection: 'row',
    paddingLeft: 16,
    paddingRight: 10,
    paddingBottom: 20,
    gap: 20,
  },
  playerCard: {
    width: 200,
    backgroundColor: '#222',
    borderRadius: 15,
    overflow: 'hidden',
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  playerImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#333',
  },
  playerInfo: {
    padding: 15,
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
    padding: 20,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 16,
    padding: 20,
    textAlign: 'center',
  },
  loader: {
    marginVertical: 20,
  },
  fullListButton: {
    backgroundColor: '#d00000',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: 25,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  fullListText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});
