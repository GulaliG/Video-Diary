import React, { useState, useRef, useImperativeHandle } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus, AVPlaybackStatusSuccess } from 'expo-av';
import { MaterialIcons } from '@expo/vector-icons';

function isStatusSuccess(status: AVPlaybackStatus): status is AVPlaybackStatusSuccess {
    return status.isLoaded && !('error' in status);
}

export interface CustomVideoPlayerRef {
    playAsync: () => Promise<AVPlaybackStatus>;
    pauseAsync: () => Promise<AVPlaybackStatus>;
    setPositionAsync: (pos: number) => Promise<AVPlaybackStatus>;
    togglePlay: () => Promise<void>;
}

interface CustomVideoPlayerProps {
    sourceUri: string;
    style?: any;
    showOverlay?: boolean;
    onPlaybackStatusUpdate?: (status: AVPlaybackStatus) => void;
}

export const CustomVideoPlayer = React.forwardRef<CustomVideoPlayerRef, CustomVideoPlayerProps>(
    ({ sourceUri, style, showOverlay = true, onPlaybackStatusUpdate }, ref) => {
        const [isPlaying, setIsPlaying] = useState(false);
        const videoRef = useRef<Video>(null);

        const playAsync = async () => {
            if (!videoRef.current) throw new Error('Video ref is not available');
            return await videoRef.current.playAsync();
        };

        const pauseAsync = async () => {
            if (!videoRef.current) throw new Error('Video ref is not available');
            return await videoRef.current.pauseAsync();
        };

        const setPositionAsync = async (pos: number) => {
            if (!videoRef.current) throw new Error('Video ref is not available');
            return await videoRef.current.setPositionAsync(pos);
        };

        const togglePlay = async () => {
            if (!videoRef.current) return;
            const status = await videoRef.current.getStatusAsync();
            if (isStatusSuccess(status) && status.isPlaying) {
                await pauseAsync();
                setIsPlaying(false);
            } else {
                await playAsync();
                setIsPlaying(true);
            }
        };

        useImperativeHandle(ref, () => ({
            playAsync,
            pauseAsync,
            setPositionAsync,
            togglePlay,
        }));

        return (
            <View className="relative">
                <Video
                    ref={videoRef}
                    source={{ uri: sourceUri }}
                    style={style}
                    resizeMode={ResizeMode.CONTAIN}
                    useNativeControls={false}
                    onPlaybackStatusUpdate={(status) => {
                        if (isStatusSuccess(status)) {
                            setIsPlaying(status.isPlaying);
                        }
                        if (onPlaybackStatusUpdate) {
                            onPlaybackStatusUpdate(status);
                        }
                    }}
                />
                {showOverlay && (
                    <TouchableOpacity
                        className="absolute inset-0 bg-black/20 justify-center items-center"
                        onPress={togglePlay}
                        activeOpacity={0.7}
                    >
                        <MaterialIcons
                            name={isPlaying ? 'pause-circle-filled' : 'play-circle-filled'}
                            size={64}
                            color="#FFF"
                        />
                    </TouchableOpacity>
                )}
            </View>
        );
    }
);
