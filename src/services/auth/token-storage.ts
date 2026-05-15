import * as SecureStore from 'expo-secure-store'

const TOKEN_KEY = 'healthmind_token'

export const TokenStorage = {
  save: (token: string) => SecureStore.setItemAsync(TOKEN_KEY, token),
  get: () => SecureStore.getItemAsync(TOKEN_KEY),
  remove: () => SecureStore.deleteItemAsync(TOKEN_KEY),
}
