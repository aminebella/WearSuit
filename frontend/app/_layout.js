// import { Tabs } from "expo-router";

// export default function TabLayout() {
//   return (
//     <Tabs>
//       <Tabs.Screen name="home" options={{ title: "Home" }} />
//       <Tabs.Screen name="workouts" options={{ title: "Workouts" }} />
//       <Tabs.Screen name="profile" options={{ title: "Profile" }} />
//       <Tabs.Screen name="settings" options={{ title: "Settings" }} />
//     </Tabs>
//   );
// }


// import { Stack } from "expo-router";

// export default function RootLayout() {
//   return (
//     <Stack screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="login" />
//       <Stack.Screen name="(tabs)" />
//     </Stack>
//   );
// }

import { Stack } from 'expo-router';
// import { AuthProvider } from './context/AuthContext';

export default function RootLayout() {
  return (
    // <AuthProvider>
      <Stack screenOptions={{ headerShown: true }} />
    // </AuthProvider>
  );
}

