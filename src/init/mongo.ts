import { MongoClient, Collection } from "mongodb";
import { createCustomLogger } from "../modules/logger";
import { Logger } from "winston";
import { MyError } from "../utils/errors/errors.utils";

let client: MongoClient;

const mongoLogger: Logger = createCustomLogger('app-mongo');

interface mongoConnection {
    uri: string;
    dbName: string;
}

const mongo: mongoConnection =  {
        uri: process.env.MONGO_CLUSTER_URI,
        dbName: process.env.DB_NAME
};

export const getCollection = async (name: string): Promise<Collection> => {
    const col: Collection = client.db(mongo.dbName).collection(name);

    if (!col) {
        mongoLogger.error(`Collection ${name} not loaded`);
        throw new MyError('mongo_db_fail', 500);
    }

    return col;
};

export const createCollection = async (collectionName: string, schema: any): Promise<any> => {
    await client.db(mongo.dbName).createCollection(collectionName, schema);
};

export const checkIfCollectionExist = async (collectionName: string): Promise<boolean> => {
    return !!(
        await client
        .db(mongo.dbName)
        .listCollections({}, { nameOnly: true })
        .toArray()
    ).find(({ name }) => name === collectionName)
};

export default async function mongoInit(): Promise<void> {
    mongoLogger.info(`Start connection to MongoDB: ${mongo.dbName}`);

    try {
        client = await MongoClient.connect(mongo.uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        mongoLogger.info(`Success connection to MongoDB`);

        return;
    } catch (e) {
        mongoLogger.error(`Fail mongodb connection on URI ${mongo.uri}`);
        throw e;
    }
}
