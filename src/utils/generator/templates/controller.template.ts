import { writeFilePromise } from "../utils/writeFile.utils";

const getControllerTemplate = (moduleName: string): Buffer => {
    const moduleNameCapitalize: string = `${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}`;
    const serviceFunctionName: string = `get${moduleNameCapitalize}Service`;

    return Buffer.from(`
// CORE
import { NextFunction, Request, Response } from "express";

// SERVICES
import { ${serviceFunctionName} } from "./${moduleName}.service";

export const get${moduleNameCapitalize}Controller = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { query } = req;

        const ${moduleName} = await ${serviceFunctionName}(query);

        res.status(200).json(${moduleName});
    } catch (e) {
        next(e);
    }
};
`)
};

export const generateControllerFile = async (path: string, moduleName: string): Promise<void> => {
    const file: Buffer = await getControllerTemplate(moduleName);
    const filename: string = `${path}/${moduleName}.controller.ts`;

    await writeFilePromise(filename, file);
    console.log("\x1b[32m", "File", filename, "\x1b[0m");
};
