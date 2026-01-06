import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
      // classic navigation: Login -> Tabs -> Details -> Back
      <Stack screenOptions={{ headerShown: false }} />
  );
}

