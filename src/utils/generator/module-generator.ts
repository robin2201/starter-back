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

      mkdir(dirPath, (err) => {
          if(err) {
              reject(err);
              return;
          }
          resolve({
              path: dirPath,
          })
      })
  })
};

const generate = async (moduleName: string): Promise<any> => {
    const { path } = await createDir(moduleName);

    await Promise.all(getTemplateGenerator(moduleName, path))
};

(async () => {
    const moduleName: string = process.argv[2];
    console.log("Start generate module", "\x1b[34m", moduleName, "\x1b[0m");

    try {
        await generate(moduleName);
    } catch (e) {
        console.log(e);
        process.exit(e.errno)
    }
})();
