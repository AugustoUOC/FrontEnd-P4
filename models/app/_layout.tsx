import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

// Evitar que el SplashScreen se oculte automáticamente
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#d00000', 
          },
          headerTintColor: '#fff', 
          headerTitleStyle: {
            fontWeight: 'bold', 
            fontSize: 20, 
          },
          headerTitleAlign: 'center',
        }}
      >
        <Stack.Screen
          name="index"
          options={{ 
            headerShown: false, 
            title: 'Inicio' 
          }}
        />
        <Stack.Screen
          name="media"
          options={{
            title: "Jugadores",
          }}
        />
        <Stack.Screen
          name="store"
          options={{
            title: "Tienda",
          }}
        />
        <Stack.Screen
          name="+not-found"
          options={{ 
            title: "Página no encontrada",
            headerStyle: { backgroundColor: '#2A2A2A' } 
          }}
        />
        <Stack.Screen
          name="player/[id].tsx"
          options={{
            title: "JUGADOR 3",
          }}
        />
      </Stack>
      <StatusBar style="light" /> 
    </ThemeProvider>
  );
}
