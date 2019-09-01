import { lstat, readdir } from "fs";
import { Express, Router } from "express";
import {IRoutes} from "../../interfaces/routes.interface";
import {notStrictEqual} from "assert";

// ROUTER
import addRoutes from "../../utils/router/router.utils";

// UTILS
import { getBaseDir } from "../directory/get-base-dir";

const regexInitFile: RegExp = new RegExp('init', 'gm');
const regexRouteFile: RegExp = new RegExp('routes', 'gm');

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

const importFile = async (fileName: string, path: string, app: Express): Promise<void> => {
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
};

const openModuleDir = async (modulesBaseDir: string, moduleDirName: string, app: Express): Promise<void> => {
    const path: string = `${modulesBaseDir}/${moduleDirName}`;
    const isDir: boolean = await getIsDir(path);

    if (!isDir) {
        return;
    }

    const dir: string[] = (await promiseReadDir(path))
        .reduce((acum: string[], p: string) => {
            if (p.match(regexInitFile)) {
                acum.unshift(p);
            } else if (p.match(regexRouteFile)) {
                acum.push(p);
            }
            return acum;
        }, []);

    if (!dir.length) {
        return ;
    }

    await Promise.all(
        dir.map( async (filename) => importFile(filename, path, app))
    );
};

export const importModules = async (app: Express): Promise<void> => {
    const modulesBaseDir: string = `${getBaseDir()}/modules`;
    const modulesDirNames: string[] = await promiseReadDir(modulesBaseDir);

    await Promise.all(
        modulesDirNames.map(async (moduleDirName) => openModuleDir(modulesBaseDir, moduleDirName, app))
    )
};
