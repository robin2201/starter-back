import { lstat } from "fs";

export const getIsDir = async (filePath: string): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) =>
        lstat(filePath, (err, res) => err ? reject(err) : resolve(res.isDirectory()))
    );
};
