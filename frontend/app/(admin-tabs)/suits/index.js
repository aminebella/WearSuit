import { useState, useCallback } from "react";
import { 
  Text, 
  View, 
  ScrollView, 
  Image, 
  StyleSheet,
  Modal,
  TouchableOpacity 
} from "react-native";

import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { getAdminSuits, updateAdminSuit, SERVER_BASE_URL } from "../../api/api";
import SuitCardAdmin from "../../../components/Admin/Suit/SuitCardAdmin";
import SuitCardInfoAdmin from "../../../components/Admin/Suit/SuitCardInfoAdmin";

export default function Suits() {
  const [suits, setSuits] = useState([]);
  const [selectedSuit, setSelectedSuit] = useState(null);
  const [showSuitInfo, setShowSuitInfo] = useState(false);
  const router = useRouter();

  const fetchSuits = useCallback(async () => {
    try {
      if (!global.userToken || global.user?.role !== 'admin') {
        router.replace('/auth/login');
        return;
      }

      const suitsData = await getAdminSuits();
      setSuits(suitsData?.data || suitsData);
    } catch (e) {
      console.log("API ERROR:", e.response?.data || e.message);
    }
  }, [router]);

  useFocusEffect(
    useCallback(() => {
      fetchSuits();
    }, [fetchSuits])
  );

  const handleSuitPress = (suit) => {
    setSelectedSuit(suit);
    setShowSuitInfo(true);
  };

  const handleCloseSuitInfo = () => {
    setShowSuitInfo(false);
    setSelectedSuit(null);
  };

  const handleUpdateSuit = () => {
    if (!selectedSuit) return;
    setShowSuitInfo(false);
    router.push(`/suits/${selectedSuit.id}?edit=1`);
  };

  const handleDeactivateSuit = () => {
    if (!selectedSuit) return;

    const currentStatus = selectedSuit.status;
    if (currentStatus !== 'available' && currentStatus !== 'unavailable') {
      console.log('Unsupported status for toggle:', currentStatus);
      return;
    }

    const nextStatus = currentStatus === 'available' ? 'unavailable' : 'available';

    updateAdminSuit(selectedSuit.id, { status: nextStatus })
      .then((updatedSuit) => {
        setSelectedSuit(updatedSuit);
        setSuits((prev) => prev.map((s) => (s.id === updatedSuit.id ? updatedSuit : s)));
      })
      .catch((e) => {
        console.log("API ERROR:", e.response?.data || e.message);
      });
  };

  const handleReserveSuit = () => {
    if (!selectedSuit) return;
    setShowSuitInfo(false);
    router.push(`/rentals/CreateReservationForSuit?suitId=${selectedSuit.id}`);
  };

  return (
    <ScrollView style={styles.container}>
      {/* <Text>📌 Suits List Page</Text> */}
      <Text style={styles.title}>My Suits</Text>
      <TouchableOpacity style={styles.addButton} onPress={() => router.push('/suits/add')}>
        <Text style={styles.addButtonText}>+ Add New Suit</Text>
      </TouchableOpacity>

      {suits.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>You have 0 suits</Text>
          <Text style={styles.emptySubtitle}>Create your first suit to get started</Text>
          <TouchableOpacity style={styles.emptyCreateButton} onPress={() => router.push('/suits/add')}>
            <Text style={styles.emptyCreateButtonText}>+ Create Suit</Text>
          </TouchableOpacity>
        </View>
      )}

      {suits.map((suit) => (
        <SuitCardAdmin 
          key={suit.id} 
          suit={suit} 
          onPress={() => handleSuitPress(suit)}
        />
      ))}
      
      {/* Suit Info Modal */}
      <Modal
        visible={showSuitInfo}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        {selectedSuit && (
          <SuitCardInfoAdmin
            suit={selectedSuit}
            onClose={handleCloseSuitInfo}
            onUpdate={handleUpdateSuit}
            onDeactivate={handleDeactivateSuit}
            onReserve={handleReserveSuit}
          />
        )}
      </Modal>
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
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
  addButton: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, marginBottom: 20 },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: '600', textAlign: 'center' },
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
