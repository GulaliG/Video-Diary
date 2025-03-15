import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, ScrollView, Animated, PanResponder } from 'react-native';
import { AnimatedProgressBar } from './AnimatedProgressBar';
import { getThumbnail } from '../utils/ffmpegUtils';

interface TimelineProps {
    videoUri: string;
    duration: number;
    onChangeStart: (val: number) => void;
    currentTime: number;
}

export const Timeline: React.FC<TimelineProps> = ({ videoUri, duration, onChangeStart, currentTime }) => {
    const [thumbnails, setThumbnails] = useState<{ uri: string; time: number }[]>([]);
    const [progressModalVisible, setProgressModalVisible] = useState(false);
    const [progress, setProgress] = useState(0);
    const THUMB_WIDTH = 60;
    const totalWidth = duration * THUMB_WIDTH;
    const selectionWidth = 5 * THUMB_WIDTH;
    const [currentOffset, setCurrentOffset] = useState(0);
    const maxOffset = totalWidth > selectionWidth ? totalWidth - selectionWidth : 0;
    const offsetX = useRef(new Animated.Value(0)).current;
    const playheadX = useRef(new Animated.Value(0)).current;

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onStartShouldSetPanResponderCapture: () => true,
            onMoveShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponderCapture: () => true,
            onPanResponderMove: (_, gestureState) => {
                const newX = currentOffset + gestureState.dx;
                const clampedX = Math.max(0, Math.min(newX, maxOffset));
                offsetX.setValue(clampedX);
            },
            onPanResponderRelease: (_, gestureState) => {
                const newX = currentOffset + gestureState.dx;
                const clampedX = Math.max(0, Math.min(newX, maxOffset));
                setCurrentOffset(clampedX);
                offsetX.setValue(clampedX);
                const startSec = clampedX / THUMB_WIDTH;
                onChangeStart(startSec);
            },
        })
    ).current;

    useEffect(() => {
        (async () => {
            if (!videoUri || !duration) return;
            setThumbnails([]);
            setProgressModalVisible(true);
            setProgress(0);
            const totalFrames = Math.floor(duration);
            const newThumbs: { uri: string; time: number }[] = [];
            for (let i = 0; i < totalFrames; i++) {
                try {
                    const thumbUri = await getThumbnail(videoUri, i);
                    newThumbs.push({ uri: thumbUri, time: i });
                    setProgress((i + 1) / totalFrames);
                } catch (error) {
                    console.error(`Thumbnail alınamadı (time: ${i})`, error);
                }
            }
            setThumbnails(newThumbs);
            setProgressModalVisible(false);
        })();
    }, [videoUri, duration]);

    useEffect(() => {
        Animated.timing(playheadX, {
            toValue: currentTime * THUMB_WIDTH,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }, [currentTime]);

    return (
        <View className="absolute w-full bottom-0 h-20 bg-gray-800 rounded-lg mb-4">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-2 py-2" pointerEvents="none">
                {thumbnails.map((thumb, index) => (
                    <Image key={index} source={{ uri: thumb.uri }} className="w-16 h-16 mr-1" />
                ))}
            </ScrollView>
            <Animated.View
                {...panResponder.panHandlers}
                className="absolute top-0 h-full border-2 border-green-500 bg-green-300/30 rounded-lg"
                style={{ width: selectionWidth, transform: [{ translateX: offsetX }], zIndex: 9999 }}
            />
            <Animated.View
                style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    width: 2,
                    backgroundColor: 'red',
                    transform: [{ translateX: playheadX }],
                }}
            />
            <View className="absolute bottom-0 left-0 right-0 flex-row">
                {Array.from({ length: Math.floor(duration) + 1 }).map((_, index) => (
                    <Text key={index} className="w-16 text-center text-white text-xs">{index}s</Text>
                ))}
            </View>
            <AnimatedProgressBar visible={progressModalVisible} progress={progress} />
        </View>
    );
};
