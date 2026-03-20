import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Navigate to intro screen on app start
    router.replace('/intro');
  }, []);

  return null;
}