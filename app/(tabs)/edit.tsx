// * Editleme sayfası
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useVideoStore } from '@/store/videoStore';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Zod şeması
const videoSchema = z.object({
    videoName: z.string().min(3, "Video adı en az 3 karakter olmalı"),
    videoDescription: z.string().min(5, "Açıklama en az 5 karakter olmalı"),
});

export default function EditVideoScreen() {
    const { id } = useLocalSearchParams();
    const videoId = String(id);
    const video = useVideoStore((state) => state.videos.find(v => v.id === videoId));
    const updateVideo = useVideoStore((state) => state.updateVideo);
    const router = useRouter();

    const [isModalVisible, setModalVisible] = useState(false);

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(videoSchema),
        defaultValues: {
            videoName: video?.name || '',
            videoDescription: video?.description || '',
        },
    });

    const handleUpdate = (data: { videoName: string; videoDescription: string }) => {
        if (!video) return;

        updateVideo(video.id, { name: data.videoName, description: data.videoDescription });
        setModalVisible(true);
    };

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
        <View className="flex-1 bg-gray-900 px-6 py-4">
            <Text className="text-white text-2xl font-bold mb-4 mt-8">Video Düzenle</Text>

            <Controller
                control={control}
                name="videoName"
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        className="bg-gray-800 text-white p-3 rounded-lg w-full text-lg mt-4"
                        placeholder="Video İsmi"
                        placeholderTextColor="#b3b3b3"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                    />
                )}
            />
            {errors.videoName && (
                <Text className="text-red-500 text-sm mt-1">{errors.videoName.message}</Text>
            )}

            <Controller
                control={control}
                name="videoDescription"
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        className="bg-gray-800 text-white p-3 rounded-lg w-full mt-4 text-lg"
                        placeholder="Video Açıklaması"
                        placeholderTextColor="#b3b3b3"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        multiline
                    />
                )}
            />
            {errors.videoDescription && (
                <Text className="text-red-500 text-sm mt-1">{errors.videoDescription.message}</Text>
            )}

            <TouchableOpacity onPress={handleSubmit(handleUpdate)} className="bg-green-500 p-4 rounded-lg shadow-lg mt-6">
                <Text className="text-white text-lg font-semibold text-center">Güncelle</Text>
            </TouchableOpacity>

            <Modal
                visible={isModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 justify-center items-center bg-black/70">
                    <View className="bg-gray-800 p-6 rounded-lg w-3/4 shadow-lg">
                        <Text className="text-white text-xl font-bold text-center mb-4">Başarılı</Text>
                        <Text className="text-white text-lg text-center">Video bilgileri güncellendi!</Text>
                        <TouchableOpacity
                            onPress={() => {
                                setModalVisible(false);
                                router.push({ pathname: "/details", params: { id: video.id } });
                            }}
                            className="bg-green-500 p-3 rounded-lg shadow-lg mt-4"
                        >
                            <Text className="text-white text-lg font-semibold text-center">Tamam</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
