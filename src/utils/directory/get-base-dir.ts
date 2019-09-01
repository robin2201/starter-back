import { join } from "path";

/**
 * @return global path of this project
 */
export const getBaseDir = (): string => {
    let hasSrcDir = false;
    let baseDir = '/';

    const path: string[] = __dirname
        .split('/')
        .map((p: string) => {
            if (p !== 'src' && !hasSrcDir) {
                return p;
            }
            if (p === 'src') {
                hasSrcDir = true;
                return p;
            }
        }).filter((p: string) => p);

    for (const p of path) {
        baseDir = join(baseDir, p);
    }

    return baseDir;
};
