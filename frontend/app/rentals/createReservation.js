import { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { createAdminRental, getAdminSuits, getAdminUsers, getSuitAvailability } from '../api/api';

export default function CreateReservation() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const initialSuitId = params?.suitId != null ? String(params.suitId) : '';

  const [suits, setSuits] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const todayIso = useMemo(() => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  const [formData, setFormData] = useState({
    suit_id: initialSuitId,
    user_id: '',
    dates: [todayIso],
    notes: '',
    payment_status: 'unpaid',
  });

  const [unavailableDays, setUnavailableDays] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  useEffect(() => {
    if (!global.user || global.user.role !== 'admin') {
      Alert.alert('Access Denied', 'Only admins can create rentals');
      router.replace('/suits');
      return;
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (unavailableDays.length === 0) return;

    setFormData((prev) => {
      const filtered = prev.dates.filter((d) => !unavailableDays.includes(d));
      if (filtered.length === prev.dates.length) return prev;

      if (filtered.length > 0) {
        return { ...prev, dates: filtered.sort() };
      }

      // If everything became unavailable, pick the next available day starting from today
      for (let i = 0; i < 60; i += 1) {
        const d = new Date();
        d.setDate(d.getDate() + i);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const iso = `${yyyy}-${mm}-${dd}`;
        if (!unavailableDays.includes(iso)) {
          return { ...prev, dates: [iso] };
        }
      }

      return prev;
    });
  }, [unavailableDays]);

  useEffect(() => {
    if (!formData.suit_id) {
      setUnavailableDays([]);
      return;
    }

    const fetchAvailability = async () => {
      try {
        const data = await getSuitAvailability(formData.suit_id);
        setUnavailableDays(Array.isArray(data?.unavailable_days) ? data.unavailable_days : []);
      } catch (e) {
        setUnavailableDays([]);
      }
    };

    fetchAvailability();
  }, [formData.suit_id]);

  const fetchData = async () => {
    try {
      if (!global.userToken || global.user?.role !== 'admin') {
        router.replace('/auth/login');
        return;
      }

      const suitsRes = await getAdminSuits();
      setSuits(suitsRes?.data || suitsRes || []);

      const clientsRes = await getAdminUsers();
      setClients(Array.isArray(clientsRes) ? clientsRes : clientsRes?.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getEarliestSelected = () => {
    if (!Array.isArray(formData.dates) || formData.dates.length === 0) return '';
    return [...formData.dates].sort()[0];
  };

  const isPastDay = (iso) => {
    return iso < todayIso;
  };

  const toggleDay = (iso) => {
    if (isPastDay(iso)) return;

    setFormData((prev) => {
      const exists = prev.dates.includes(iso);
      if (exists) {
        if (prev.dates.length === 1) {
          Alert.alert('Not allowed', 'You must select at least one day.');
          return prev;
        }
        return { ...prev, dates: prev.dates.filter((d) => d !== iso) };
      }

      if (unavailableDays.includes(iso)) {
        return prev;
      }

      return { ...prev, dates: [...prev.dates, iso].sort() };
    });
  };

  const buildMonthCells = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const firstWeekDay = firstDay.getDay(); // 0 Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells = [];
    for (let i = 0; i < firstWeekDay; i += 1) cells.push(null);
    for (let d = 1; d <= daysInMonth; d += 1) {
      const mm = String(month + 1).padStart(2, '0');
      const dd = String(d).padStart(2, '0');
      cells.push({
        dayNumber: d,
        iso: `${year}-${mm}-${dd}`,
      });
    }
    return cells;
  };

  const handleSubmit = async () => {
    if (!formData.suit_id || !String(formData.user_id).trim() || formData.dates.length === 0) {
      Alert.alert('Error', 'Please fill in all required fields and select at least one date');
      return;
    }

    const hasUnavailable = formData.dates.some((d) => unavailableDays.includes(d));
    if (hasUnavailable) {
      Alert.alert('Error', 'One or more selected days are unavailable.');
      return;
    }

    setSubmitting(true);
    try {
      if (!global.userToken || global.user?.role !== 'admin') {
        router.replace('/auth/login');
        return;
      }

      const payload = {
        suit_id: Number(formData.suit_id),
        user_id: Number(formData.user_id),
        dates: [...formData.dates].sort(),
        notes: String(formData.notes || '').trim() || null,
        payment_status: formData.payment_status,
      };

      await createAdminRental(payload);

      Alert.alert('Success', 'Reservation created successfully!');
      router.replace('/(admin-tabs)/rentals');
    } catch (error) {
      console.error('Error creating rental:', error);
      const conflicts = error.response?.data?.conflicts;
      if (Array.isArray(conflicts) && conflicts.length > 0) {
        Alert.alert(
          'Dates unavailable',
          `These days are already reserved:\n${conflicts.sort().join('\n')}`
        );
      } else {
        Alert.alert('Error', error.response?.data?.message || 'Failed to create reservation');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Reservation</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancelButton}>Cancel</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Select Suit</Text>
        <View style={styles.pickerContainer}>
          <ScrollView style={styles.pickerScroll} nestedScrollEnabled>
            {suits.map(suit => (
              <TouchableOpacity
                key={suit.id}
                style={[
                  styles.option,
                  formData.suit_id == suit.id && styles.selectedOption
                ]}
                onPress={() => handleInputChange('suit_id', suit.id.toString())}
              >
                <Text style={[
                  styles.optionText,
                  formData.suit_id == suit.id && styles.selectedOptionText
                ]}>
                  {suit.name} - ${suit.price_per_day}/day
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <Text style={styles.label}>Client</Text>
        <View style={styles.pickerSelectContainer}>
          <Picker
            selectedValue={formData.user_id}
            onValueChange={(v) => handleInputChange('user_id', String(v))}
            style={styles.picker}
          >
            <Picker.Item label="Select client" value="" />
            {clients.map((u) => (
              <Picker.Item
                key={u.id}
                label={`${u.first_name} ${u.last_name} (#${u.id})`}
                value={String(u.id)}
              />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Start Date</Text>
        <View style={styles.readOnlyBox}>
          <Text style={styles.readOnlyText}>{getEarliestSelected() || '-'}</Text>
        </View>

        <Text style={styles.label}>Select Days</Text>
        <View style={styles.calendarHeader}>
          <TouchableOpacity
            style={styles.monthNavButton}
            onPress={() => {
              const d = new Date(currentMonth);
              d.setMonth(d.getMonth() - 1);
              setCurrentMonth(new Date(d.getFullYear(), d.getMonth(), 1));
            }}
          >
            <Text style={styles.monthNavText}>Prev</Text>
          </TouchableOpacity>
          <Text style={styles.monthTitle}>
            {currentMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
          </Text>
          <TouchableOpacity
            style={styles.monthNavButton}
            onPress={() => {
              const d = new Date(currentMonth);
              d.setMonth(d.getMonth() + 1);
              setCurrentMonth(new Date(d.getFullYear(), d.getMonth(), 1));
            }}
          >
            <Text style={styles.monthNavText}>Next</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.weekdaysRow}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((w) => (
            <Text key={w} style={styles.weekdayText}>{w}</Text>
          ))}
        </View>

        <View style={styles.calendarGrid}>
          {buildMonthCells().map((cell, idx) => {
            if (!cell) {
              return <View key={`empty-${idx}`} style={styles.dayCell} />;
            }

            const selected = formData.dates.includes(cell.iso);
            const disabled = isPastDay(cell.iso) || unavailableDays.includes(cell.iso);

            return (
              <TouchableOpacity
                key={cell.iso}
                style={[
                  styles.dayCell,
                  selected && styles.daySelected,
                  disabled && styles.dayDisabled,
                ]}
                disabled={disabled}
                onPress={() => toggleDay(cell.iso)}
              >
                <Text
                  style={[
                    styles.dayText,
                    selected && styles.daySelectedText,
                    disabled && styles.dayDisabledText,
                  ]}
                >
                  {cell.dayNumber}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.label}>Selected Days</Text>
        <View style={styles.datesContainer}>
          {formData.dates.sort().map((date, index) => (
            <View key={index} style={styles.dateChip}>
              <Text style={styles.dateChipText}>{date}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.label}>Payment Status</Text>
        <View style={styles.pickerSelectContainer}>
          <Picker
            selectedValue={formData.payment_status}
            onValueChange={(v) => handleInputChange('payment_status', v)}
            style={styles.picker}
          >
            <Picker.Item label="Unpaid" value="unpaid" />
            <Picker.Item label="Paid" value="paid" />
            <Picker.Item label="Refunded" value="refunded" />
          </Picker>
        </View>

        <Text style={styles.label}>Notes (Optional)</Text>
        <TextInput
          placeholder="Add notes about this rental"
          style={[styles.input, styles.textArea]}
          value={formData.notes}
          onChangeText={(value) => handleInputChange('notes', value)}
          multiline
          numberOfLines={3}
        />

        <TouchableOpacity
          style={[styles.submitButton, submitting && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Create Reservation</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  },
  cancelButton: {
    color: '#007AFF',
    fontSize: 16,
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  readOnlyBox: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  readOnlyText: {
    fontSize: 16,
    color: '#333',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
  },
  pickerScroll: {
    maxHeight: 150,
  },
  pickerSelectContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  option: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedOption: {
    backgroundColor: '#e3f2fd',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOptionText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  monthNavButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  monthNavText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  weekdaysRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  weekdayText: {
    flex: 1,
    textAlign: 'center',
    color: '#666',
    fontSize: 12,
    fontWeight: '600',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 20,
  },
  dayCell: {
    width: '14.2857%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 6,
  },
  dayText: {
    color: '#333',
    fontWeight: '600',
  },
  daySelected: {
    backgroundColor: '#007AFF',
  },
  daySelectedText: {
    color: '#fff',
  },
  dayDisabled: {
    backgroundColor: '#f2f2f2',
  },
  dayDisabledText: {
    color: '#999',
  },
  datesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  dateChip: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  dateChipText: {
    color: '#fff',
    fontSize: 14,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
