import React from "react";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";

const products = [
  { id: "1", image: require("../assets/images/merch1.jpg") },
  { id: "2", image: require("../assets/images/merch2.jpg") },
  { id: "3", image: require("../assets/images/merch3.jpg") },
];

export default function StoreScreen() {
  const renderItem = ({ item }: { item: typeof products[0] }) => (
    <View style={styles.productCard}>
      <Image source={item.image} style={styles.productImage} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tienda Oficial 🛒</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2} // Dos columnas
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  listContent: {
    alignItems: "center",
  },
  productCard: {
    backgroundColor: "#222",
    padding: 10,
    borderRadius: 12,
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
    width: 140,
    height: 140,
  },
  productImage: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
});
