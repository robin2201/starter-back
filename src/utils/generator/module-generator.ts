import { mkdir } from "fs";
import { join } from "path";
import { generateRouteFile } from "./templates/routes.template";
import { generateControllerFile } from "./templates/controller.template";
import { generateServiceFile } from "./templates/service.template";
import { generateQueryFile } from "./templates/query.template";
import { generateInitFile } from "./templates/init.template";
import { generateValidatorFile } from "./templates/validator.template";

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
    const dir: { path: string } = await createDir(moduleName);

    await Promise.all([
        generateRouteFile(dir.path, moduleName),
        generateControllerFile(dir.path, moduleName),
        generateServiceFile(dir.path, moduleName),
        generateQueryFile(dir.path, moduleName),
        generateInitFile(dir.path, moduleName),
        generateValidatorFile(dir.path, moduleName),
    ])

};

(async () => {
    const moduleName: string = process.argv[2];

    console.log(moduleName);
    try {
        await generate(moduleName);
    } catch (e) {
        console.log(e);
        process.exit(e.errno)
    }
})();
