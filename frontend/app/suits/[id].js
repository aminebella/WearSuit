import { View, Text } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function SuitDetails() {
  const { id } = useLocalSearchParams(); // dynamic id from URL

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Suit Details Page</Text>
      <Text>Suit ID: {id}</Text>
    </View>
  );
}
