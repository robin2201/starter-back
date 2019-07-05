import { uploadToS3, IMedias, deleteFromS3 } from "../../utils/s3/s3.utils";
import sharp from 'sharp';

export async function deleteMediasService(key: string): Promise<boolean> {
    return deleteFromS3(key)
        .then(() => true)
        .catch(e => {
            console.log(e);
            throw e;
        });
}

export async function uploadMedia(file: any): Promise<IMedias> {

    return sharp(file.buffer)
        .resize(null, null, {
            kernel: sharp.kernel.lanczos3,
            position: sharp.strategy.attention,
            fit: 'cover',
            withoutEnlargement: true
        })
        .toFormat('jpeg')
        .toBuffer()
        .then((res: Buffer) => {
            file.buffer = res;

            return uploadToS3(file)
        })
}
