import { readFile } from "fs";

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
