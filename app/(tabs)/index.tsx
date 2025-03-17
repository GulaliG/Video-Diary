import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal } from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from 'expo-router';
import { useVideoStore } from '@/store/videoStore';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';

const CustomConfirmModal = ({ visible, message, onConfirm, onCancel }: {
  visible: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  return (
    <Modal visible={visible} transparent>
      <View className="flex-1 justify-center items-center bg-black/70">
        <View className="bg-gray-800 p-8 rounded-lg w-4/5 shadow-lg">
          <Text className="text-white text-lg text-center font-semibold">{message}</Text>
          <View className="flex-row justify-between mt-6 space-x-4">
            <TouchableOpacity onPress={onCancel} className="bg-gray-600 px-6 py-3 w-2/5 rounded-lg">
              <Text className="text-white text-lg font-semibold text-center">İptal</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onConfirm} className="bg-red-500 px-6 py-3 w-2/5 rounded-lg">
              <Text className="text-white text-lg font-semibold text-center">Sil</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default function HomeScreen() {
  const videos = useVideoStore((state) => state.videos);
  const loadVideos = useVideoStore((state) => state.loadVideos);
  const removeVideo = useVideoStore((state) => state.removeVideo);
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadVideos();
    }, [])
  );

  const confirmDelete = (videoId: string) => {
    setSelectedVideoId(videoId);
    setModalVisible(true);
  };

  const handleDelete = () => {
    if (selectedVideoId) {
      removeVideo(selectedVideoId);
      setSelectedVideoId(null);
    }
    setModalVisible(false);
  };

  const handleDownload = async (videoId: string) => {
    const video = videos.find(v => v.id === videoId);
    if (!video) {
      Alert.alert("Hata", "Video bulunamadı!");
      return;
    }

    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("İzin Gerekli", "Lütfen galeriye kaydetme izni verin.");
      return;
    }

    try {
      // Hedef dosya yolu (Galeriye kaydetmek için)
      const fileUri = FileSystem.documentDirectory + `video_${Date.now()}.mp4`;

      // Dosyayı yeni konuma kopyala
      await FileSystem.copyAsync({
        from: video.uri,
        to: fileUri,
      });

      // Videoyu Galeriye Kaydet
      const asset = await MediaLibrary.createAssetAsync(fileUri);
      await MediaLibrary.createAlbumAsync("Downloaded Videos", asset, false);

      Alert.alert("Başarılı", "Video galeriye kaydedildi!");
    } catch (error) {
      console.log("Video kaydetme hatası:", error);
      Alert.alert("Hata", "Video kaydedilemedi!");
    }
  };

  const AnimatedItem = ({ item }: { item: any }) => {
    const translateX = useSharedValue(0);
    const deleteOpacity = useSharedValue(0);
    const downloadOpacity = useSharedValue(0);

    const swipeGesture = Gesture.Pan()
      .onUpdate((event: { translationX: number }) => {
        translateX.value = event.translationX;
        if (event.translationX < 0) {
          deleteOpacity.value = withTiming(event.translationX < -20 ? 1 : 0);
          downloadOpacity.value = withTiming(0);
        } else if (event.translationX > 0) {
          downloadOpacity.value = withTiming(event.translationX > 20 ? 1 : 0);
          deleteOpacity.value = withTiming(0);
        }
      })
      .onEnd(() => {
        if (translateX.value < -50) {
          translateX.value = withTiming(-50, { duration: 200 });
          deleteOpacity.value = withTiming(1);
        } else if (translateX.value > 50) {
          translateX.value = withTiming(50, { duration: 200 });
          downloadOpacity.value = withTiming(1);
        } else {
          translateX.value = withTiming(0, { duration: 200 });
          deleteOpacity.value = withTiming(0);
          downloadOpacity.value = withTiming(0);
        }
      });

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: translateX.value }],
    }));

    const deleteButtonStyle = useAnimatedStyle(() => ({
      opacity: deleteOpacity.value,
      transform: [{ translateX: deleteOpacity.value ? 0 : 30 }],
    }));

    const downloadButtonStyle = useAnimatedStyle(() => ({
      opacity: downloadOpacity.value,
      transform: [{ translateX: downloadOpacity.value ? 0 : -30 }],
    }));

    return (
      <View className="relative rounded-xl overflow-hidden mb-2">
        <Animated.View
          style={[downloadButtonStyle]}
          className="absolute top-0 left-0 bottom-4 w-12 bg-green-500 flex items-center rounded-xl justify-center"
        >
          <TouchableOpacity onPress={() => handleDownload(item.id)}>
            <MaterialCommunityIcons name="download" size={24} color="white" />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          style={[deleteButtonStyle]}
          className="absolute top-0 right-0 bottom-4 w-12 bg-red-500 flex items-center rounded-xl justify-center"
        >
          <TouchableOpacity onPress={() => confirmDelete(item.id)}>
            <MaterialCommunityIcons name="trash-can-outline" size={24} color="white" />
          </TouchableOpacity>
        </Animated.View>

        <GestureDetector gesture={swipeGesture}>
          <Animated.View style={[animatedStyle]} className="bg-gray-900 p-4 rounded-xl mb-4 shadow-lg border border-gray-800">
            <TouchableOpacity
              onPress={() => router.push({ pathname: '/details', params: { id: item.id } })}
              activeOpacity={0.8}
            >
              <Text className="text-white text-xl font-semibold mt-2">{item.name}</Text>
              <Text className="text-gray-400">{item.description}</Text>
            </TouchableOpacity>
          </Animated.View>
        </GestureDetector>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-900 pt-10 pr-8 pl-8">
      <CustomConfirmModal
        visible={modalVisible}
        message="Bu videoyu silmek istediğinizden emin misiniz?"
        onConfirm={handleDelete}
        onCancel={() => setModalVisible(false)}
      />

      <Text className="text-white text-2xl font-bold mb-4">Kırpılmış Videolar</Text>
      {videos.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-400 text-lg text-center">
            Henüz video eklenmedi. Bir video kırpın!
          </Text>
        </View>
      ) : (
        <FlatList
          data={videos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => <AnimatedItem item={item} />}
        />
      )}
    </View>
  );
}
