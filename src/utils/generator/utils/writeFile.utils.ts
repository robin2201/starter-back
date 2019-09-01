import { writeFile } from "fs";

export const writeFilePromise = async (path: string, content: Buffer): Promise<any> => {
    return new Promise<any>((resolve, reject) => {
        writeFile(path, content, 'utf8',(err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        })
    })
};
