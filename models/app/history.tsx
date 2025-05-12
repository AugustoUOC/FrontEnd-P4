import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

export default function HistoryScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/pngegg.png")}
        style={styles.image}
        resizeMode="contain"
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>Since 1979</Text>
        <Text style={styles.description}>
          El DevFlow Basket Team es un grupo apasionado de jugadores que combinan talento,
          esfuerzo y trabajo en equipo para alcanzar la victoria. Con una mezcla de experiencia
          y juventud, nuestro equipo se enfoca en el juego limpio, la estrategia y la dedicación
          en cada entrenamiento. Estamos comprometidos en superarnos día a día, buscando siempre
          mejorar y dar lo mejor en cada partido. ¡Únete a nosotros y forma parte de esta increíble
          familia deportiva!
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#800000", // rojo oscuro
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  image: {
    width: "40%",
    height: "80%",
    marginRight: 20,
  },
  textContainer: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    lineHeight: 24,
  },
});
