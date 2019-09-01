import { writeFilePromise } from "../utils/writeFile.utils";

const getQueryTemplate = (moduleName: string): Buffer => {
    const moduleNameCapitalize: string = `${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}`;

    return Buffer.from(`
// COLLECTION
import { get${moduleNameCapitalize}Collection } from "./${moduleName}.init";
import { ObjectId } from "mongodb";

export const get${moduleNameCapitalize} = async (query: { [key: string]: any }, skip = 0, limit = 20, projection = {}): Promise<any> => {
    const col = get${moduleNameCapitalize}Collection();

    return col.find(query, { projection }).skip(skip).limit(limit).toArray();
};

export const get${moduleNameCapitalize}ById = async (${moduleName}Id: string): Promise<any> => {
    const _id: ObjectId = new ObjectId(${moduleName}Id);

    return findOne${moduleNameCapitalize}({ _id });
};

const findOne${moduleNameCapitalize} = async (query: any, projection: any = {}): Promise<any> => {
    const col = get${moduleNameCapitalize}Collection();

    return col.findOne(query, { projection });
};
`)
};

export const generateQueryFile = async (path: string, moduleName: string): Promise<void> => {
    const file: Buffer = await getQueryTemplate(moduleName);
    const filename: string = `${path}/${moduleName}.query.ts`;

    await writeFilePromise(filename, file);
    console.log("\x1b[32m", "File", filename, "\x1b[0m");
};
