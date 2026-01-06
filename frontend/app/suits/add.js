import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { createAdminSuit } from '../api/api';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];
const GENDERS = ['men', 'women', 'girls', 'boys'];
const CATEGORIES = ['wedding', 'traditional', 'party', 'formal', 'other'];

export default function AddSuit() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    size: 'M',
    color: '',
    gender: 'men',
    category: 'other',
    price_per_day: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.color.trim()) {
      newErrors.color = 'Color is required';
    }

    if (!formData.price_per_day.trim()) {
      newErrors.price_per_day = 'Price per day is required';
    } else if (isNaN(formData.price_per_day) || parseFloat(formData.price_per_day) <= 0) {
      newErrors.price_per_day = 'Price must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const suitData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        size: formData.size,
        color: formData.color.trim(),
        gender: formData.gender,
        category: formData.category,
        price_per_day: parseFloat(formData.price_per_day)
      };
      
      await createAdminSuit(suitData);
      Alert.alert('Success', 'Suit added successfully!', [
        {
          text: 'OK',
          onPress: () => router.back()
        }
      ]);
    } catch (error) {
      console.error('Add suit error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to add suit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Add New Suit</Text>
        <TouchableOpacity onPress={handleSubmit} style={styles.saveButton} disabled={loading}>
          <Text style={styles.saveButtonText}>{loading ? 'Saving...' : 'Save'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        {/* Name */}
        <View style={styles.field}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            value={formData.name}
            onChangeText={(value) => handleInputChange('name', value)}
            placeholder="Enter suit name"
            maxLength={255}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        {/* Description */}
        <View style={styles.field}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea, errors.description && styles.inputError]}
            value={formData.description}
            onChangeText={(value) => handleInputChange('description', value)}
            placeholder="Enter suit description"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
        </View>

        {/* Size */}
        <View style={styles.field}>
          <Text style={styles.label}>Size</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.size}
              onValueChange={(value) => handleInputChange('size', value)}
              style={styles.picker}
            >
              {SIZES.map(size => (
                <Picker.Item key={size} label={size} value={size} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Color */}
        <View style={styles.field}>
          <Text style={styles.label}>Color</Text>
          <TextInput
            style={[styles.input, errors.color && styles.inputError]}
            value={formData.color}
            onChangeText={(value) => handleInputChange('color', value)}
            placeholder="Enter color"
            maxLength={30}
          />
          {errors.color && <Text style={styles.errorText}>{errors.color}</Text>}
        </View>

        {/* Gender */}
        <View style={styles.field}>
          <Text style={styles.label}>Gender</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.gender}
              onValueChange={(value) => handleInputChange('gender', value)}
              style={styles.picker}
            >
              {GENDERS.map(gender => (
                <Picker.Item key={gender} label={gender.charAt(0).toUpperCase() + gender.slice(1)} value={gender} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Category */}
        <View style={styles.field}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.category}
              onValueChange={(value) => handleInputChange('category', value)}
              style={styles.picker}
            >
              {CATEGORIES.map(category => (
                <Picker.Item key={category} label={category.charAt(0).toUpperCase() + category.slice(1)} value={category} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Price per day */}
        <View style={styles.field}>
          <Text style={styles.label}>Price per Day (MAD)</Text>
          <TextInput
            style={[styles.input, errors.price_per_day && styles.inputError]}
            value={String(formData.price_per_day)}
            onChangeText={(value) => handleInputChange('price_per_day', value)}
            placeholder="Enter price per day"
            keyboardType="numeric"
          />
          {errors.price_per_day && <Text style={styles.errorText}>{errors.price_per_day}</Text>}
        </View>

        {/* Info note */}
        <View style={styles.infoNote}>
          <Text style={styles.infoNoteText}>
            Note: Status will be set to "Available" and is_active to "true" by default.
          </Text>
        </View>
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
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
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
  form: {
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
  required: {
    color: '#ff3b30',
    fontWeight: 'bold',
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
  errorText: {
    color: '#ff3b30',
    fontSize: 14,
    marginTop: 4,
  },
  infoNote: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
  },
  infoNoteText: {
    color: '#1976d2',
    fontSize: 14,
    textAlign: 'center',
  },
});
