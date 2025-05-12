import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Image, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Player } from '../models/types';
import { getPlayers } from '../services/playerService';
import { LinearGradient } from 'expo-linear-gradient';

const products = [
  { id: "1", image: require("../assets/images/merch1.jpg"), label: "EQUIPAMIENTO" },
  { id: "2", image: require("../assets/images/merch2.jpg"), label: "COMPLEMENTOS" },
  { id: "3", image: require("../assets/images/merch3.jpg"), label: "SUADADERAS" },
];

export default function Home() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [searchText, setSearchText] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');
  const router = useRouter();
  const positions = ['Base', 'Escolta', 'Alero', 'Ala-Pívot', 'Pívot'];

  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 1200, useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getPlayers();
      setPlayers(data);
      setFilteredPlayers(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = players.filter(player =>
      player.name.toLowerCase().includes(searchText.toLowerCase()) &&
      (selectedPosition ? player.position === selectedPosition : true)
    );
    setFilteredPlayers(filtered);
  }, [searchText, selectedPosition, players]);

  const handlePositionFilter = (position: string) => {
    setSelectedPosition(position === selectedPosition ? '' : position);
  };

  const goToPlayer = (id: string) => {
    router.push(`/player/${id}`);
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.hero}>

        <Animated.Text
          style={[
            styles.heroTitle,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          El DevFlow Basket Team
        </Animated.Text>
        <Animated.Text
          style={[
            styles.heroSubtitle,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          Descubre nuestro equipo y sus jugadores
        </Animated.Text>
      </View>

      <LinearGradient
        colors={['#800000', '#d00000', '#222']} // Puedes ajustar los colores a tu gusto
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
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
      {filteredPlayers.map((player, idx) => (
          <TouchableOpacity
          key={player.id ? player.id : idx}
            style={styles.playerCard}
            onPress={() => goToPlayer(player.id)}
            activeOpacity={0.8}
          >
            <Image source={{ uri: player.imageUrl }} style={styles.playerImage} />
            <Text style={styles.playerName}>{player.name}</Text>
            <Text style={styles.playerPosition}>{player.position}</Text>
          </TouchableOpacity>
        ))}
        {filteredPlayers.length === 0 && (
          <View style={styles.noPlayers}>
            <Text style={styles.noPlayersText}>No se encontraron jugadores.</Text>
          </View>
        )}
      </ScrollView>
      <TouchableOpacity 
        style={styles.fullListButton}
        onPress={() => router.push('/media')}
      >
        <Text style={styles.fullListText}>Ver Listado Completo →</Text>
    </TouchableOpacity>
    <View style={styles.storeWrapper}>
      <LinearGradient
        colors={['#d00000', '#111']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.storeSection}
      >
        <Text style={styles.storeTitle}>Nuestra Tienda</Text>
        <View style={styles.storeRow}>
          {products.map((item) => (
            <View key={item.id} style={styles.productCard}>
              <Image source={item.image} style={styles.productImage} />
              <Text style={styles.productLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
        <TouchableOpacity
          style={styles.storeButton}
          onPress={() => router.push('/store')}
        >
          <Text style={styles.storeButtonText}>Ver Más Productos</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>

    </ScrollView>
    
  );
  
}
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#111',
  },
  hero: {
    backgroundColor: '#111', // negro
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
    color: '#fff', // blanco
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
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5", 
    padding: 20,
  },
  title: {
    fontSize: 28,
    color: "#d00000", 
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
    letterSpacing: 1,
  },
  infoEquipoGradient: {
    flexDirection: "column", // <--- Cambia de "row" a "column"
    alignItems: "center",
    marginVertical: 30,
    paddingHorizontal: 10,
    borderRadius: 24,
    paddingVertical: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 6,
  },  
  teamImage: {
    width: 180, // o el tamaño que prefieras
    height: 180,
    borderRadius: 24,
    marginRight: 0, // <--- Quita el margen lateral
    marginLeft: 0,
    marginBottom: 18, // Espacio debajo de la imagen
    backgroundColor: "#eee",
  },
  
  textContainer: {
    width: "100%",
    alignItems: "center",
    paddingLeft: 0,
    maxWidth: "100%",
  },
  
  infoTitle: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 8,
  },
  infoText: {
    color: "#fff",
    fontSize: 16,
    lineHeight: 24,
  },
  filterBar: {
    marginBottom: 10,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  searchInput: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 16,
    color: "#222",
    borderWidth: 1,
    borderColor: "#d00000",
  },
  filterContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  filterButton: {
    borderWidth: 1,
    borderColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 5,
    backgroundColor: "#222",
    minWidth: 80,
    alignItems: "center",
  },
  activeFilter: {
    backgroundColor: "#d00000",
    borderColor: "#d00000",
  },
  filterText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  activeFilterText: {
    color: "#fff",
  },
  sectionTitle: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 20,
    marginBottom: 10,
    marginTop: 15,
  },
  carousel: {
    flexDirection: "row",
    paddingLeft: 16,
    paddingRight: 10,
    paddingBottom: 20,
    gap: 20,
  },
  playerCard: {
    backgroundColor: "#444",
    borderRadius: 10,
    padding: 20,
    marginRight: 20,
    alignItems: "center",
    minWidth: 220,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },
  playerImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
    resizeMode: "cover",
    backgroundColor: "#222",
  },
  playerName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 2,
  },
  playerPosition: {
    color: "#bbb",
    fontSize: 15,
    marginBottom: 8,
  },
  noPlayers: {
    justifyContent: "center",
    alignItems: "center",
    width: 180,
    padding: 20,
  },
  noPlayersText: {
    color: "#bbb",
    fontSize: 16,
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
    transform: [{ scale: 1 }],
  },
  fullListText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  storeCarousel: {
    flexDirection: "row",
    paddingLeft: 16,
    paddingRight: 10,
    paddingBottom: 12,
    gap: 16,
  },
  storeWrapper: {
    paddingHorizontal: 18,
    marginTop: 38,
    marginBottom: 38,
    alignItems: 'center',
    backgroundColor: '#111', // Fondo negro exterior
  },
  
  storeSection: {
    borderRadius: 22,
    paddingVertical: 28,
    paddingHorizontal: 16,
    width: '100%',
    maxWidth: 470,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 8,
    overflow: 'hidden', // ¡Esto es clave para que nada sobresalga!
  },
  
  storeTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  
  storeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 18,
    flexWrap: 'wrap',
    gap: 16,
  },
  
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    padding: 10,
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 4,
  },
  
  productImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  
  productLabel: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
    letterSpacing: 1,
  },
  
  storeButton: {
    backgroundColor: '#d00000',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginTop: 10,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
  
  storeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  
  
});
