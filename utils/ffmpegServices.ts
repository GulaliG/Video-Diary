import { FFmpegKit } from 'ffmpeg-kit-react-native';
import * as FileSystem from 'expo-file-system';

//ffmpeg fonksiyonu
export async function cropVideo(uri: string, start: number, duration: number): Promise<string> {
    const outputUri = `${FileSystem.cacheDirectory}cropped_${Date.now()}.mp4`;
    const formattedUri = uri.startsWith('file://') ? uri : `file://${uri}`;
    const startTime = start.toFixed(2);
    const command = `-y -i "${formattedUri}" -ss ${startTime} -to ${(start + duration).toFixed(2)} -c:v libx264 -preset ultrafast -crf 23 -c:a aac -b:a 128k "${outputUri}"`;

    console.log("Executing FFmpeg:", command);

    const session = await FFmpegKit.execute(command);
    if (!session) {
        throw new Error('FFmpeg oturumu başlatılamadı!');
    }

    const returnCode = await session.getReturnCode();
    if (!returnCode || returnCode.getValue() !== 0) {
        throw new Error('FFmpeg işlemi başarısız oldu!');
    }

    const fileInfo = await FileSystem.getInfoAsync(outputUri);
    console.log('Cropped video file info:', fileInfo);

    if (!fileInfo.exists) {
        throw new Error('Kırpılmış video bulunamadı!');
    }

    return outputUri;
}

export async function getThumbnail(uri: string, time: number): Promise<string> {
    const outputUri = `${FileSystem.cacheDirectory}thumbnail_${Date.now()}_${time}.jpg`;
    const formattedUri = uri.startsWith('file://') ? uri : `file://${uri}`;
    const timeStr = time.toFixed(2);
    const command = `-y -i "${formattedUri}" -ss ${timeStr} -vframes 1 "${outputUri}"`;

    console.log("Executing FFmpeg:", command);

    const session = await FFmpegKit.execute(command);
    if (!session) {
        throw new Error('FFmpeg oturumu başlatılamadı!');
    }

    const returnCode = await session.getReturnCode();
    if (!returnCode || returnCode.getValue() !== 0) {
        throw new Error('FFmpeg küçük resim işlemi başarısız oldu!');
    }

    const fileInfo = await FileSystem.getInfoAsync(outputUri);
    console.log('Thumbnail file info:', fileInfo);

    if (!fileInfo.exists) {
        throw new Error('Küçük resim bulunamadı!');
    }

    return outputUri;
}
