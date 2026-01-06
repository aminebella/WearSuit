import { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { register as apiRegister } from '../api/api';

export default function Register() {
  const router = useRouter();
  const [accountType, setAccountType] = useState('client'); // by default 'client' | 'admin'
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    shop_name: '',
    email: '',
    phone: '',
    city: '',
    address: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }; // es6 //speard operator

  const handleRegister = async () => {
    setError('');

    // Validation
    const normalizedEmail = formData.email.trim();
    const isAdmin = accountType === 'admin';

    if (!formData.first_name || !formData.last_name || !normalizedEmail || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!formData.phone) {
      setError('Phone number is required.');
      return;
    }

    if (!normalizedEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!formData.city) {
      setError('City is required.');
      return;
    }

    if (isAdmin && !formData.shop_name) {
      setError('Shop name is required for admin accounts.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 5) {
      setError('Password must be at least 5 characters.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: normalizedEmail,
        phone: formData.phone,
        city: formData.city,
        address: formData.address,
        password: formData.password,
        role: isAdmin ? 'admin' : 'user',
      };

      if (isAdmin) {
        payload.shop_name = formData.shop_name;
      }

      await apiRegister(payload);

      router.replace('/auth/login');
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        (error?.response?.data?.errors
          ? Object.values(error.response.data.errors).flat().join('\n')
          : null) ||
        'Registration failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join WearSuit today</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.roleRow}>
          <TouchableOpacity
            style={[styles.rolePill, styles.rolePillLeft, accountType === 'client' && styles.rolePillActive]}
            onPress={() => setAccountType('client')}
            disabled={loading}
          >
            <Text style={[styles.rolePillText, accountType === 'client' && styles.rolePillTextActive]}>Client</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.rolePill, accountType === 'admin' && styles.rolePillActive]}
            onPress={() => setAccountType('admin')}
            disabled={loading}
          >
            <Text style={[styles.rolePillText, accountType === 'admin' && styles.rolePillTextActive]}>Admin</Text>
          </TouchableOpacity>
        </View>

        {!!error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              placeholder="First name"
              style={styles.input}
              value={formData.first_name}
              onChangeText={(value) => handleInputChange('first_name', value)}
            />
          </View>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              placeholder="Last name"
              style={styles.input}
              value={formData.last_name}
              onChangeText={(value) => handleInputChange('last_name', value)}
            />
          </View>
        </View>

        {accountType === 'admin' && (
          <>
            <Text style={styles.label}>Shop Name</Text>
            <TextInput
              placeholder="Your shop name"
              style={styles.input}
              value={formData.shop_name}
              onChangeText={(value) => handleInputChange('shop_name', value)}
              autoCapitalize="words"
            />
          </>
        )}

        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Enter your email"
          style={styles.input}
          value={formData.email}
          onChangeText={(value) => handleInputChange('email', value)}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Phone</Text>
        <TextInput
          placeholder="Enter your phone"
          style={styles.input}
          value={formData.phone}
          onChangeText={(value) => handleInputChange('phone', value)}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>City</Text>
        <TextInput
          placeholder="Enter your city"
          style={styles.input}
          value={formData.city}
          onChangeText={(value) => handleInputChange('city', value)}
        />

        <Text style={styles.label}>Address (Optional)</Text>
        <TextInput
          placeholder="Enter your address"
          style={styles.input}
          value={formData.address}
          onChangeText={(value) => handleInputChange('address', value)}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          placeholder="Enter your password"
          style={styles.input}
          value={formData.password}
          onChangeText={(value) => handleInputChange('password', value)}
          secureTextEntry
        />

        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          placeholder="Confirm your password"
          style={styles.input}
          value={formData.confirmPassword}
          onChangeText={(value) => handleInputChange('confirmPassword', value)}
          secureTextEntry
        />

        <TouchableOpacity 
          style={[styles.registerButton, loading && styles.disabledButton]} 
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.registerButtonText}>Create Account</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace('/auth/login')}>
          <Text style={styles.loginLink}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  roleRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  rolePill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  rolePillLeft: {
    marginRight: 10,
  },
  rolePillActive: {
    backgroundColor: '#007AFF',
  },
  rolePillText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
  },
  rolePillTextActive: {
    color: '#fff',
  },
  errorText: {
    color: '#C62828',
    marginBottom: 12,
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  registerButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginLink: {
    color: '#007AFF',
    textAlign: 'center',
    fontSize: 14,
  },
});

