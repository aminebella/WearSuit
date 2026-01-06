import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function ReservationCardAdmin({ rental, onPress }) {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return { backgroundColor: "#C8E6C9", color: "#2E7D32" };
      case "completed":
        return { backgroundColor: "#BBDEFB", color: "#0D47A1" };
      case "cancelled":
        return { backgroundColor: "#FFCDD2", color: "#C62828" };
      default:
        return { backgroundColor: "#E0E0E0", color: "#424242" };
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return { backgroundColor: "#C8E6C9", color: "#2E7D32" };
      case "unpaid":
        return { backgroundColor: "#FFF3E0", color: "#E65100" };
      case "refunded":
        return { backgroundColor: "#E1BEE7", color: "#6A1B9A" };
      default:
        return { backgroundColor: "#E0E0E0", color: "#424242" };
    }
  };

  const statusColors = getStatusColor(rental.status);
  const paymentColors = getPaymentStatusColor(rental.payment_status);

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(rental)}>
      {/* Header with suit name as title */}
      <View style={styles.header}>
        <Text style={styles.suitName} numberOfLines={1}>
          {rental.suit?.name || "Suit"}
        </Text>
        <View style={[styles.statusBadge, statusColors]}>
          <Text style={[styles.statusText, { color: statusColors.color }]}>
            {rental.status?.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Details */}
      <View style={styles.details}>
        <View style={styles.row}>
          <Text style={styles.label}>Start Date:</Text>
          <Text style={styles.value}>
            {new Date(rental.start_date).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Total:</Text>
          <Text style={[styles.value, styles.totalPrice]}>
            {rental.total_price} MAD
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Payment:</Text>
          <View style={[styles.paymentBadge, paymentColors]}>
            <Text style={[styles.statusText, { color: paymentColors.color }]}>
              {rental.payment_status?.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  suitName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  details: {
    gap: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  value: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },
  totalPrice: {
    color: "#007AFF",
    fontSize: 15,
  },
  paymentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
});