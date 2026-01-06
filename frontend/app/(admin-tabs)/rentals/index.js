import { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { useRouter } from 'expo-router';
import { getAdminRentals } from "../../api/api";
import ReservationCardAdminInfos from "../../../components/Admin/Reservation/ReservationCardAdminInfos";
import ReservationCardAdmin from "../../../components/Admin/Reservation/ReservationCardAdmin";

export default function Rentals() {
  const [rentals, setRentals] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showReservationInfo, setShowReservationInfo] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        if (!global.userToken || global.user?.role !== 'admin') {
          router.replace('/auth/login');
          return;
        }
        const res = await getAdminRentals();

        console.log("📌 RENTALS RESPONSE:", res);

        setRentals(Array.isArray(res) ? res : res?.rentals || res?.data || []);
        // setRentals(res);
      } catch (e) {
        console.log("API RENTAL ERROR:", e.response?.data || e.message);
      }
    };

    fetchRentals();
  }, []);

  const handleReservationPress = (reservation) => {
    setSelectedReservation(reservation);
    setShowReservationInfo(true);
  };

  const handleCloseReservationInfo = () => {
    setShowReservationInfo(false);
    setSelectedReservation(null);
  };

  const handleApproveReservation = () => {
    console.log('Approve reservation:', selectedReservation);
    // TODO: Call API to approve reservation
  };

  const handleRejectReservation = () => {
    console.log('Reject reservation:', selectedReservation);
    // TODO: Call API to reject reservation
  };

  const handleContactClient = () => {
    console.log('Contact client:', selectedReservation);
    // TODO: Open contact modal or navigate to contact screen
  };

  return (
    <ScrollView style={styles.container}>
      {/* <Text style={styles.heading}>📌 Rentals List</Text> */}

      <TouchableOpacity style={styles.createButton} onPress={() => router.push('/rentals/createReservation')}>
        <Text style={styles.createButtonText}>+ Create Reservation</Text>
      </TouchableOpacity>

      {rentals.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No reservation records</Text>
          <Text style={styles.emptySubtitle}>Create your first reservation to get started</Text>
          <TouchableOpacity style={styles.emptyCreateButton} onPress={() => router.push('/rentals/createReservation')}>
            <Text style={styles.emptyCreateButtonText}>+ Create Reservation</Text>
          </TouchableOpacity>
        </View>
      )}

      {rentals.map((rental) => (
        <ReservationCardAdmin
          key={rental.id}
          rental={rental}
          onPress={handleReservationPress}
        />
      ))}
      
      {/* Reservation Info Modal */}
      <Modal
        visible={showReservationInfo}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        {selectedReservation && (
          <ReservationCardAdminInfos
            reservation={selectedReservation}
            onClose={handleCloseReservationInfo}
            onApprove={handleApproveReservation}
            onReject={handleRejectReservation}
            onContact={handleContactClient}
          />
        )}
      </Modal>
    </ScrollView>
  );
}

/* -------- STYLES -------- */

const styles = StyleSheet.create({
  container: { padding: 15, backgroundColor: "#f5f5f5" },
  heading: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  empty: { color: "#999", textAlign: "center" },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  emptyCreateButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 10,
  },
  emptyCreateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  createButton: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

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

