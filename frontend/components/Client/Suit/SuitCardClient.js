import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  StyleSheet 
} from 'react-native';

export default function SuitCard({ suit, onPress }) {
  return (
    <TouchableOpacity style={styles.suitCard} onPress={onPress}>
      <Image 
        source={{ 
          uri: suit.images?.[0]?.image_path 
            ? `http://localhost:8000/storage/${suit.images[0].image_path}`
            : 'https://via.placeholder.com/150' 
        }}
        style={styles.suitImage}
      />
      <View style={styles.suitInfo}>
        <Text style={styles.suitName} numberOfLines={2}>{suit.name}</Text>
        <Text style={styles.suitPrice}>${suit.price_per_day}/day</Text>
        <Text style={styles.suitCategory}>{suit.category} • {suit.size}</Text>
        <Text style={styles.shopName}>{suit.admin?.shop_name}</Text>
        <View style={styles.badgeContainer}>
          <Text style={styles.genderBadge}>{suit.gender}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  suitCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  suitImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  suitInfo: {
    padding: 15,
  },
  suitName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  suitPrice: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
    marginBottom: 5,
  },
  suitCategory: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  shopName: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  badgeContainer: {
    flexDirection: 'row',
  },
  genderBadge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    color: '#666',
    textTransform: 'uppercase',
  },
});