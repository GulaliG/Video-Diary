import React from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withDelay } from 'react-native-reanimated';

export default function SplashScreen() {
    const dot1 = useSharedValue(0);
    const dot2 = useSharedValue(0);
    const dot3 = useSharedValue(0);

    React.useEffect(() => {
        dot1.value = withRepeat(withTiming(1, { duration: 500 }), -1, true);
        dot2.value = withRepeat(withDelay(250, withTiming(1, { duration: 500 })), -1, true);
        dot3.value = withRepeat(withDelay(500, withTiming(1, { duration: 500 })), -1, true);
    }, []);

    const animatedDot1 = useAnimatedStyle(() => ({ opacity: dot1.value }));
    const animatedDot2 = useAnimatedStyle(() => ({ opacity: dot2.value }));
    const animatedDot3 = useAnimatedStyle(() => ({ opacity: dot3.value }));

    return (
        <View className="flex-1 items-center justify-center bg-[#152038]">
            <Image
                source={require('../../assets/images/splash-icon.png')}
                className="w-40 h-40 mb-4"
                resizeMode="contain"
            />
            <ActivityIndicator size="large" color="#008000" />
            <Text className="text-white text-base mt-2">
                Yükleniyor
                <Animated.Text style={animatedDot1}>.</Animated.Text>
                <Animated.Text style={animatedDot2}>.</Animated.Text>
                <Animated.Text style={animatedDot3}>.</Animated.Text>
            </Text>
        </View>
    );
}