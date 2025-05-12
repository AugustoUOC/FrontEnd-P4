import 'expo-router/entry'; // Esto inicializa Expo Router
import React, { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { Alert, Platform } from 'react-native';
import { Stack } from 'expo-router';

export default function App() {
  useEffect(() => {
    // Crear canal de notificaciones (Android 8+)
    const createNotificationChannel = async () => {
      if (Platform.OS === 'android') {
        await notifee.createChannel({
          id: 'default',
          name: 'Default Channel',
          importance: AndroidImportance.HIGH,
        });
      }
    };

    // Solicitar permisos al usuario
    const requestPermission = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Permiso para notificaciones concedido');
      }
    };

    // Obtener el token del dispositivo
    const getToken = async () => {
      const token = await messaging().getToken();
      console.log('Token FCM:', token);
    };

    // Listener para notificaciones en foreground
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('Nuevo mensaje', JSON.stringify(remoteMessage.notification));
    });

    createNotificationChannel();
    requestPermission();
    getToken();

    return unsubscribe;
  }, []);

  return <Stack />;
}
