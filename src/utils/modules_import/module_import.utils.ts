import { join } from "path";
import { lstat, readdir } from "fs";
import { Express, Router } from "express";
import {IRoutes} from "../../interfaces/routes.interface";
import {notStrictEqual} from "assert";

// ROUTER
import addRoutes from "../../utils/router/router.utils";

const regexInitFile: RegExp = new RegExp('init', 'gm');
const regexRouteFile: RegExp = new RegExp('routes', 'gm');

const getBaseDir = (): string => {
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

const promiseReadDir = async (dir: string): Promise<string[]> => {
  return new Promise<any>((resolve, reject)  =>  {
    readdir(dir, (err, data) => {
        if (err) {
            reject(err);
            return;
        }
        resolve(data);
    })
  })
};

const getIsDir = async (filePath: string): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        lstat(filePath, (err, res) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(res.isDirectory());
        })
    })
};

export const importModulesRecursively = async (app: Express): Promise<void> => {
    const modulesBaseDir: string = `${getBaseDir()}/modules`;
    const modulesDirNames: string[] = await promiseReadDir(modulesBaseDir);

    for (const moduleDirName of modulesDirNames) {
        const path: string = `${modulesBaseDir}/${moduleDirName}`;
        const isDir: boolean = await getIsDir(path);

        if (!isDir) {
            continue;
        }

        const dir: string[] = (await promiseReadDir(path))
            .reduce((acum, p) => {
                   if (p.match(regexInitFile)) {
                       acum.unshift(p);
                   } else if (p.match(regexRouteFile)) {
                       acum.push(p);
                   }
                   return acum;
            }, []);

        if (!dir.length) {
            continue;
        }

        for (const fileName of dir) {
            const pathFile: string = `${path}/${fileName}`;

            if (pathFile.match(regexInitFile)) {
                const initFunction: Function = require(pathFile).default;
                await initFunction();
            } else {
                const routes: IRoutes[] = require(pathFile).default;

                notStrictEqual(
                    routes.length,
                    0,
                    `router_${fileName}_need_default_export`);

                const moduleName: string = fileName.split('.').shift();
                const router: Router = await addRoutes(routes, moduleName);
                app.use(router);
            }
        }
    }
};
