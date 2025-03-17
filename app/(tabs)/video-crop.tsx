<<<<<<< HEAD
// video-crop.tsx
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Image, ScrollView, TextInput, Animated, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ResizeMode, AVPlaybackStatus, AVPlaybackStatusSuccess, Video, Audio } from 'expo-av';
import { useVideoStore } from '@/store/videoStore';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { useCropVideoMutation } from '../../utils/useFFmpegMutations'; // Import TanStack Query hook
import { getThumbnail } from '@/utils/ffmpegServices';
=======
// * Video kırpma
import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    Image,
    ScrollView,
    TextInput,
    Animated,
    Dimensions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ResizeMode, AVPlaybackStatus, AVPlaybackStatusSuccess, Video, Audio } from 'expo-av';
import { useVideoStore } from '@/store/videoStore';
import { cropVideo, getThumbnail } from '../../utils/ffmpegUtils';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
>>>>>>> 965c23b (İlk commit: Video Diary App)

function isStatusSuccess(status: AVPlaybackStatus): status is AVPlaybackStatusSuccess {
    return status.isLoaded && !('error' in status);
}

const videoSchema = z.object({
    videoName: z.string().min(3, 'Video adı en az 3 karakter olmalı'),
    videoDescription: z.string().min(5, 'Açıklama en az 5 karakter olmalı'),
});

const CustomAlert = ({ visible, message, onClose }: { visible: boolean; message: string; onClose: () => void; }) => (
    <Modal visible={visible} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/70">
            <View className="bg-gray-800 p-6 rounded-lg w-3/4 shadow-lg">
                <Text className="text-white text-lg text-center font-semibold">{message}</Text>
                <TouchableOpacity onPress={onClose} className="bg-green-500 p-3 rounded-lg shadow-lg mt-4">
                    <Text className="text-white text-lg font-semibold text-center">Tamam</Text>
                </TouchableOpacity>
            </View>
        </View>
    </Modal>
);

const FormModal = ({ visible, onClose, onSubmit }: { visible: boolean; onClose: () => void; onSubmit: (data: { videoName: string; videoDescription: string }) => void; }) => {
    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(videoSchema),
        defaultValues: { videoName: '', videoDescription: '' },
    });
    const handleSave = (data: { videoName: string; videoDescription: string }) => {
        onSubmit(data);
        reset();
    };
    return (
        <Modal visible={visible} transparent animationType="slide">
            <View className="flex-1 justify-center items-center bg-black/70">
                <View className="bg-gray-800 p-6 rounded-lg w-3/4 shadow-lg">
                    <Text className="text-white text-xl font-semibold mb-4">Video Bilgileri</Text>
                    <Controller
                        control={control}
                        name="videoName"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                className="bg-gray-700 text-white p-3 rounded-lg w-full mb-2 text-base"
                                placeholder="Video İsmi"
                                placeholderTextColor="#b3b3b3"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                            />
                        )}
                    />
                    {errors.videoName && <Text className="text-red-500 text-sm mb-2">{errors.videoName.message}</Text>}
                    <Controller
                        control={control}
                        name="videoDescription"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                className="bg-gray-700 text-white p-3 rounded-lg w-full mb-2 text-base"
                                placeholder="Video Açıklaması"
                                placeholderTextColor="#b3b3b3"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                multiline
                            />
                        )}
                    />
                    {errors.videoDescription && <Text className="text-red-500 text-sm mb-2">{errors.videoDescription.message}</Text>}
                    <TouchableOpacity onPress={handleSubmit(handleSave)} className="bg-green-500 p-3 rounded-lg shadow-lg mt-4">
                        <Text className="text-white text-base font-semibold text-center">Kaydet</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onClose} className="bg-gray-600 p-3 rounded-lg shadow-lg mt-3">
                        <Text className="text-white text-base font-semibold text-center">Vazgeç</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const AnimatedProgressBar = ({ visible, progress }: { visible: boolean; progress: number; }) => {
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

interface TimelineProps {
    videoUri: string;
    duration: number;
    onChangeStart: (val: number) => void;
    currentTime: number;
    onTouchStart?: () => void;
    onTouchEnd?: () => void;
}

const Timeline = ({ videoUri, duration, onChangeStart, currentTime, onTouchStart, onTouchEnd }: TimelineProps) => {
    const THUMB_WIDTH = 60;
<<<<<<< HEAD
    const cropDuration = 5; // Gerçek kırpma süresi 5 saniye
    const actualSelectionWidth = cropDuration * THUMB_WIDTH; // 5 saniye = 300px
    const screenWidth = Dimensions.get('screen').width;
    const spacerWidth = screenWidth / 2 - actualSelectionWidth / 2;
=======
    const DURATION_WINDOW_DURATION = 5;
    const selectionWidth = DURATION_WINDOW_DURATION * THUMB_WIDTH;
    const screenWidth = Dimensions.get('screen').width;
    const spacerWidth = screenWidth / 2 - selectionWidth / 2;
>>>>>>> 965c23b (İlk commit: Video Diary App)

    const [thumbnails, setThumbnails] = useState<{ uri: string; time: number }[]>([]);
    const [progressModalVisible, setProgressModalVisible] = useState(false);
    const [progress, setProgress] = useState(0);
    const scrollOffset = useRef(new Animated.Value(0)).current;
    const scrollViewRef = useRef<ScrollView>(null);

    useEffect(() => {
        (async () => {
            if (!videoUri || !duration) return;
            setThumbnails([]);
            setProgressModalVisible(true);
            setProgress(0);
            const totalFrames = Math.floor(duration);
            const newThumbs: { uri: string; time: number }[] = [];
<<<<<<< HEAD
            // Thumbnail üretiminde doğrudan servis fonksiyonunu kullanıyoruz.
=======
>>>>>>> 965c23b (İlk commit: Video Diary App)
            for (let i = 0; i < totalFrames; i++) {
                try {
                    const thumbUri = await getThumbnail(videoUri, i);
                    newThumbs.push({ uri: thumbUri, time: i });
                    setProgress((i + 1) / totalFrames);
<<<<<<< HEAD
                } catch (error) {
                    // Hata yönetimi
                }
=======
                } catch (error) {}
>>>>>>> 965c23b (İlk commit: Video Diary App)
            }
            setThumbnails(newThumbs);
            setProgressModalVisible(false);
        })();
    }, [videoUri, duration]);

    const handleScroll = (event: any) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const effectiveOffset = Math.max(0, offsetX - spacerWidth);
        scrollOffset.setValue(effectiveOffset);
        const leftTime = effectiveOffset / THUMB_WIDTH;
<<<<<<< HEAD
        // Zaman hesabı için asıl 5 saniyelik alanı esas alıyoruz
        const popTime = leftTime + (actualSelectionWidth / 2) / THUMB_WIDTH;
        onChangeStart(popTime);
    };

    // Overlay görseli için ölçek faktörü
    const overlayScaleFactor = 0.5; // %50
    const visualOverlayWidth = actualSelectionWidth * overlayScaleFactor;

