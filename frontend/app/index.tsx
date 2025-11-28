import { Link } from "expo-router";
import { Text, Button, StyleSheet } from "react-native";
import LayoutComponent from "./LayoutComponent";

export default function Index() {
  return (
    <LayoutComponent>
      <Text style={styles.title}>Home Page</Text>
      <Link href="/page1" asChild>
        <Button title="Go to Page 1" />
      </Link>
      <Link href="/page2" asChild>
        <Button title="Go to Page 2" />
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
