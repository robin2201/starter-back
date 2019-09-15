import { writeFilePromise } from "../utils/writeFile.utils";
import { ModuleInfos } from "../module-generator";

export const getValidatorTemplate = (moduleName: string, path: string, levelImport: string): Buffer => {
    const moduleNameCapitalize: string = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
    const moduleNameController: string = `get${moduleNameCapitalize}Controller`;

    return Buffer.from(`
// INTERFACES
import { IRoutes } from "${levelImport}interfaces/routes.interface";

// CONTROLLERS
import { ${moduleNameController} } from "./${moduleName}.controller";

// VALIDATORS
import { get${moduleNameCapitalize}Validation } from "./${moduleName}.validator"

const routes: IRoutes[] = [
    {
        path: '/${path}',
        method: 'get',
        session: false,
        validate: get${moduleNameCapitalize}Validation,
        handler: [
            ${moduleNameController}
        ]
    }
];

export default routes;
`)
};

export const generateRouteFile = async (moduleInfos: ModuleInfos): Promise<void> => {
    const file: Buffer = getValidatorTemplate(moduleInfos.name, moduleInfos.path, moduleInfos.levelImport);

    const filename: string = `${moduleInfos.absolutePath}/${moduleInfos.name}.routes.ts`;

    await writeFilePromise(filename, file);
    console.log("\x1b[32m", "File", filename, "\x1b[0m");
};
