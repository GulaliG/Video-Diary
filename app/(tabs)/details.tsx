// * Detaylar
import { View, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useVideoStore } from '@/store/videoStore';
import { Video, ResizeMode } from 'expo-av';

export default function VideoDetails() {
    const { id } = useLocalSearchParams();
    const videoId = String(id);
    const video = useVideoStore((state) => state.videos.find((v) => v.id === videoId));
    const router = useRouter();

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
        <View className="flex-1 bg-gray-900 px-6 py-8 items-center">
            <Video
                source={{ uri: video.uri }}
                style={{ width: '100%', height: 220, borderRadius: 10, backgroundColor: 'black' }}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
            />
            <Text className="text-white text-2xl font-bold mt-4">{video.name}</Text>
            <Text className="text-gray-400 text-lg mt-2 text-center">{video.description}</Text>

            <TouchableOpacity
                onPress={() => router.push({ pathname: "/edit", params: { id: video.id } })}
                className="bg-green-500 p-3 rounded-lg shadow-lg mt-6 w-full"
            >
                <Text className="text-white text-lg font-semibold text-center">Düzenle</Text>
            </TouchableOpacity>
        </View>
    );
}
