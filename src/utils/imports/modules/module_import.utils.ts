import { Express, Router } from "express";
import { IRoutes } from "../../../interfaces/routes.interface";
import { notStrictEqual } from "assert";

// ROUTER
import addRoutes from "../router/router_import.utils";

// UTILS
import { getBaseDir } from "../../directory/get-base-dir";
import { getIsDir } from "../../directory/is_dir";
import { promiseReadDir } from "../../directory/readdir";

const regexInitFile: RegExp = new RegExp('init', 'gm');
const regexRouteFile: RegExp = new RegExp('routes', 'gm');

// Import .routes.ts file and .init.ts
// if .routes.ts use into app
// if .init.ts only start function
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

// Get all files from a sub of /modules
// Return list of files, first init and after routes
const getFilesToLoad = async (path: string): Promise<string[]> => {
    return (await promiseReadDir(path))
        .reduce((acum: string[], p: string) => {
            if (p.match(regexInitFile)) {
                acum.unshift(p);
            } else if (p.match(regexRouteFile)) {
                acum.push(p);
            }
            return acum;
        }, []);
};

const openModuleDir = async (modulesBaseDir: string, moduleDirName: string, app: Express): Promise<void[]> => {
    const path: string = `${modulesBaseDir}/${moduleDirName}`;

    if (!await getIsDir(path)) {
        return;
    }

    const dir: string[] = await getFilesToLoad(path);

    if (!dir.length) {
        return ;
    }

    return Promise.all(
        dir.map( async (filename) => importFile(filename, path, app))
    );
};

export const importModules = async (app: Express): Promise<void> => {
    const modulesBaseDir: string = `${getBaseDir()}/modules`;
    // Get all modules
    const modulesDirNames: string[] = await promiseReadDir(modulesBaseDir);

    await Promise.all(
        modulesDirNames.map(async (moduleDirName) => openModuleDir(modulesBaseDir, moduleDirName, app))
    )
};
