import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { getAuthSession } from './api/authStorage';
import { setAuthToken } from './api/api';

// app entery / read tokens and user info from securestore then decide where to go depending on user role
export default function Index() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      try {
        const { token, user } = await getAuthSession();
        if (cancelled) return;

        if (token) {
          setAuthToken(token);
          global.userToken = token;
          global.user = user;

          if (user?.role === 'admin') {
            router.replace('/(admin-tabs)/suits');
          } else {
            router.replace('/(client-tabs)/suits');
          }
          return;
        }

        router.replace('/auth/login'); // if no tokken go to login // and prevent go back
      } catch (e) {
        router.replace('/auth/login');
      }
    };

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
