// UTILS
import { getBaseDir } from "../../directory/get-base-dir";
import { getIsDir } from "../../directory/is_dir";
import { promiseReadDir } from "../../directory/readdir";
import { MyError } from "../../errors/errors.utils";

const loadInitFile = async (initFile: string): Promise<any> => {
    const defaultFunction = require(initFile).default;

    await defaultFunction();
};

export const importInitFiles = async () => {
    const pathInitFiles: string = `${await getBaseDir()}/init`;

    if (!await getIsDir(pathInitFiles)) {
        throw new MyError("_no_init_files", 500);
    }

    const initsFiles = await promiseReadDir(pathInitFiles);

    return Promise.all(
        initsFiles.map(async (initFile) => loadInitFile(`${pathInitFiles}/${initFile}`))
    );
};
