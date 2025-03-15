import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import SplashScreen from './app/screens/SplashScreen';

export default function App() {
    const router = useRouter();
    const [showSplash, setShowSplash] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSplash(false);
            router.replace('/(tabs)');
        }, 4000);

        return () => clearTimeout(timer);
    }, []);

    if (showSplash) {
        return <SplashScreen />;
    }
    return null;
}
