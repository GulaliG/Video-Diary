import { ScrollView, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useVideoStore } from '@/store/videoStore';
import { Video, ResizeMode } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { useEffect, useRef, useState } from 'react';

// detaylar fonksiyonu
export default function VideoDetails() {
    const { id } = useLocalSearchParams();
    const videoId = String(id);
    const video = useVideoStore((state) => state.videos.find((v) => v.id === videoId));
    const router = useRouter();

    const videoRef = useRef<Video>(null);
    const [loading, setLoading] = useState(true);
    const [fileExists, setFileExists] = useState(false);

    useEffect(() => {
        const checkFileExists = async () => {
            if (video?.uri) {
                try {
                    const fileInfo = await FileSystem.getInfoAsync(video.uri);
                    setFileExists(fileInfo.exists);
                } catch (error) {
                    console.error("Dosya kontrol hatası:", error);
                }
            }
            setLoading(false);
        };
        checkFileExists();
    }, [video?.uri]);

    if (!video) {
        return (
            <View className="flex-1 bg-gray-900 justify-center items-center px-6">
                <Text className="text-red-400 text-lg font-semibold text-center">Video bulunamadı!</Text>
                <TouchableOpacity
                    onPress={() => router.push('/')}
                    className="bg-green-500 p-3 rounded-lg shadow-lg mt-6 w-3/4"
                >
                    <Text className="text-white text-lg font-semibold text-center">Ana Sayfa</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-900">
            <ScrollView
                className="flex-1 px-6 py-8"
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
            >
                {loading ? (
                    <ActivityIndicator size="large" color="white" />
                ) : fileExists ? (
                    <View className="w-full bg-black rounded-lg mt-8">
                        <Video
                            source={{ uri: video.uri }}
                            style={{ width: '100%', height: undefined, aspectRatio: 9 / 16 }}
                            resizeMode={ResizeMode.CONTAIN}
                            useNativeControls={true}
                        />
                    </View>
                ) : (
                    <Text className="text-red-400 text-lg font-semibold mt-4">
                        Video dosyası bulunamadı!
                    </Text>
                )}

                <Text className="text-white text-2xl pl-2 font-bold mt-4 text-left w-full">
                    Video İsmi: {video.name}
                </Text>
                <Text className="text-gray-400 text-xl pl-2 mt-2 text-left w-full">
                    Video Açıklaması: {video.description}
                </Text>
            </ScrollView>

            {/* Düzenle Butonu */}
            <View className="p-4 bg-gray-900">
                <TouchableOpacity
                    onPress={() => router.push({ pathname: "/edit", params: { id: video.id } })}
                    className="bg-green-500 p-3 rounded-lg shadow-lg w-full"
                >
                    <Text className="text-white text-lg font-semibold text-center">Düzenle</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
