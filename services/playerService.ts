// playerService.ts
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Player } from '../types/player';

export const playerService = {
  async getPlayers(): Promise<Player[]> {
    try {
      const playersCollection = collection(db, 'players');
      const querySnapshot = await getDocs(playersCollection);
      const players: Player[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.name && data.position) {
          const player = {
            id: doc.id,
            name: data.name,
            height: data.height || '',
            age: data.age || '',
            position: data.position,
            number: data.number || 0,
            team: data.team || '',
            imageUrl: data.imageUrl || '',
            videoUrl: data.videoUrl || ''
          };
          players.push(player);
        }
      });

      return players;
    } catch (error) {
      console.error('Error en getPlayers:', error);
      throw error;
    }
  },

  async getPlayerById(id: string): Promise<Player> {
    try {
      const docRef = doc(db, 'players', id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('Jugador no encontrado');
      }

      const data = docSnap.data();
      return {
        id: docSnap.id,
        name: data.name,
        height: data.height || '',
        age: data.age || '',
        position: data.position,
        number: data.number || 0,
        team: data.team || '',
        imageUrl: data.imageUrl || '',
        videoUrl: data.videoUrl || ''
      };
    } catch (error) {
      console.error('Error en getPlayerById:', error);
      throw error;
    }
  }
};
