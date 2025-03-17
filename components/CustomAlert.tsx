import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';

interface CustomAlertProps {
    visible: boolean;
    message: string;
    onClose: () => void;
}

export const CustomAlert: React.FC<CustomAlertProps> = ({ visible, message, onClose }) => (
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
