import {writeFilePromise} from "../utils/writeFile.utils";

const getServiceTemplate = (moduleName: string): Buffer => {
    const moduleNameCapitalize: string = `${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}`;
    const serviceFunctionName: string = `get${moduleNameCapitalize}Service`

    return Buffer.from(`
// QUERY
import { get${moduleNameCapitalize} } from "./${moduleName}.query";

// UTILS
import { MyError } from "../../utils/errors/errors.utils";

export const ${serviceFunctionName} = async (query: { [key: string]: any }): Promise<any> => {
    const ${moduleName} = await get${moduleNameCapitalize}(query);
    
     if (!${moduleName}) {
        throw new MyError('${moduleName}_not_found', 404);
    }

    return ${moduleName};
};
`)
};

export const generateServiceFile = async (path: string, moduleName: string): Promise<any> => {
    const file: Buffer = await getServiceTemplate(moduleName);
    const filename: string = `${path}/${moduleName}.service.ts`;

    await writeFilePromise(filename, file);
    console.log("\x1b[32m", "Success generate file", filename, "\x1b[0m");
};
