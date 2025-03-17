import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, Animated } from 'react-native';

interface AnimatedProgressBarProps {
    visible: boolean;
    progress: number;
}

export const AnimatedProgressBar: React.FC<AnimatedProgressBarProps> = ({ visible, progress }) => {
    const animation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.timing(animation, {
                toValue: progress,
                duration: 300,
                useNativeDriver: false,
            }).start();
        } else {
            animation.setValue(0);
        }
    }, [progress, visible]);

    const widthInterpolate = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
        extrapolate: 'clamp',
    });

    if (!visible) return null;
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View className="flex-1 justify-center items-center bg-black/70">
                <View className="bg-gray-800 p-6 rounded-lg w-3/4 shadow-lg">
                    <Text className="text-white text-lg text-center font-semibold">Video Yükleniyor</Text>
                    <View className="w-full bg-gray-600 h-3 rounded mt-4 overflow-hidden">
                        <Animated.View style={{ width: widthInterpolate }} className="bg-green-500 h-3" />
                    </View>
                    <Text className="text-white text-center mt-2">{Math.round(progress * 100)}%</Text>
                </View>
            </View>
        </Modal>
    );
};
