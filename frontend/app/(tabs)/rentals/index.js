// import { View, Text } from "react-native";

// export default function RentalsPage() {
//   return (
//     <View style="padding:50px"><Text>📌 Rentals Page</Text></View>
//   );
// }







// import { View, Text } from 'react-native';

// export default function Rentals() {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Rentals List Page</Text>
//     </View>
//   );
// }




import { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { getRentals,setAuthToken,login} from "../../api/api";

export default function Rentals() {
  const [rentals, setRentals] = useState([]);

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const data = await login("Admin@Admin.com", "Admin");
        setAuthToken(data.token);
        const res = await getRentals();

        console.log("📌 RENTALS RESPONSE:", res);

        setRentals(
          Array.isArray(res)
            ? res
            : res.rentals || res.data || [] // supports both formats
        );
        // setRentals(res);
      } catch (e) {
        console.log("API RENTAL ERROR:", e.response?.data || e.message);
      }
    };

    fetchRentals();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>📌 Rentals List</Text>

      {rentals.length === 0 && (
        <Text style={styles.empty}>No rental records found.</Text>
      )}

      {rentals.map((rental) => (
        <View key={rental.id} style={styles.card}>
          <Text style={styles.text}>📅 Start: {rental.start_date}</Text>
          <Text style={styles.text}>📅 End: {rental.end_date || "N/A"}</Text>
          <Text style={styles.text}>💸 Total: {rental.total_price} MAD</Text>
          <Text style={styles.text}>Payment: {rental.payment_status}</Text>

          <Text
            style={[
              styles.status,
              rental.status === "active"
                ? styles.active
                : rental.status === "completed"
                ? styles.completed
                : styles.cancelled,
            ]}
          >
            {rental.status.toUpperCase()}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

/* -------- STYLES -------- */

const styles = StyleSheet.create({
  container: { padding: 15, backgroundColor: "#f5f5f5" },
  heading: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  empty: { color: "#999", textAlign: "center" },

  card: {
    backgroundColor: "white",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    shadowOpacity: 0.1,
    elevation: 4,
  },

  text: { fontSize: 14, color: "#333", marginBottom: 4 },

  status: {
    marginTop: 10,
    textAlign: "center",
    fontWeight: "bold",
    paddingVertical: 5,
    borderRadius: 5,
  },

  active: { backgroundColor: "#C8E6C9", color: "#2E7D32" },
  completed: { backgroundColor: "#BBDEFB", color: "#0D47A1" },
  cancelled: { backgroundColor: "#FFCDD2", color: "#C62828" },
});

