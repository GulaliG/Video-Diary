// * ffmpeg
import { FFmpegKit } from 'ffmpeg-kit-react-native';
import * as FileSystem from 'expo-file-system';

/**
 * Videoyu belirtilen başlangıç zamanından itibaren, belirli süre  5 saniye boyunca kırpar.
 *
 * @param uri - Video dosyasının URI'si
 * @param start - Kırpmanın başlayacağı zaman
 * @param duration - Kırpılacak sürenin uzunluğu
 * @returns Oluşturulan kırpılmış videonun URI'si
 */
export async function cropVideo(uri: string, start: number, duration: number): Promise<string> {
    return new Promise((resolve, reject) => {
        const outputUri = `${FileSystem.documentDirectory}cropped_${Date.now()}.mp4`;

        const startTime = start.toFixed(2);
        const durationStr = duration.toFixed(2);

        const command = `-y -i "${uri}" -ss ${startTime} -t ${durationStr} -c:v copy -c:a copy "${outputUri}"`;

        FFmpegKit.execute(command)
            .then(async (session) => {
                try {
                    const returnCode = await session.getReturnCode();
                    const logs = await session.getLogs();
                    const logMessages = logs.map((log) => log.getMessage()).join('\n');

                    if (returnCode.getValue() === 0) {
                        const fileInfo = await FileSystem.getInfoAsync(outputUri);
                        if (!fileInfo.exists) {
                            reject(new Error('Kırpılmış video bulunamadı!'));
                            return;
                        }
                        resolve(outputUri);
                    } else {
                        reject(new Error('FFmpeg işlemi başarısız oldu!'));
                    }
                } catch (error) {
                    reject(error);
                }
            })
            .catch((error) => {
                reject(error);
            });
    });
}

/**
 * Videodan belirli bir saniyeden tek bir frame çıkararak thumbnail yani küçük resimler oluşturur.
 *
 * @param uri - Video dosyasının URI'si.
 * @param time - Thumbnail'in alınacağı zaman
 * @returns Oluşturulan thumbnail'ın URI'si.
 */
export async function getThumbnail(uri: string, time: number): Promise<string> {
    return new Promise((resolve, reject) => {
        const outputUri = `${FileSystem.cacheDirectory}thumbnail_${Date.now()}_${time}.jpg`;
        const timeStr = time.toFixed(2);
        const command = `-y -i "${uri}" -ss ${timeStr} -vframes 1 "${outputUri}"`;
        FFmpegKit.execute(command)
            .then(async (session) => {
                try {
                    const returnCode = await session.getReturnCode();
                    const logs = await session.getLogs();
                    const logMessages = logs.map((log) => log.getMessage()).join('\n');

                    if (returnCode.getValue() === 0) {
                        const fileInfo = await FileSystem.getInfoAsync(outputUri);
                        if (!fileInfo.exists) {
                            reject(new Error('Küçük resim bulunamadı!'));
                            return;
                        }
                        resolve(outputUri);
                    } else {
                        reject(new Error('FFmpeg küçük resim işlemi başarısız oldu!'));
                    }
                } catch (error) {
                    reject(error);
                }
            })
            .catch((error) => {
                reject(error);
            });
    });
}
