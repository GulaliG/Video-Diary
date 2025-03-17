// ffmpegService.ts
import { FFmpegKit } from 'ffmpeg-kit-react-native';
import * as FileSystem from 'expo-file-system';

export async function cropVideo(uri: string, start: number, duration: number): Promise<string> {
    const outputUri = `${FileSystem.documentDirectory}cropped_${Date.now()}.mp4`;
    const startTime = start.toFixed(2);
    const durationStr = duration.toFixed(2);
    const command = `-y -i "${uri}" -ss ${startTime} -t ${durationStr} -c:v copy -c:a copy "${outputUri}"`;

    const session = await FFmpegKit.execute(command);
    const returnCode = await session.getReturnCode();

    if (returnCode.getValue() !== 0) {
        throw new Error('FFmpeg işlemi başarısız oldu!');
    }

    const fileInfo = await FileSystem.getInfoAsync(outputUri);
    if (!fileInfo.exists) {
        throw new Error('Kırpılmış video bulunamadı!');
    }
    return outputUri;
}

export async function getThumbnail(uri: string, time: number): Promise<string> {
    const outputUri = `${FileSystem.cacheDirectory}thumbnail_${Date.now()}_${time}.jpg`;
    const timeStr = time.toFixed(2);
    const command = `-y -i "${uri}" -ss ${timeStr} -vframes 1 "${outputUri}"`;

    const session = await FFmpegKit.execute(command);
    const returnCode = await session.getReturnCode();

    if (returnCode.getValue() !== 0) {
        throw new Error('FFmpeg küçük resim işlemi başarısız oldu!');
    }

    const fileInfo = await FileSystem.getInfoAsync(outputUri);
    if (!fileInfo.exists) {
        throw new Error('Küçük resim bulunamadı!');
    }
    return outputUri;
}
