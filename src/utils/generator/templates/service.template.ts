import {writeFilePromise} from "../utils/writeFile.utils";
import {ModuleInfos} from "../module-generator";

const getServiceTemplate = (moduleName: string, levelImport: string): Buffer => {
    const moduleNameCapitalize: string = `${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}`;
    const serviceFunctionName: string = `get${moduleNameCapitalize}Service`

    return Buffer.from(`
// QUERY
import { get${moduleNameCapitalize} } from "./${moduleName}.query";

// UTILS
import { MyError } from "${levelImport}utils/errors/errors.utils";

export const ${serviceFunctionName} = async (query: { [key: string]: any }): Promise<any> => {
    const ${moduleName} = await get${moduleNameCapitalize}(query);
    
     if (!${moduleName}) {
        throw new MyError('${moduleName}_not_found', 404);
    }

    return ${moduleName};
};
`)
};

export const generateServiceFile = async (moduleInfos: ModuleInfos): Promise<void> => {
    const file: Buffer = await getServiceTemplate(moduleInfos.name, moduleInfos.levelImport);
    const filename: string = `${moduleInfos.absolutePath}/${moduleInfos.name}.service.ts`;

    await writeFilePromise(filename, file);
    console.log("\x1b[32m", "File", filename, "\x1b[0m");
};