=======
        const popTime = leftTime + (selectionWidth / 2) / THUMB_WIDTH;
        onChangeStart(popTime);
    };

>>>>>>> 965c23b (İlk commit: Video Diary App)
    return (
        <View className="absolute w-full bottom-0 h-20 bg-gray-800 rounded-lg mb-4">
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                ref={scrollViewRef}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
                onMomentumScrollEnd={onTouchEnd}
                className="px-2 py-2"
            >
<<<<<<< HEAD
=======

>>>>>>> 965c23b (İlk commit: Video Diary App)
                <View style={{ width: spacerWidth }} />
                {thumbnails.map((thumb, index) => (
                    <Image key={index} source={{ uri: thumb.uri }} className="w-16 h-16 mr-1" />
                ))}
<<<<<<< HEAD
                <View style={{ width: spacerWidth }} />
            </ScrollView>

            {/* Overlay, merkezde yerleşecek */}
            <View
                className="absolute top-0 bottom-0"
                style={{
                    left: screenWidth / 2 - visualOverlayWidth / 2,
                    width: visualOverlayWidth,
=======

                <View style={{ width: spacerWidth }} />
            </ScrollView>

            <View
                className="absolute top-0 bottom-0"
                style={{
                    left: screenWidth / 2 - selectionWidth / 2,
                    width: selectionWidth,
>>>>>>> 965c23b (İlk commit: Video Diary App)
                    backgroundColor: 'green',
                    opacity: 0.3,
                    zIndex: 25,
                }}
            />
            <AnimatedProgressBar visible={progressModalVisible} progress={progress} />
        </View>
    );
};

export default function VideoCropScreen() {
    const [videoUri, setVideoUri] = useState<string | null>(null);
    const [videoDuration, setVideoDuration] = useState(0);
    const [startTime, setStartTime] = useState(0);
    const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [formModalVisible, setFormModalVisible] = useState(false);

    const addVideo = useVideoStore((state) => state.addVideo);
    const playerRef = useRef<Video>(null);

<<<<<<< HEAD
    // TanStack Query mutation kullanımı
    const cropVideoMutation = useCropVideoMutation();

=======
>>>>>>> 965c23b (İlk commit: Video Diary App)
    useEffect(() => {
        (async () => {
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                playsInSilentModeIOS: true,
                shouldDuckAndroid: false,
                playThroughEarpieceAndroid: false,
            });
        })();
    }, []);

    const showAlert = (msg: string) => {
        setAlertMessage(msg);
        setAlertVisible(true);
    };

    const pickVideo = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
