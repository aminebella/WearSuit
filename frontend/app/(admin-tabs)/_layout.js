// app/(tabs)/_layout.js
import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, ActivityIndicator } from 'react-native';
import { useCallback, useState } from 'react';
import { clearAuthSession } from '../api/authStorage';
import { logout as apiLogout, setAuthToken } from '../api/api';

export default function TabsLayout() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = useCallback(async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      try {
        await apiLogout();
      } catch (e) {
        // Ignore API logout errors but we still clear local session.
      }
      await clearAuthSession();
      setAuthToken(null);
      router.replace('/auth/login');
    } finally {
      setIsLoggingOut(false);
    }
  }, [isLoggingOut, router]);

  return (
    // tab: navigation bar
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
        headerRight: () => (
          <Pressable
            onPress={handleLogout}
            disabled={isLoggingOut}
            style={{ paddingHorizontal: 12, paddingVertical: 6 }}
          >
            {isLoggingOut ? (
              <ActivityIndicator />
            ) : (
              <Ionicons name="log-out-outline" size={22} color="#111" />
            )}
          </Pressable>
        ),
      }}
    >
      <Tabs.Screen
        name="suits/index"
        options={{ title: "Suits",tabBarIcon: ({ color, size }) => <Ionicons name="shirt" color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="rentals/index"
        options={{ title: "Reservations",tabBarIcon: ({ color, size }) => <Ionicons name="calendar" color={color} size={size} /> }}
      />
    </Tabs>
  );
}
