import { View, StyleSheet } from "react-native";

interface LayoutComponentProps {
  children: React.ReactNode;
}

export default function LayoutComponent({ children }: LayoutComponentProps) {
  return <View style={styles.container}>{children}</View>;
}
const almond = "#EEE5DA"
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: almond
  },
});

