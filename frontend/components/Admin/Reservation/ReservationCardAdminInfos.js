import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
} from "react-native";

export default function ReservationCardAdminInfos({ reservation, onClose }) {
  const [showDays, setShowDays] = useState(false);
  const [updating, setUpdating] = useState(false);

  const handleContactClient = () => {
    const phone = reservation.user?.phone;
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    } else {
      Alert.alert("No Phone", "Client phone number is not available.");
    }
  };

  const handleEditReservation = () => {
    Alert.alert("Edit Reservation", "Feature to edit reserved days will be implemented.");
  };

  const handleTogglePayment = async () => {
    const newStatus = reservation.payment_status === "paid" ? "unpaid" : "paid";
    Alert.alert(
      "Update Payment Status",
      `Change payment status to ${newStatus}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Update",
          onPress: async () => {
            // TODO: API call to update payment_status
            Alert.alert("Updated", `Payment status set to ${newStatus}`);
          },
        },
      ]
    );
  };

  const handleCancelReservation = () => {
    Alert.alert(
      "Cancel Reservation",
      "This will set status to cancelled, set total to 0, and delete reserved days. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          style: "destructive",
          onPress: async () => {
            // TODO: API call to cancel reservation (status: cancelled, total_price: 0, delete rental_days)
            Alert.alert("Cancelled", "Reservation has been cancelled.");
          },
        },
      ]
    );
  };

  const handleCompleteReservation = () => {
    Alert.alert(
      "Complete Reservation",
      "Mark this reservation as completed? Total price and reserved days will be kept for records.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Complete",
          onPress: async () => {
            // TODO: API call to complete reservation (status: completed, keep total_price, keep rental_days)
            Alert.alert("Completed", "Reservation has been marked as completed.");
          },
        },
      ]
    );
  };
  const getStatusColor = (status) => {
    switch (status) {
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
    switch (status) {
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

  const statusColors = getStatusColor(reservation.status);

  return (
    <ScrollView style={styles.container}>
      {/* Header with close button */}
      <View style={styles.header}>
        <Text style={styles.title}>Reservation #{reservation.id}</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>×</Text>
        </TouchableOpacity>
      </View>

      {/* Suit Information */}
      {reservation.suit && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suit Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{reservation.suit.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Size:</Text>
            <Text style={styles.value}>{reservation.suit.size}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Color:</Text>
            <Text style={styles.value}>{reservation.suit.color}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Price/Day:</Text>
            <Text style={styles.value}>{reservation.suit.price_per_day} MAD</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Category:</Text>
            <Text style={styles.value}>{reservation.suit.category}</Text>
          </View>
        </View>
      )}

      {/* Client Information */}
      {reservation.user && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Client Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>
              {reservation.user.first_name} {reservation.user.last_name}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{reservation.user.email}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{reservation.user.phone}</Text>
          </View>
          {reservation.user.city && (
            <View style={styles.row}>
              <Text style={styles.label}>City:</Text>
              <Text style={styles.value}>{reservation.user.city}</Text>
            </View>
          )}
          {reservation.user.address && (
            <View style={styles.row}>
              <Text style={styles.label}>Address:</Text>
              <Text style={styles.value}>{reservation.user.address}</Text>
            </View>
          )}
        </View>
      )}

      {/* Reservation Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reservation Details</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Start Date:</Text>
          <Text style={styles.value}>
            {new Date(reservation.start_date).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Total Price:</Text>
          <Text style={styles.value}>{reservation.total_price} MAD</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Status:</Text>
          <View style={[styles.statusBadge, statusColors]}>
            <Text style={[styles.statusText, { color: statusColors.color }]}>
              {reservation.status.toUpperCase()}
            </Text>
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Payment Status:</Text>
          <View
            style={[
              styles.statusBadge,
              getPaymentStatusColor(reservation.payment_status),
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: getPaymentStatusColor(reservation.payment_status).color },
              ]}
            >
              {reservation.payment_status?.toUpperCase()}
            </Text>
          </View>
        </View>
        {reservation.notes && (
          <View style={styles.row}>
            <Text style={styles.label}>Notes:</Text>
            <Text style={styles.value}>{reservation.notes}</Text>
          </View>
        )}
      </View>

      {/* Reserved Days Calendar */}
      {Array.isArray(reservation.days) && reservation.days.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reserved Days Calendar</Text>
          <Text style={styles.daysCount}>
            Number of days reserved: {reservation.days.length}
          </Text>
          <View style={styles.calendarContainer}>
            {Object.entries(
              reservation.days
                .map((d) => new Date(d.day))
                .sort((a, b) => a - b)
                .reduce((acc, date) => {
                  const key = `${date.getFullYear()}-${date.getMonth()}`;
                  if (!acc[key]) acc[key] = [];
                  acc[key].push(date);
                  return acc;
                }, {})
            ).map(([monthKey, daysInMonth]) => {
                const firstDay = daysInMonth[0];
                const year = firstDay.getFullYear();
                const month = firstDay.getMonth();
                const monthName = firstDay.toLocaleString('default', { month: 'long', year: 'numeric' });
                const firstWeekDay = new Date(year, month, 1).getDay();
                const daysInMonthCount = new Date(year, month + 1, 0).getDate();
                const reservedSet = new Set(daysInMonth.map(d => d.getDate()));

                const cells = [];
                for (let i = 0; i < firstWeekDay; i++) cells.push(null);
                for (let d = 1; d <= daysInMonthCount; d++) cells.push(d);

                return (
                  <View key={monthKey} style={styles.monthBlock}>
                    <Text style={styles.monthTitle}>{monthName}</Text>
                    <View style={styles.weekdaysRow}>
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((w, i) => (
                        <Text key={i} style={styles.weekdayLabel}>{w}</Text>
                      ))}
                    </View>
                    <View style={styles.calendarGrid}>
                      {cells.map((day, idx) => {
                        if (!day) return <View key={`empty-${idx}`} style={styles.dayCell} />;
                        const isReserved = reservedSet.has(day);
                        return (
                          <View
                            key={`day-${day}`}
                            style={[
                              styles.dayCell,
                              isReserved && styles.reservedDay,
                            ]}
                          >
                            <Text
                              style={[
                                styles.dayNumber,
                                isReserved && styles.reservedDayNumber,
                              ]}
                            >
                              {day}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                );
              })}
          </View>
        </View>
      ) : (
        <View style={[styles.section, { borderWidth: 1, borderColor: 'orange' }]}>
          <Text style={styles.sectionTitle}>Reserved Days Calendar</Text>
          <Text style={{ color: '#666' }}>No reserved days found.</Text>
        </View>
      )}

      Action Buttons
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={[styles.actionButton, styles.contactButton]} onPress={handleContactClient}>
          <Text style={styles.actionButtonText}>Contact Client</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.editButton]} onPress={handleEditReservation}>
          <Text style={styles.actionButtonText}>Edit Reservation</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.paymentButton]} onPress={handleTogglePayment}>
          <Text style={styles.actionButtonText}>
            Mark as {reservation.payment_status === "paid" ? "Unpaid" : "Paid"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.cancelButton]}
          onPress={handleCancelReservation}
        >
          <Text style={styles.actionButtonText}>Cancel Reservation</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.completeButton]}
          onPress={handleCompleteReservation}
        >
          <Text style={styles.actionButtonText}>Complete Reservation</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 24,
    color: "#666",
  },
  section: {
    backgroundColor: "#fff",
    marginVertical: 10,
    marginHorizontal: 15,
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    flex: 1,
  },
  value: {
    fontSize: 16,
    color: "#333",
    flex: 2,
    textAlign: "right",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    flexWrap: "wrap",
    gap: 10,
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 120,
    alignItems: "center",
  },
  contactButton: {
    backgroundColor: "#007AFF",
  },
  editButton: {
    backgroundColor: "#8E8E93",
  },
  paymentButton: {
    backgroundColor: "#FF9500",
  },
  cancelButton: {
    backgroundColor: "#FF3B30",
  },
  completeButton: {
    backgroundColor: "#34C759",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  daysCount: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
    fontWeight: "500",
  },
  toggleButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  toggleButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  calendarContainer: {
    marginTop: 10,
  },
  monthBlock: {
    marginBottom: 20,
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  weekdaysRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  weekdayLabel: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
    color: "#888",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: "14.28%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "#e0e0e0",
  },
  dayNumber: {
    fontSize: 12,
    color: "#333",
  },
  reservedDay: {
    backgroundColor: "#007AFF",
    borderColor: "#0056b3",
  },
  reservedDayNumber: {
    color: "#fff",
    fontWeight: "700",
  },
});
