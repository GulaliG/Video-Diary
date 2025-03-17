import React from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';

export default function SplashScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0D1B2A' }}>
            <Image
                source={require('../../assets/images/splash-icon.png')}
                style={{ width: 160, height: 160, marginBottom: 16 }}
                resizeMode="contain"
            />
            <ActivityIndicator size="large" color="#008000" />
            <Text style={{ color: 'white', fontSize: 16, marginTop: 8 }}>Yükleniyor...</Text>
        </View>
    );
}
