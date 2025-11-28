import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerStyle: { backgroundColor: "#262424" }, headerTintColor: "#EEE5DA" }}>
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="page1" options={{ title: "Page 1" }} />
      <Stack.Screen name="page2" options={{ title: "Page 2" }} />
    </Stack>
  );
}
