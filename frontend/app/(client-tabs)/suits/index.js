import { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import SearchSuitBarClient from '../../../components/Client/Suit/SearchSuitBarClient';
import SuitCardClient from '../../../components/Client/Suit/SuitCardClient';
import { getSuits, SERVER_BASE_URL } from '../../api/api';

export default function SuitsList() {
  const [suits, setSuits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    size: '',
    gender: '',
    city: '',
    minPrice: '',
    maxPrice: ''
  });
  const router = useRouter();

  const fetchSuits = async () => {
    try {
      if (!global.userToken) {
        router.replace('/auth/login');
        return;
      }

      const params = {
        ...(searchText ? { search: searchText } : {}),
        ...Object.fromEntries(Object.entries(filters).filter(([, v]) => !!v)),
      };

      console.log('Sending params to API:', params);
      const data = await getSuits(params);
      setSuits(data?.data || data);
    } catch (error) {
      console.error('Error fetching suits:', error);
      Alert.alert('Error', 'Failed to load suits');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSuits();
  }, [filters, searchText]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchSuits();
  };

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading suits...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Suits</Text>
      
      <SearchSuitBarClient 
        onFiltersChange={handleFiltersChange}
        onSearch={handleSearch}
      />

      <FlatList
        data={suits}
        renderItem={({ item }) => (
          <SuitCardClient 
            suit={item}
            onPress={() => router.push(`/suits/${item.id}`)}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No suits found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your filters or search</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  listContainer: {
    padding: 15,
  },
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
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
});

