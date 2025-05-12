import { useColorScheme as _useColorScheme } from 'react-native';

/**
 * Devuelve el esquema de color actual (light o dark).
 * Si el dispositivo no tiene configurado, devuelve 'light' por defecto.
 */
export function useColorScheme() {
  const scheme = _useColorScheme();
  return scheme ?? 'light';
}
