// export { default } from '../../my-rentals';
import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Alert 
} from 'react-native';
import { useRouter } from 'expo-router';
import { getMyRentals } from '../../api/api';
import {renderRentalCard} from '../../../components/Client/Reservation/ReservationCardClient';

export default function MyRentals() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!global.userToken) {
      Alert.alert('Access Denied', 'Please login to view your rentals');
      router.replace('/auth/login');
      return;
    }
    fetchMyRentals();
  }, []);

  const fetchMyRentals = async () => {
    try {
      const data = await getMyRentals();
      setRentals(data?.data || data);
    } catch (error) {
      console.error('Error fetching my rentals:', error);
      Alert.alert('Error', 'Failed to load your rentals');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchMyRentals();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading your rentals...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Rentals</Text>
      </View>

      <FlatList
        data={rentals}
        renderItem={({ item }) => {
          const CardComponent = renderRentalCard({ item });
          return CardComponent;
        }}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>You don't have any rentals yet</Text>
            <TouchableOpacity 
              style={styles.browseButton} 
              onPress={() => router.replace('/(client-tabs)/suits')}
            >
              <Text style={styles.browseButtonText}>Browse Suits</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 15,
  },
  rentalCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  rentalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  rentalId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    textTransform: 'uppercase',
  },
  active: {
    backgroundColor: '#e8f5e8',
    color: '#4caf50',
  },
  completed: {
    backgroundColor: '#e3f2fd',
    color: '#2196f3',
  },
  cancelled: {
    backgroundColor: '#ffebee',
    color: '#f44336',
  },
  rentalInfo: {
    flex: 1,
  },
  suitName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  shopName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  rentalPrice: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
    marginBottom: 5,
  },
  rentalDates: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  contactInfo: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  contactLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  contactPhone: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  notes: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  browseButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

