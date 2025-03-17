// useFFmpegMutations.ts
import { useMutation } from '@tanstack/react-query';
import { cropVideo, getThumbnail } from './ffmpegServices';

export const useCropVideoMutation = () => {
    return useMutation({
        mutationFn: async ({ uri, start, duration }: { uri: string; start: number; duration: number }) =>
            cropVideo(uri, start, duration),
        onSuccess: (data) => {
            console.log('Kırpılmış video başarıyla oluşturuldu:', data);
        },
        onError: (error) => {
            console.error('Video kırpma işlemi başarısız oldu:', error);
        },
    });
};

export const useGetThumbnailMutation = () => {
    return useMutation({
        mutationFn: async ({ uri, time }: { uri: string; time: number }) => getThumbnail(uri, time),
        onSuccess: (data) => {
            console.log('Thumbnail başarıyla oluşturuldu:', data);
        },
        onError: (error) => {
            console.error('Thumbnail oluşturma işlemi başarısız oldu:', error);
        },
    });
};
