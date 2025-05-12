// models/types.ts

// Definición de las rutas de navegación
export type RootStackParamList = {
  Home: undefined;
  PlayerDetail: { id: string };  // Aquí 'id' es el parámetro de la ruta
};

// Otros tipos, como la interfaz Player, permanecen igual
export interface Player {
  id: string;
  name: string;
  height: string;
  age: string;
  position: string;
  number: number;
  team: string;
  imageUrl: string;
  videoUrl: string;
}
