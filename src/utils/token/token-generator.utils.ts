import { randomBytes } from "crypto";

export async function getNewRandomToken(size: number): Promise<string> {
    return new Promise((resolve, reject) => {
       randomBytes(size, (err, buf) => {
           if (err) reject(err);

           resolve(buf.toString('hex'));
       })
    });
}