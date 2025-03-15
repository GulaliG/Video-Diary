// * Yüklenme
import React from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';

export default function SplashScreen() {
    return (
        <View className="flex-1 items-center justify-center bg-gray-900">
            <Image
                source={require('../../assets/images/splash-icon.png')}
                className="w-40 h-40 mb-4"
                resizeMode="contain"
            />
            <ActivityIndicator size="large" color="#008000" />
            <Text className="text-white text-base mt-2">Yükleniyor...</Text>
        </View>
    );
}
