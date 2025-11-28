import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      // router.replace('/auth/login');
      router.replace('/suits');
    }, 0);
  }, []);

  return null; // Optional: show a loading spinner instead
}
