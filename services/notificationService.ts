import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';

export const requestUserPermission = async () => {
  try {
    if (Platform.OS === 'ios') {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
      }
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error);
  }
};

export const getFCMToken = async () => {
  try {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log('FCM Token:', fcmToken);
      return fcmToken;
    }
  } catch (error) {
    console.error('Error getting FCM token:', error);
  }
};

export const notificationListener = () => {
  try {
    // Foreground state messages
    messaging().onMessage(async remoteMessage => {
      console.log('Received foreground message:', remoteMessage);
    });

    // Background state messages
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Received background message:', remoteMessage);
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('Initial notification:', remoteMessage);
        }
      });
  } catch (error) {
    console.error('Error setting up notification listener:', error);
  }
}; 