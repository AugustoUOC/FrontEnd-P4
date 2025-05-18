import 'expo-router/entry';
import React, { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import { Stack } from 'expo-router';
import { Alert, Platform } from 'react-native';

export default function App() {
  useEffect(() => {
    const requestPermissionAndGetToken = async () => {
      try {
        // Solicitar permiso (solo en Android/iOS)
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (!enabled) {
          console.log('Permiso para notificaciones DENEGADO');
          return;
        }

        console.log('Permiso concedido');

        // Asegurar inicialización
        await messaging().setAutoInitEnabled(true);

        // Obtener token
        const token = await messaging().getToken();

        if (token) {
          console.log('Token FCM:', token);
          Alert.alert('Token generado', token);
        } else {
          console.warn('No se pudo generar el token');
        }

      } catch (error) {
        console.error('Error al obtener token FCM:', error);
      }
    };

    // Listener en foreground
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Notificación recibida:', remoteMessage);
      Alert.alert('Notificación', remoteMessage.notification?.body || 'Sin contenido');
    });

    // Ejecutar
    if (Platform.OS !== 'web') {
      requestPermissionAndGetToken();
    }

    return unsubscribe;
  }, []);

  return <Stack />;
}
