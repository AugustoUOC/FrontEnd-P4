import React, { useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Player } from "../models/types";
import { getPlayers } from "../services/playerService";
import { useRouter } from "expo-router";

const positions = ["Base", "Escolta", "Alero", "Ala-Pívot", "Pívot"];

export default function MediaScreen() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [selectedPosition, setSelectedPosition] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchPlayers = async () => {
      const data = await getPlayers();
      setPlayers(data);
    };
    fetchPlayers();
  }, []);

  const filteredPlayers = players.filter(player =>
    player.name.toLowerCase().includes(searchText.toLowerCase()) &&
    (selectedPosition ? player.position === selectedPosition : true)
  );

  const goBack = () => {
    router.push("/");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goBack} style={styles.backButton}>
        <Text style={styles.backText}>⬅ Volver</Text>
      </TouchableOpacity>
      {/* Buscador */}
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar jugador..."
        value={searchText}
        onChangeText={setSearchText}
        placeholderTextColor="#bbb"
      />

      {/* Filtros */}
      <View style={styles.filterContainer}>
        {positions.map(pos => (
          <TouchableOpacity
            key={pos}
            onPress={() => setSelectedPosition(selectedPosition === pos ? "" : pos)}
            style={[
              styles.filterButton,
              selectedPosition === pos && styles.activeFilter
            ]}
          >
            <Text style={[
              styles.filterText,
              selectedPosition === pos && styles.activeFilterText
            ]}>
              {pos}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Listado en grilla */}
      <FlatList
        data={filteredPlayers}
        keyExtractor={(item, index) => item.id ? item.id : index.toString()}
        renderItem={({ item }) => (
          <View style={styles.playerCard}>
            <Image source={{ uri: item.imageUrl }} style={styles.playerImage} />
            <Text style={styles.playerName}>{item.name}</Text>
            <Text style={styles.playerPosition}>{item.position}</Text>
            <TouchableOpacity
              style={styles.detailButton}
              onPress={() => router.push(`/player/${item.id}`)}
            >
              <Text style={styles.detailButtonText}>Ver Detalles</Text>
            </TouchableOpacity>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No se encontraron jugadores.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111", 
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  backButton: {
    marginBottom: 18,
    alignSelf: "flex-start",
    backgroundColor: "#222",
    padding: 10,
    borderRadius: 8,
  },
  backText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  searchInput: {
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 12,
    color: "#000",
    marginBottom: 15,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: "row",
    marginBottom: 20,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  filterButton: {
    borderWidth: 1,
    borderColor: "red",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 5,
    backgroundColor: "#222",
    minWidth: 80,
    alignItems: "center",
  },
  activeFilter: {
    backgroundColor: "red",
  },
  filterText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
  activeFilterText: {
    color: "#fff",
  },
  listContent: {
    paddingBottom: 30,
    alignItems: "center",
  },
  playerCard: {
    backgroundColor: "#333",
    borderRadius: 12,
    padding: 15,
    margin: 10,
    width: 180,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#222",
  },
  playerImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
    resizeMode: "cover",
    backgroundColor: "#222",
  },
  playerName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 2,
  },
  playerPosition: {
    fontSize: 14,
    color: "#ccc",
    textAlign: "center",
    marginBottom: 10,
  },
  detailButton: {
    backgroundColor: "red",
    paddingVertical: 7,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginTop: 6,
    shadowColor: "#d00000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  detailButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  emptyText: {
    color: "#fff",
    fontSize: 16,
    marginTop: 40,
    textAlign: "center",
  },
});

