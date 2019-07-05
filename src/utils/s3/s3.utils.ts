import { getNewRandomToken } from "../token/token-generator.utils";

import { createHash } from "crypto";

const AWS = require('aws-sdk');

const s3 = new AWS.S3();
const bucketName: string = process.env.BUCKET_NAME;
const baseUrlMedias: string = process.env.BASE_URL_BUCKET + '/' + bucketName + '/';
// FIXME Configure logger

export interface IMedias {
    key: string;
    url: string;
}

// S3 Upload method
export async function uploadToS3(file: any): Promise<any> {
    const rdmName: string = await getNewRandomToken(10);
    const ext: string = file.mimetype.split('/')[1];
    const baseKey: string = (await getNewRandomToken(15)).replace('/', '')

    const key = `${baseKey}/${rdmName}.${ext}`;

    const params = {
        Bucket: bucketName,
        Key: key,
        Body: file.buffer,
        ACL: 'public-read',
        ContentType: file.mimetype
    };

    const hash: string = createHash('md5').update(file.buffer).digest('hex');

    return new Promise<IMedias>((resolve, reject): void => {

        s3.putObject(params, (err: any, data: any): void => {

            if (err) {
                reject(err);
                return;
            }

            const etag: string = data.ETag.replace(new RegExp(`"`, 'g'), "");

            if (etag !== hash) {
                console.warn('File uploaded on S3 is different')
            }

            resolve({
                key,
                url: baseUrlMedias + key
            })
        });
    });
}

export async function deleteFromS3(key: string): Promise<void> {
    const params = { Bucket: bucketName, Key: key };

    return new Promise<void>( (resolve, reject): void => {
        s3.deleteObject(params, (err: any, res: any): void => {

            if (!err) {
                resolve();
                return;
            }

            reject(err)
        });
    })

}
