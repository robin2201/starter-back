import { writeFilePromise } from "../utils/writeFile.utils";
import {ModuleInfos} from "../module-generator";

const getQueryTemplate = (moduleName: string, levelImport: string): Buffer => {
    const moduleNameCapitalize: string = `${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}`;

    return Buffer.from(`
import { getCollection, checkIfCollectionExist, createCollection } from "${levelImport}init/mongo";
import { Collection } from "mongodb";

const collectionName = "${moduleName}";
let ${moduleName}Collection: Collection;

const get${moduleNameCapitalize}Indexes = () => {
    return {
        name: 1,
    }
};

const create${moduleNameCapitalize}Collection = async (): Promise<any> => {
    const validator = {
        $jsonSchema: {
            bsonType: "object",
            required: [ "name" ],
            properties: {
                name: {
                    bsonType: "string",
                    description: "must be a valid name",
                },
            }
        },
        validationLevel: "strict"
    };

    await createCollection(collectionName, { validator })
};


export const mongoCollection${moduleNameCapitalize}Init = async (): Promise<void> => {
    console.log('Start init collection ${moduleName}');
    const collectionExist: boolean = await checkIfCollectionExist(collectionName);

    if (!collectionExist) {
      // await create${moduleNameCapitalize}Collection();
    }

    ${moduleName}Collection = await getCollection(collectionName);

    // await ${moduleName}Collection.createIndex(get${moduleNameCapitalize}Indexes());
};

export const get${moduleNameCapitalize}Collection = (): Collection => {
    return ${moduleName}Collection;
};

export default async (): Promise<void> => {
    return mongoCollection${moduleNameCapitalize}Init();
}

`)
};

export const generateInitFile = async (moduleInfos: ModuleInfos): Promise<void> => {
    const file: Buffer = await getQueryTemplate(moduleInfos.name, moduleInfos.levelImport);
    const filename: string = `${moduleInfos.absolutePath}/${moduleInfos.name}.init.ts`;

    await writeFilePromise(filename, file);
    console.log("\x1b[32m", "File", filename, "\x1b[0m");
};
