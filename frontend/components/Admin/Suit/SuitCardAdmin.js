import { Text, View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { SERVER_BASE_URL } from "../../../app/api/api";

export default function SuitCardAdmin({ suit, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      
      {suit.images?.length > 0 ? (
        <Image 
          source={{ uri: `${SERVER_BASE_URL}/storage/${suit.images[0].image_path}` }}
          style={styles.image}
        />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>No Image</Text>
        </View>
      )}

      <Text style={styles.title}>{suit.name}</Text>
      <Text style={styles.desc}>{suit.description}</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Size: </Text>
        <Text style={styles.value}>{suit.size}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Color: </Text>
        <Text style={styles.value}>{suit.color}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Gender: </Text>
        <Text style={styles.value}>{suit.gender}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Category: </Text>
        <Text style={styles.value}>{suit.category}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Price/Day: </Text>
        <Text style={styles.price}>{suit.price_per_day} MAD</Text>
      </View>

      <Text 
        style={[
          styles.status,
          suit.status === "available" ? styles.available : styles.unavailable
        ]}
      >
        {suit.status.toUpperCase()}
      </Text>

    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginVertical: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },

  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },

  imagePlaceholder: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  imagePlaceholderText: {
    color: "#999",
    fontSize: 16,
    fontWeight: "600",
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },

  desc: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    marginBottom: 3,
  },

  label: {
    fontWeight: "bold",
    color: "#444",
  },

  value: {
    color: "#555",
  },

  price: {
    color: "#009688",
    fontWeight: "bold",
  },

  status: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "bold",
    paddingVertical: 5,
    borderRadius: 5,
  },

  available: {
    backgroundColor: "#C8E6C9",
    color: "#2E7D32",
  },

  unavailable: {
    backgroundColor: "#FFCDD2",
    color: "#C62828",
  },
});
