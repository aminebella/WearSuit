import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  TextInput,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Dimensions,
  Linking 
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { getSuitAvailability, getSuitDetails, updateAdminSuit, SERVER_BASE_URL } from '../api/api';
const { width } = Dimensions.get('window');

const SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];
const GENDERS = ['men', 'women', 'girls', 'boys'];
const CATEGORIES = ['wedding', 'traditional', 'party', 'formal', 'other'];

export default function SuitDetails() {
  const { id, edit } = useLocalSearchParams();
  const [suit, setSuit] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    size: 'M',
    color: '',
    gender: 'men',
    category: 'other',
    price_per_day: '',
  });
  const router = useRouter();

  const isEditMode = String(edit) === '1';

  useEffect(() => {
    fetchSuitDetails();
    fetchAvailability();
  }, [id]);

  const fetchSuitDetails = async () => {
    try {
      if (!global.userToken) {
        router.replace('/auth/login');
        return;
      }

      const data = await getSuitDetails(id);
      setSuit(data);

      setFormData({
        name: data?.name ?? '',
        description: data?.description ?? '',
        size: data?.size ?? 'M',
        color: data?.color ?? '',
        gender: data?.gender ?? 'men',
        category: data?.category ?? 'other',
        price_per_day: data?.price_per_day != null ? String(data.price_per_day) : '',
      });
    } catch (error) {
      console.error('Error fetching suit details:', error);
      Alert.alert('Error', 'Failed to load suit details');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!String(formData.name).trim()) newErrors.name = 'Name is required';
    if (!String(formData.description).trim()) newErrors.description = 'Description is required';
    if (!String(formData.color).trim()) newErrors.color = 'Color is required';

    if (!String(formData.price_per_day).trim()) {
      newErrors.price_per_day = 'Price per day is required';
    } else if (isNaN(formData.price_per_day) || parseFloat(formData.price_per_day) <= 0) {
      newErrors.price_per_day = 'Price must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    if (!global.userToken || global.user?.role !== 'admin') {
      router.replace('/auth/login');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        size: formData.size,
        color: formData.color.trim(),
        gender: formData.gender,
        category: formData.category,
        price_per_day: parseFloat(formData.price_per_day),
      };

      await updateAdminSuit(id, payload);
      Alert.alert('Success', 'Suit updated successfully!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error('Error updating suit:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to update suit');
    } finally {
      setSaving(false);
    }
  };

  const fetchAvailability = async () => {
    try {
      if (!global.userToken) {
        return;
      }

      const data = await getSuitAvailability(id);
      setAvailability(data?.unavailable_days || []);
    } catch (error) {
      console.error('Error fetching availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const contactAdmin = () => {
    if (!suit?.admin?.phone) {
      Alert.alert("No Phone", "Shop phone number is not available.");
      return;
    }
    
    Alert.alert(
      'Contact Admin',
      `Call ${suit.admin.shop_name} at ${suit.admin.phone} to make a reservation?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => Linking.openURL(`tel:${suit.admin.phone}`) }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading suit details...</Text>
      </View>
    );
  }

  if (!suit) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.notFoundText}>Suit not found</Text>
      </View>
    );
  }

  if (isEditMode) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.editHeader}>
          <TouchableOpacity onPress={() => router.back()} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.editTitle}>Modify Suit</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton} disabled={saving}>
            <Text style={styles.saveButtonText}>{saving ? 'Saving...' : 'Save'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.field}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              value={formData.name}
              onChangeText={(v) => handleInputChange('name', v)}
              placeholder="Enter suit name"
              maxLength={255}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea, errors.description && styles.inputError]}
              value={formData.description}
              onChangeText={(v) => handleInputChange('description', v)}
              placeholder="Enter description"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Size</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.size}
                onValueChange={(v) => handleInputChange('size', v)}
                style={styles.picker}
              >
                {SIZES.map((s) => (
                  <Picker.Item key={s} label={s} value={s} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Color</Text>
            <TextInput
              style={[styles.input, errors.color && styles.inputError]}
              value={formData.color}
              onChangeText={(v) => handleInputChange('color', v)}
              placeholder="Enter color"
              maxLength={100}
            />
            {errors.color && <Text style={styles.errorText}>{errors.color}</Text>}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.gender}
                onValueChange={(v) => handleInputChange('gender', v)}
                style={styles.picker}
              >
                {GENDERS.map((g) => (
                  <Picker.Item key={g} label={g} value={g} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.category}
                onValueChange={(v) => handleInputChange('category', v)}
                style={styles.picker}
              >
                {CATEGORIES.map((c) => (
                  <Picker.Item key={c} label={c} value={c} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Price per Day</Text>
            <TextInput
              style={[styles.input, errors.price_per_day && styles.inputError]}
              value={formData.price_per_day}
              onChangeText={(v) => handleInputChange('price_per_day', v)}
              placeholder="Enter price"
              keyboardType="numeric"
            />
            {errors.price_per_day && <Text style={styles.errorText}>{errors.price_per_day}</Text>}
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Images */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {suit.images?.length > 0 ? (
          suit.images.map((image, index) => (
            <Image
              key={index}
              source={{ uri: `${SERVER_BASE_URL}/storage/${image.image_path}` }}
              style={styles.suitImage}
            />
          ))
        ) : (
          <Image
            source={{ uri: 'https://via.placeholder.com/300x400' }}
            style={styles.suitImage}
          />
        )}
      </ScrollView>

      {/* Suit Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.suitName}>{suit.name}</Text>
        <Text style={styles.suitPrice}>${suit.price_per_day}/day</Text>
        
        <View style={styles.detailsRow}>
          <Text style={styles.detailLabel}>Category:</Text>
          <Text style={styles.detailValue}>{suit.category}</Text>
        </View>
        
        <View style={styles.detailsRow}>
          <Text style={styles.detailLabel}>Size:</Text>
          <Text style={styles.detailValue}>{suit.size}</Text>
        </View>
        
        <View style={styles.detailsRow}>
          <Text style={styles.detailLabel}>Gender:</Text>
          <Text style={styles.detailValue}>{suit.gender}</Text>
        </View>
        
        <View style={styles.detailsRow}>
          <Text style={styles.detailLabel}>Color:</Text>
          <Text style={styles.detailValue}>{suit.color}</Text>
        </View>

        <Text style={styles.description}>{suit.description}</Text>
      </View>

      {/* Admin Info */}
      <View style={styles.adminContainer}>
        <Text style={styles.sectionTitle}>Shop Information</Text>
        <View style={styles.adminInfo}>
          <Text style={styles.shopName}>{suit.admin?.shop_name}</Text>
          <Text style={styles.adminCity}>{suit.admin?.city}</Text>
          <Text style={styles.adminPhone}>{suit.admin?.phone}</Text>
        </View>
        <TouchableOpacity style={styles.contactButton} onPress={contactAdmin}>
          <Text style={styles.contactButtonText}>Contact to Reserve</Text>
        </TouchableOpacity>
      </View>

      {/* Availability Calendar */}
      <View style={styles.calendarContainer}>
        <Text style={styles.sectionTitle}>Availability</Text>
        <Text style={styles.calendarSubtitle}>
          Red dates are unavailable. Call to reserve available dates.
        </Text>
        
        {availability.length > 0 ? (
          <View style={styles.availabilityCalendar}>
            {Object.entries(
              availability
                .map(d => new Date(d))
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
              const unavailableSet = new Set(daysInMonth.map(d => d.getDate()));

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
                      const isUnavailable = unavailableSet.has(day);
                      return (
                        <View
                          key={`day-${day}`}
                          style={[
                            styles.dayCell,
                            isUnavailable && styles.unavailableDay,
                          ]}
                        >
                          <Text
                            style={[
                              styles.dayNumber,
                              isUnavailable && styles.unavailableDayNumber,
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
        ) : (
          <Text style={styles.availableText}>All dates are available!</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  editHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  editTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cancelButton: {
    padding: 8,
  },
  cancelButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  saveButton: {
    padding: 8,
  },
  saveButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  formContainer: {
    padding: 20,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#ff3b30',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 14,
    marginTop: 4,
  },
  textArea: {
    height: 100,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
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
  notFoundText: {
    fontSize: 18,
    color: '#666',
  },
  suitImage: {
    width: width,
    height: 300,
    backgroundColor: '#f0f0f0',
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 10,
  },
  suitName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  suitPrice: {
    fontSize: 20,
    color: '#007AFF',
    fontWeight: '600',
    marginBottom: 15,
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
    width: 80,
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginTop: 15,
  },
  adminContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  adminInfo: {
    marginBottom: 15,
  },
  shopName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  adminCity: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  adminAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  adminPhone: {
    fontSize: 14,
    color: '#007AFF',
  },
  contactButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  calendarContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  calendarSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  unavailableDates: {
    backgroundColor: '#ffebee',
    padding: 15,
    borderRadius: 8,
  },
  unavailableTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#c62828',
    marginBottom: 10,
  },
  unavailableDate: {
    fontSize: 14,
    color: '#c62828',
    marginBottom: 3,
  },
  availableText: {
    fontSize: 16,
    color: '#4caf50',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  availabilityCalendar: {
    marginTop: 10,
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
  unavailableDay: {
    backgroundColor: '#FF3B30',
    borderColor: '#D32F2F',
  },
  unavailableDayNumber: {
    color: '#fff',
    fontWeight: '700',
  },
});
