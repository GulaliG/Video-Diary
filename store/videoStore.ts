// * Saklama depo
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type VideoItem = {
    id: string;
    uri: string;
    name: string;
    description: string;
};

interface VideoStore {
    videos: VideoItem[];
    addVideo: (video: VideoItem) => void;
    updateVideo: (id: string, updates: Partial<VideoItem>) => void;
    removeVideo: (id: string) => void;
    loadVideos: () => Promise<void>;
}

export const useVideoStore = create<VideoStore>((set) => ({
    videos: [],

    addVideo: async (video) => {
        try {
            const storedVideos = await AsyncStorage.getItem('videos');
            const videosArray = storedVideos ? JSON.parse(storedVideos) : [];

            const updatedVideos = [...videosArray, video];

            await AsyncStorage.setItem('videos', JSON.stringify(updatedVideos));

            set({ videos: updatedVideos });
        } catch (error) {}
    },

    updateVideo: async (id, updates) => {
        set((state) => ({
            videos: state.videos.map((video) =>
                video.id === id ? { ...video, ...updates } : video
            ),
        }));

        try {
            const storedVideos = await AsyncStorage.getItem('videos');
            let videosArray = storedVideos ? JSON.parse(storedVideos) : [];

            videosArray = videosArray.map((video: VideoItem) =>
                video.id === id ? { ...video, ...updates } : video
            );

            await AsyncStorage.setItem('videos', JSON.stringify(videosArray));
        } catch (error) {}
    },

    removeVideo: async (id) => {
        set((state) => ({
            videos: state.videos.filter(video => video.id !== id),
        }));

        try {
            const storedVideos = await AsyncStorage.getItem('videos');
            let videosArray = storedVideos ? JSON.parse(storedVideos) : [];
            videosArray = videosArray.filter((video: VideoItem) => video.id !== id);
            await AsyncStorage.setItem('videos', JSON.stringify(videosArray));
        } catch (error) {}
    },

    loadVideos: async () => {
        try {
            const storedVideos = await AsyncStorage.getItem('videos');
            if (storedVideos) {
                set({ videos: JSON.parse(storedVideos) });
            }
        } catch (error) {}
    },
}));