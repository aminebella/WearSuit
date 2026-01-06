import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet 
} from 'react-native';
import { useRouter } from 'expo-router';

export const renderRentalCard = ({ item }) => {
  const router = useRouter();
  
  return (
    <TouchableOpacity 
      style={styles.rentalCard}
      onPress={() => router.push(`/rentals/${item.id}`)}
    >
      <View style={styles.rentalHeader}>
        <Text style={styles.rentalId}>Rental #{item.id}</Text>
        <Text style={[styles.status, styles[item.status]]}>{item.status}</Text>
      </View>
      
      <View style={styles.rentalInfo}>
        <Text style={styles.suitName}>{item.suit?.name || 'Suit not available'}</Text>
        <Text style={styles.shopName}>Shop: {item.suit?.admin?.shop_name || 'Shop not available'}</Text>
        <Text style={styles.rentalPrice}>${item.total_price}</Text>
        <Text style={styles.rentalDates}>
          Start: {item.start_date ? new Date(item.start_date).toLocaleDateString() : 'Date not set'}
        </Text>
        <View style={styles.paymentStatus}>
          <Text style={styles.paymentLabel}>Payment:</Text>
          <Text style={[styles.paymentStatusText, styles[item.payment_status || 'pending']]}>
            {item.payment_status || 'Pending'}
          </Text>
        </View>
        <View style={styles.contactInfo}>
          <Text style={styles.contactLabel}>Contact Shop:</Text>
          <Text style={styles.contactPhone}>{item.suit?.admin?.phone || 'No phone'}</Text>
        </View>
        {item.notes && (
          <Text style={styles.notes} numberOfLines={2}>
            Notes: {item.notes}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
  },
  pending: {
    backgroundColor: '#fff3cd',
    color: '#856404',
  },
  confirmed: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  cancelled: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
  completed: {
    backgroundColor: '#d1ecf1',
    color: '#0c5460',
  },
  rentalInfo: {
    marginBottom: 5,
  },
  suitName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  shopName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  rentalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 3,
  },
  rentalDates: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  paymentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  paymentLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 5,
  },
  paymentStatusText: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  paid: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  unpaid: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
  pending: {
    backgroundColor: '#fff3cd',
    color: '#856404',
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  contactLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 5,
  },
  contactPhone: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  notes: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 5,
  },
});