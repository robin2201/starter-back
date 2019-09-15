import { readFile, writeFile } from "fs";
import { generateKeyPair } from "crypto";

export async function getRsaPrivateKey(): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
        readFile('.jwt/rsa/private.pem',(err, buffer) => err ? reject(err) : resolve(buffer));
    })
}

export async function getRsaPublicKey(): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
        readFile('.jwt/rsa/public.pem',(err, buffer) => err ? reject(err) : resolve(buffer));
    });
}

export const generateRsaKeys = async () => {
    generateKeyPair('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
            cipher: 'aes-256-cbc',
            passphrase: 'top secret'
        }
    }, (err, publicKey, privateKey) => {
        let base: boolean = false;

        const baseRsaKey: string = __dirname.split('/').map((path) => {
            if (path === 'back') {
                base = true;
                return path;
            }

            if (!base) { return path }
        }).filter((path) => path).join('/');

        console.log(baseRsaKey)
        // console.log(__dirname);
        // console.log('===================================')
        // console.log(publicKey);
        // console.log('------------------------');
        // console.log(privateKey);
    });
}
