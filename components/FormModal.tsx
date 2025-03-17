import React from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const videoSchema = z.object({
    videoName: z.string().min(3, 'Video adı en az 3 karakter olmalı'),
    videoDescription: z.string().min(5, 'Açıklama en az 5 karakter olmalı'),
});

export type VideoFormData = z.infer<typeof videoSchema>;

interface FormModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: VideoFormData) => void;
}

export const FormModal: React.FC<FormModalProps> = ({ visible, onClose, onSubmit }) => {
    const { control, handleSubmit, formState: { errors }, reset } = useForm<VideoFormData>({
        resolver: zodResolver(videoSchema),
        defaultValues: { videoName: '', videoDescription: '' },
    });

    const handleSave = (data: VideoFormData) => {
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
                    {errors.videoName && (
                        <Text className="text-red-500 text-sm mb-2">{errors.videoName.message}</Text>
                    )}
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
                    {errors.videoDescription && (
                        <Text className="text-red-500 text-sm mb-2">{errors.videoDescription.message}</Text>
                    )}
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
