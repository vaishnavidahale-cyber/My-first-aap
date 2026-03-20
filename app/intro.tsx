import StartingScreen from '@/components/StartingScreen';
import { useRouter } from 'expo-router';
import React from 'react';

export default function IntroScreen() {
  const router = useRouter();

  const handleComplete = () => {
    router.replace('/login');
  };

  return <StartingScreen onComplete={handleComplete} />;
}