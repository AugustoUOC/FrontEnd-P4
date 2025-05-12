// config/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyByHX8ovPinHEkg1CxZoCjBDUIOtBphjos",
  authDomain: "devflow-37a3a.firebaseapp.com",
  projectId: "devflow-37a3a",
  storageBucket: "devflow-37a3a.firebasestorage.app",
  messagingSenderId: "462639357386",
  appId: "1:462639357386:web:fe6a5af940e98127b00333",
  measurementId: "G-GCFQ76YTF6"
};

// Inicializa la aplicación de Firebase
const app = initializeApp(firebaseConfig);

// Crea la referencia a Firestore con el tipo adecuado
const db: Firestore = getFirestore(app);

export { db };
