import { mkdir } from "fs";
import { generateRouteFile } from "./templates/routes.template";
import { generateControllerFile } from "./templates/controller.template";
import { generateServiceFile } from "./templates/service.template";
import { generateQueryFile } from "./templates/query.template";
import { generateInitFile } from "./templates/init.template";
import { generateValidatorFile } from "./templates/validator.template";
import { getBaseDir } from "../directory/get-base-dir";
import { getIsDir } from "../directory/is_dir";
import { join } from "path";

export interface ModuleInfos {
    path: string;
    name: string;
    absolutePath: string;
    levelImport: string;
}

const getLevelImport = (levelImport: number): string => {
    const baseRequired = "../../";

    if (levelImport === 0) {
        return baseRequired;
    }

    let deepBaseRequired = baseRequired;
    while(levelImport--) {
        deepBaseRequired = join(deepBaseRequired, "../");
    }

    return deepBaseRequired;
};


const formatModuleInfos = async (moduleName: string): Promise<ModuleInfos> => {
    const splitModulePath: string[] = moduleName.split('/');
    let concatPath = '';

    for (const dir of splitModulePath) {
        concatPath = join(concatPath, dir);
        const dirPath: string = `${getBaseDir()}/modules/${concatPath}`;

        try {
            await getIsDir(dirPath);
        } catch (e) {
            console.log(`dir: ${concatPath} not exist, Created an empty directory`);
            await createDir(dirPath);
        }

    }

    return {
        path: moduleName,
        name: splitModulePath.pop(),
        levelImport: getLevelImport(splitModulePath.length),
        absolutePath: `${getBaseDir()}/modules/${concatPath}`,
    }
};

const getTemplateGenerator = (moduleInfos: ModuleInfos): any[] => {
    return [
        generateRouteFile(moduleInfos),
        generateControllerFile(moduleInfos),
        generateServiceFile(moduleInfos),
        generateQueryFile(moduleInfos),
        generateInitFile(moduleInfos),
        generateValidatorFile(moduleInfos),
    ]
};

const createDir = async (dirPath: string): Promise<{path: string}> => {
  return new Promise<{path: string}>((resolve, reject) => {
      mkdir(dirPath, (err) => err ? reject(err) : resolve({ path: dirPath }))
  })
};

const generate = async (moduleInfos: ModuleInfos): Promise<void> => {
    await Promise.all(getTemplateGenerator(moduleInfos))
};

const moduleNameChecker = (moduleName: string): void|never => {
    if (!moduleName) {
        throw new Error('no moduleName found')
    }

    if (!/[a-zA-Z]+/g.test(moduleName)) {
        throw new Error('Only alphanumerics values are tolered')
    }
};

(async () => {
    const execStart: [number, number] = process.hrtime();
    const moduleName: string = process.argv[2];

    moduleNameChecker(moduleName);

    console.log(`Generate module\x1b[34m ${moduleName}\x1b[0m`);

    const moduleInfos: ModuleInfos = await formatModuleInfos(moduleName);

    await generate(moduleInfos);

    console.log(`module generated in\x1b[34m ${process.hrtime(execStart)[1] / 1000000} ms\x1b[0m`);

})().catch((e) => {
    console.log("Error", e.message);
    process.exit(e.errno)
});
