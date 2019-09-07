import { readdir } from "fs";

export const promiseReadDir = async (dir: string): Promise<string[]> => {
    return new Promise<string[]>((resolve, reject)  =>  {
        readdir(dir, (err, data) => err ? reject(err) : resolve(data))
    })
};