<<<<<<< HEAD
            mediaTypes: ['videos'],
=======
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
>>>>>>> 965c23b (İlk commit: Video Diary App)
            allowsEditing: false,
        });
        if (!result.canceled && result.assets.length > 0) {
            setVideoUri(result.assets[0].uri);
        }
    };

    const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
        if (isStatusSuccess(status)) {
            const posSec = (status.positionMillis ?? 0) / 1000;
            setCurrentPlaybackTime(posSec);
            const durSec = (status.durationMillis ?? 0) / 1000;
            setVideoDuration(durSec);
        }
    };

    const onPressCrop = () => {
        if (!videoUri) {
            showAlert('Lütfen önce bir video seçin!');
            return;
        }
        setFormModalVisible(true);
    };

<<<<<<< HEAD
    const handleFormSubmit = (data: { videoName: string; videoDescription: string }) => {
=======
    const handleFormSubmit = async (data: { videoName: string; videoDescription: string }) => {
>>>>>>> 965c23b (İlk commit: Video Diary App)
        if (!videoUri) {
            showAlert('Video yok!');
            return;
        }
<<<<<<< HEAD
        // TanStack Query mutation'ını tetikliyoruz
        cropVideoMutation.mutate(
            { uri: videoUri, start: startTime, duration: 5 },
            {
                onSuccess: (croppedUri) => {
                    const newVideo = {
                        id: Date.now().toString(),
                        uri: croppedUri,
                        name: data.videoName,
                        description: data.videoDescription,
                    };
                    addVideo(newVideo);
                    setFormModalVisible(false);
                    showAlert('Video başarıyla kırpıldı!');
                    setVideoUri(null);
                    setVideoDuration(0);
                    setCurrentPlaybackTime(0);
                    setStartTime(0);
                },
                onError: () => {
                    showAlert('Video kırpma işlemi başarısız oldu!');
                },
            }
        );
=======
        try {
            const croppedUri = await cropVideo(videoUri, startTime, 5);
            const newVideo = {
                id: Date.now().toString(),
                uri: croppedUri,
                name: data.videoName,
                description: data.videoDescription,
            };
            addVideo(newVideo);
            setFormModalVisible(false);
            showAlert('Video başarıyla kırpıldı!');
            setVideoUri(null);
            setVideoDuration(0);
            setCurrentPlaybackTime(0);
            setStartTime(0);
        } catch (err) {
            showAlert('Video kırpma işlemi başarısız oldu!');
        }
>>>>>>> 965c23b (İlk commit: Video Diary App)
    };

    return (
        <View className="flex-1 bg-gray-900 px-4 py-4">
            <CustomAlert visible={alertVisible} message={alertMessage} onClose={() => setAlertVisible(false)} />
            <FormModal visible={formModalVisible} onClose={() => setFormModalVisible(false)} onSubmit={handleFormSubmit} />
            {!videoUri ? (
                <View className="flex-1 justify-center items-center">
                    <TouchableOpacity onPress={pickVideo} className="bg-green-500 p-4 rounded-lg shadow-lg w-3/4">
                        <Text className="text-white text-lg font-semibold text-center">Video Seç</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View className="flex-1">
                    <View className="w-full h-3/4 bg-black rounded-lg mt-8">
                        <Video
                            ref={playerRef}
                            source={{ uri: videoUri }}
<<<<<<< HEAD
                            style={{ width: '100%', height: '100%' }}
=======
                            style={{ width: '100%', height: 500 }}
>>>>>>> 965c23b (İlk commit: Video Diary App)
                            resizeMode={ResizeMode.CONTAIN}
                            useNativeControls={true}
                            onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
                        />
                    </View>

                    <View className="absolute bottom-16 left-0 right-0 flex items-center">
                        <Timeline
                            videoUri={videoUri}
                            duration={videoDuration}
                            onChangeStart={(val) => {
                                setStartTime(val);
                                if (playerRef.current) {
                                    playerRef.current.setPositionAsync(val * 1000);
                                }
                            }}
                            currentTime={currentPlaybackTime}
                        />
                    </View>

                    <View className="mt-auto items-center">
                        <TouchableOpacity onPress={onPressCrop} className="bg-green-500 p-4 rounded-lg shadow-lg w-full">
                            <Text className="text-white text-lg font-semibold text-center">Kırp</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
}
