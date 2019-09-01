import { mkdir } from "fs";
import { generateRouteFile } from "./templates/routes.template";
import { generateControllerFile } from "./templates/controller.template";
import { generateServiceFile } from "./templates/service.template";
import { generateQueryFile } from "./templates/query.template";
import { generateInitFile } from "./templates/init.template";
import { generateValidatorFile } from "./templates/validator.template";
import { getBaseDir } from "../directory/get-base-dir";

const getTemplateGenerator = (moduleName: string, path: string): any[] => {
    return [
        generateRouteFile(path, moduleName),
        generateControllerFile(path, moduleName),
        generateServiceFile(path, moduleName),
        generateQueryFile(path, moduleName),
        generateInitFile(path, moduleName),
        generateValidatorFile(path, moduleName),
    ]
};

const createDir = async (dirName: string): Promise<{path: string}> => {
  return new Promise<{path: string}>((resolve, reject) => {
      const dirPath: string = `${getBaseDir()}/modules/${dirName}`;
      mkdir(dirPath, (err) => err ? reject(err) : resolve({ path: dirPath }))
  })
};

const generate = async (moduleName: string): Promise<any> => {
    const { path } = await createDir(moduleName);

    await Promise.all(getTemplateGenerator(moduleName, path))
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

    await generate(moduleName);

    console.log(`module generated in\x1b[34m ${process.hrtime(execStart)[1] / 1000000} ms\x1b[0m`);

})().catch((e) => {
    console.log("Error", e.message);
    process.exit(e.errno)
});
