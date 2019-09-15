import { writeFilePromise } from "../utils/writeFile.utils";
import {ModuleInfos} from "../module-generator";

const getValidatorFile = (moduleName: string): Buffer => {
    const moduleNameCapitalize: string = `${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}`;

    return Buffer.from(`
// VALIDATORS
import { ValidationSchema } from "express-validator/check";

export const get${moduleNameCapitalize}Validation: ValidationSchema = {
    "filters": {
        in: ['query'],
        optional: true,
        isString: true,
    },
};
`)
};

export const generateValidatorFile = async (moduleInfos: ModuleInfos): Promise<void> => {
    const file: Buffer = await getValidatorFile(moduleInfos.name);
    const filename: string = `${moduleInfos.absolutePath}/${moduleInfos.name}.validator.ts`;

    await writeFilePromise(filename, file);
    console.log("\x1b[32m", "File", filename, "\x1b[0m");
};
