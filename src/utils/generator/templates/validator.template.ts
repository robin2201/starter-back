import { writeFilePromise } from "../utils/writeFile.utils";

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

export const generateValidatorFile = async (path: string, moduleName: string): Promise<void> => {
    const file: Buffer = await getValidatorFile(moduleName);
    const filename: string = `${path}/${moduleName}.validator.ts`;

    await writeFilePromise(filename, file);
    console.log("\x1b[32m", "Success generate file", filename, "\x1b[0m");
};
