// config/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getMessaging } from 'firebase/messaging';

// Tu configuración de Firebase
const firebaseConfig = {
  // Aquí debes colocar tu configuración de Firebase
  // La obtendrás de la consola de Firebase
  apiKey: "AIzaSyByHX8ovPinHEkg1CxZoCjBDUIOtBphjos",
  authDomain: "devflow-37a3a.firebaseapp.com",
  projectId: "devflow-37a3a",
  storageBucket: "devflow-37a3a.firebasestorage.app",
  messagingSenderId: "462639357386",
  appId: "1:462639357386:web:fe6a5af940e98127b00333",
  measurementId: "G-GCFQ76YTF6"
};

console.log('Inicializando Firebase con la configuración:', firebaseConfig);

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
console.log('Firebase App inicializado:', app);

// Inicializar Firestore
const db = getFirestore(app);

console.log('Firestore inicializado:', db);

export { db };
export const messaging = getMessaging(app);
console.log('Firebase Messaging inicializado:', messaging);

export default app;
