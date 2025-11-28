// import { View, Text } from "react-native";

// export default function SuitsPage() {
//   return (
//     <View><Text>📌 Suits List Page</Text></View>
//   );
// }



import { useState, useEffect } from "react";
import { 
  Text, 
  View, 
  Button, 
  ScrollView, 
  Image, 
  StyleSheet 
} from "react-native";

import { login, getSuits, setAuthToken } from "../../api/api";

export default function Suits() {
  const [suits, setSuits] = useState([]);

  useEffect(() => {
    const fetchSuits = async () => {
      try {
        const data = await login("Admin@Admin.com", "Admin");
        setAuthToken(data.token);
        const suitsData = await getSuits();
        setSuits(suitsData);
      } catch (e) {
        console.log("API ERROR:", e.response?.data || e.message);
      }
    };
    fetchSuits(); // load suits automatically
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text>📌 Suits List Page</Text>

      {suits.map((suit) => (
        <View key={suit.id} style={styles.card}>
          
          {suit.images?.length > 0 && (
            <Image 
              source={{ uri: "IMAGE_URL_HERE" }}
              style={styles.image}
            />
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

        </View>
      ))}
    </ScrollView>
  );
}

/* ---------------------------------------------- */
/* --------------      STYLES       -------------- */
/* ---------------------------------------------- */

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: "#f5f5f5",
  },

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



















// import { View, Text, Button } from 'react-native';
// import { useRouter } from 'expo-router';

// export default function Suits() {
//   const router = useRouter();

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Suits List Page</Text>
//       <Button title="Go to Suit #1" onPress={() => router.push('/suits/1')} />
//     </View>
//   );
// }
