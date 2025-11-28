// app/(tabs)/_layout.js
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false ,tabBarActiveTintColor: 'blue',tabBarInactiveTintColor: "gray",}}>
      <Tabs.Screen
        name="suits/index"
        options={{ title: "Suits Store",tabBarIcon: ({ color, size }) => <Ionicons name="shirt" color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="rentals/index"
        options={{ title: "Rentals",tabBarIcon: ({ color, size }) => <Ionicons name="calendar" color={color} size={size} /> }}
      />
    </Tabs>
  );
}
