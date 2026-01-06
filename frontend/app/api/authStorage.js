// this file help to Securely store and retrieve the authentication session on the phone
  // save token after login and user infos
  // Delete them when logout (session)
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'wearsuit_token';
const USER_KEY = 'wearsuit_user';

// SAVE Session after sucessful login
export async function saveAuthSession({ token, user }) {
  if (!token) throw new Error('Token is required');
  await SecureStore.setItemAsync(TOKEN_KEY, token); //stored encrypted tokken
  if (user) {
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user)); // save user info { id, role, name,... } used to know if it is client or admin
  }
}

// called in app starts(after sucessful login) or after reload app 
export async function getAuthSession() {
  const token = await SecureStore.getItemAsync(TOKEN_KEY); // when exist user is login if not user is logout
  const userRaw = await SecureStore.getItemAsync(USER_KEY); //json format contain user infos
  const user = userRaw ? JSON.parse(userRaw) : null; // store user info as json not string
  return { token, user };
}

// clear session after logout
export async function clearAuthSession() {
  await SecureStore.deleteItemAsync(TOKEN_KEY); // tokken deleted
  await SecureStore.deleteItemAsync(USER_KEY); // user info is deleted
}

export default function AuthStorageRoute() {
  return null;
}
