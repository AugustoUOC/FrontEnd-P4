// playerService.ts
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'; 
import { db } from '../config/firebase';
import { Player } from '../models/types';

export const getPlayers = async (): Promise<Player[]> => {
  const querySnapshot = await getDocs(collection(db, 'players'));
  const players: Player[] = [];

  querySnapshot.forEach((doc) => {
    players.push({ id: doc.id, ...doc.data() } as Player);
  });

  return players;
};

export const getPlayerById = async (id: string): Promise<Player | null> => {
  const docRef = doc(db, 'players', id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Player;
  } else {
    return null;
  }
};
