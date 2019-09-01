import { writeFilePromise } from "../utils/writeFile.utils";

export const getValidatorTemplate = (moduleName: string): Buffer => {
    const moduleNameCapitalize: string = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
    const moduleNameController: string = `get${moduleNameCapitalize}Controller`;

    return Buffer.from(`
// INTERFACES
import { IRoutes } from "../../interfaces/routes.interface";

// CONTROLLERS
import { ${moduleNameController} } from "./${moduleName}.controller";

// VALIDATORS
import { get${moduleNameCapitalize}Validation } from "./${moduleName}.validator"

const routes: IRoutes[] = [
    {
        path: '/${moduleName}',
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

export const generateRouteFile = async (path: string, moduleName: string): Promise<any> => {
    const file: Buffer = getValidatorTemplate(moduleName);
    const filename: string = `${path}/${moduleName}.routes.ts`;

    await writeFilePromise(filename, file);
    console.log("\x1b[32m", "Success generate file", filename, "\x1b[0m");
};
