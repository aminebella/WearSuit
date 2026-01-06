import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  StyleSheet,
  Alert,
  Linking,
  ActivityIndicator,
  Dimensions 
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getRentalDetails } from '../api/api';

const { width } = Dimensions.get('window');

export default function RentalDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [rental, setRental] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRentalDetails();
  }, [id]);

  const fetchRentalDetails = async () => {
    try {
      const data = await getRentalDetails(id);
      setRental(data);
    } catch (error) {
      console.error('Error fetching rental details:', error);
      Alert.alert('Error', 'Failed to load rental details');
    } finally {
      setLoading(false);
    }
  };

  const contactAdmin = () => {
    if (!rental?.suit?.admin?.phone) {
      Alert.alert("No Phone", "Shop phone number is not available.");
      return;
    }
    
    Alert.alert(
      'Contact Admin',
      `Call ${rental.suit.admin.shop_name} at ${rental.suit.admin.phone}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => Linking.openURL(`tel:${rental.suit.admin.phone}`) }
      ]
    );
  };

  const renderCalendar = () => {
    if (!rental?.days || rental.days.length === 0) {
      return <Text style={styles.noDaysText}>No rental days available</Text>;
    }

    const daysByMonth = rental.days
      .map(d => new Date(d.day))
      .sort((a, b) => a - b)
      .reduce((acc, date) => {
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(date);
        return acc;
      }, {});

    return Object.entries(daysByMonth).map(([monthKey, daysInMonth]) => {
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
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading rental details...</Text>
      </View>
    );
  }

  if (!rental) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Rental not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Reservation Details</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Reservation Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reservation Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Reservation ID:</Text>
          <Text style={styles.value}>#{rental.id}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Status:</Text>
          <Text style={[styles.status, styles[rental.status]]}>{rental.status}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Start Date:</Text>
          <Text style={styles.value}>
            {rental.start_date ? new Date(rental.start_date).toLocaleDateString() : 'Not set'}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Total Price:</Text>
          <Text style={styles.price}>${rental.total_price}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Payment Status:</Text>
          <Text style={[styles.paymentStatus, styles[rental.payment_status || 'pending']]}>
            {rental.payment_status || 'Pending'}
          </Text>
        </View>
        {rental.notes && (
          <View style={styles.notesContainer}>
            <Text style={styles.label}>Notes:</Text>
            <Text style={styles.notesText}>{rental.notes}</Text>
          </View>
        )}
      </View>

      {/* Suit Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Suit Information</Text>
        <View style={styles.suitContainer}>
          {rental.suit?.images?.[0] && (
            <Image 
              source={{ 
                uri: `http://localhost:8000/storage/${rental.suit.images[0].image_path}`
              }}
              style={styles.suitImage}
            />
          )}
          <View style={styles.suitDetails}>
            <Text style={styles.suitName}>{rental.suit?.name || 'Suit not available'}</Text>
            <Text style={styles.suitInfo}>Category: {rental.suit?.category || 'N/A'}</Text>
            <Text style={styles.suitInfo}>Size: {rental.suit?.size || 'N/A'}</Text>
            <Text style={styles.suitInfo}>Gender: {rental.suit?.gender || 'N/A'}</Text>
            <Text style={styles.suitInfo}>Color: {rental.suit?.color || 'N/A'}</Text>
            <Text style={styles.suitPrice}>${rental.suit?.price_per_day}/day</Text>
          </View>
        </View>
      </View>

      {/* Admin/Shop Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shop Information</Text>
        <View style={styles.adminInfo}>
          <Text style={styles.shopName}>{rental.suit?.admin?.shop_name || 'Shop not available'}</Text>
          <Text style={styles.adminName}>Owner: {rental.suit?.admin?.first_name || 'N/A'} {rental.suit?.admin?.first_name || 'N/A'}</Text>
          <Text style={styles.adminCity}>City: {rental.suit?.admin?.city || 'N/A'}</Text>
          {rental.suit?.admin?.address && (
            <Text style={styles.adminAddress}>Address: {rental.suit.admin.address}</Text>
          )}
          <Text style={styles.adminPhone}>Phone: {rental.suit?.admin?.phone || 'N/A'}</Text>
        </View>
        <TouchableOpacity style={styles.contactButton} onPress={contactAdmin}>
          <Text style={styles.contactButtonText}>Contact Shop</Text>
        </TouchableOpacity>
      </View>

      {/* Rental Days Calendar */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rental Days</Text>
        <Text style={styles.calendarSubtitle}>
          Green dates are your reserved rental days
        </Text>
        {renderCalendar()}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 50,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 15,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
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
  active: {
    backgroundColor: '#cce5ff',
    color: '#004085',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    flex: 2,
    textAlign: 'right',
  },
  paymentStatus: {
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
  refunded: {
    backgroundColor: '#e2e3e5',
    color: '#383d41',
  },
  notesContainer: {
    marginTop: 10,
  },
  notesText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 5,
  },
  suitContainer: {
    flexDirection: 'row',
  },
  suitImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 15,
  },
  suitDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  suitName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  suitInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  suitPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  adminInfo: {
    marginBottom: 15,
  },
  shopName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  adminName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  adminCity: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  adminAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  adminPhone: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
    marginBottom: 5,
  },
  contactButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  calendarSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  noDaysText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 20,
  },
  monthBlock: {
    marginBottom: 20,
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  weekdaysRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  weekdayLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#888',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
  },
  dayNumber: {
    fontSize: 12,
    color: '#333',
  },
  reservedDay: {
    backgroundColor: '#4caf50',
    borderColor: '#388e3c',
  },
  reservedDayNumber: {
    color: '#fff',
    fontWeight: '700',
  },
});
