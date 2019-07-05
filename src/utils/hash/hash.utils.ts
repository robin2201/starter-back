import { randomBytes, pbkdf2 } from "crypto";

interface IPbkd2Config {
    hashBytes: number;
    iterations: number;
    algo: 'whirlpool';
    saltBytes?: number;
    encoding?: 'base64';
}

const config: IPbkd2Config = {
    hashBytes  : 64,
    saltBytes  : 16,
    iterations : 500000,
    algo       :'whirlpool',
    encoding   : 'base64'
};

export async function hashPassword(password: string): Promise<string> {
    const salt: Buffer = await getSalt();
    const hash: Buffer = await hashPbkd2(password, salt, config);

    const array: ArrayBuffer = new ArrayBuffer(hash.length + salt.length + 8);
    const hashframe: Buffer = Buffer.from(array);

    hashframe.writeUInt32BE(salt.length, 0, true);
    hashframe.writeUInt32BE(config.iterations, 4, true);

    salt.copy(hashframe, 8);
    hash.copy(hashframe, salt.length + 8);

    return hashframe.toString(config.encoding);
}

export async function verifyPassword(password: string, hashframe: string): Promise<boolean> {

    const frame: Buffer = Buffer.from(hashframe, config.encoding);
    const saltBytes: number = frame.readUInt32BE(0);
    const hashBytes: number = frame.length - saltBytes - 8;
    const iterations: number = frame.readUInt32BE(4);
    const salt: Buffer = frame.slice(8, saltBytes + 8);
    const hash: string = frame.slice(8 + saltBytes, saltBytes + hashBytes + 8).toString(config.encoding);

    const toCompare: Buffer = await hashPbkd2(password, salt, { iterations, hashBytes, algo: config.algo });

    return hash === toCompare.toString(config.encoding);
}

async function hashPbkd2(password: string, salt: Buffer, conf: IPbkd2Config): Promise<Buffer> {

    return new Promise((resolve, reject) => {

        pbkdf2(password, salt, conf.iterations, conf.hashBytes, conf.algo, (err: Error, hash: Buffer) => {
            if(err) reject(err);

            resolve(hash);
        })
    })
}

async function getSalt(): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        randomBytes(config.saltBytes, (err: Error, slt: Buffer) => {
            if (err) reject(err);

            resolve(slt);
        })
    })
}
