<<<<<<< HEAD
// App.tsx
import React, { useState, useEffect } from 'react';
import { useRouter, Slot } from 'expo-router';
import SplashScreen from './app/screens/SplashScreen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// React Query Client
const queryClient = new QueryClient();
=======
import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import SplashScreen from './app/screens/SplashScreen';
>>>>>>> 965c23b (İlk commit: Video Diary App)

export default function App() {
    const router = useRouter();
    const [showSplash, setShowSplash] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSplash(false);
            router.replace('/(tabs)');
<<<<<<< HEAD
        }, 5000);
=======
        }, 4000);
>>>>>>> 965c23b (İlk commit: Video Diary App)

        return () => clearTimeout(timer);
    }, []);

    if (showSplash) {
        return <SplashScreen />;
    }
<<<<<<< HEAD

    return (
        <QueryClientProvider client={queryClient}>
            <Slot />
        </QueryClientProvider>
    );
=======
    return null;
>>>>>>> 965c23b (İlk commit: Video Diary App)
}
