import { Link } from "expo-router";
import { Text, Button, StyleSheet } from "react-native";
import LayoutComponent from "./LayoutComponent";

export default function Page2() {
  return (
    <LayoutComponent>
      <Text style={styles.title}>Page 2</Text>
      <Link href="/" asChild>
        <Button title="Go to Home" />
      </Link>
    </LayoutComponent>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});
