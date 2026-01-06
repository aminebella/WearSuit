import { useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity,
  ScrollView,
  Alert 
} from 'react-native';
import { SERVER_BASE_URL } from "../../../app/api/api";

export default function SuitCardInfoAdmin({ suit, onClose, onUpdate, onDeactivate, onReserve }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleUpdate = () => {
    Alert.alert(
      "Update Suit",
      "Do you want to update this suit?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Update", onPress: onUpdate }
      ]
    );
  };

  const handleDeactivate = () => {
    const currentStatus = suit?.status;
    const canToggle = currentStatus === 'available' || currentStatus === 'unavailable';
    if (!canToggle) {
      Alert.alert('Not allowed', 'This suit status cannot be changed from here.');
      return;
    }

    const nextLabel = currentStatus === 'available' ? 'Make Unavailable' : 'Make Available';

    Alert.alert(
      nextLabel,
      `Do you want to ${nextLabel.toLowerCase()}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: nextLabel, style: "destructive", onPress: onDeactivate }
      ]
    );
  };

  const handleReserve = () => {
    Alert.alert(
      "Reserve Suit",
      "Do you want to reserve this suit?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Reserve", onPress: onReserve }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header with close button */}
      <View style={styles.header}>
        <Text style={styles.title}>{suit.name}</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>×</Text>
        </TouchableOpacity>
      </View>

      {/* Main image */}
      {suit.images?.length > 0 && (
        <Image 
          source={{ uri: `${SERVER_BASE_URL}/storage/${suit.images[0].image_path}` }}
          style={styles.mainImage}
        />
      )}

      {/* Suit Details */}
      <View style={styles.detailsSection}>
        <Text style={styles.description}>{suit.description}</Text>
        
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Size:</Text>
            <Text style={styles.detailValue}>{suit.size}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Color:</Text>
            <Text style={styles.detailValue}>{suit.color}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Gender:</Text>
            <Text style={styles.detailValue}>{suit.gender}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Category:</Text>
            <Text style={styles.detailValue}>{suit.category}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Price/Day:</Text>
            <Text style={styles.detailValue}>{suit.price_per_day} MAD</Text>
          </View>
        </View>

        {/* Status Badge */}
        <View style={styles.statusContainer}>
          <Text style={[
            styles.status,
            suit.status === "available" ? styles.available : styles.unavailable
          ]}>
            {suit.status.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionSection}>
        <TouchableOpacity style={styles.actionButton} onPress={handleUpdate}>
          <Text style={styles.actionButtonText}>Modify</Text>
        </TouchableOpacity>

        {suit.status !== 'unavailable' && (
          <TouchableOpacity style={styles.actionButton} onPress={handleReserve}>
            <Text style={styles.actionButtonText}>Reserve</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={[
            styles.actionButton,
            suit.status === 'available' ? styles.makeUnavailableButton : styles.makeAvailableButton,
          ]} 
          onPress={handleDeactivate}
        >
          <Text style={[styles.actionButtonText, styles.availabilityButtonText]}>
            {suit.status === 'available' ? 'Make Unavailable' : 'Make Available'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Additional Images */}
      {suit.images?.length > 1 && (
        <View style={styles.additionalImagesSection}>
          <Text style={styles.sectionTitle}>Additional Images</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
            {suit.images.slice(1).map((image, index) => (
              <Image 
                key={image.id}
                source={{ uri: `${SERVER_BASE_URL}/storage/${image.image_path}` }}
                style={styles.additionalImage}
              />
            ))}
          </ScrollView>
        </View>
      )}
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
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
  },
  mainImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#f0f0f0',
    marginBottom: 20,
  },
  detailsSection: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    lineHeight: 24,
  },
  detailsGrid: {
    gap: 15,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  detailValue: {
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
  },
  statusContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  available: {
    backgroundColor: '#C8E6C9',
    color: '#2E7D32',
  },
  unavailable: {
    backgroundColor: '#FFCDD2',
    color: '#C62828',
  },
  actionSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  availabilityButtonText: {
    fontSize: 14,
  },
  makeUnavailableButton: {
    backgroundColor: '#ff3b30',
  },
  makeAvailableButton: {
    backgroundColor: '#34C759',
  },
  additionalImagesSection: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  imageScroll: {
    flexDirection: 'row',
  },
  additionalImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: '#f0f0f0',
  },
});
