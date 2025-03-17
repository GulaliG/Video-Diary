// App.tsx
import React, { useState, useEffect } from 'react';
import { useRouter, Slot } from 'expo-router';
import SplashScreen from './app/screens/SplashScreen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// React Query Client
const queryClient = new QueryClient();

export default function App() {
    const router = useRouter();
    const [showSplash, setShowSplash] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSplash(false);
            router.replace('/(tabs)');
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    if (showSplash) {
        return <SplashScreen />;
    }

    return (
        <QueryClientProvider client={queryClient}>
            <Slot />
        </QueryClientProvider>
    );
}
