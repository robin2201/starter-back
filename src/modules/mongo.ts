import { MongoClient, Collection } from "mongodb";
import { createCustomLogger } from "./logger";
import { Logger } from "winston";
import { MyError } from "../utils/errors/errors.utils";

let client: MongoClient;

const mongoLogger: Logger = createCustomLogger('app-mongo');

const mongo =  {
        url: process.env.DB_HOST,
        dbName: process.env.DB_NAME
};

// TODO replace with mongodb path in .env
const uri = process.env.MONGO_CLUSTER_URI;

export async function mongoInit(): Promise<void> {
    mongoLogger.info(`Start connection to MongoDB URI ${mongo.url}`);

    try {
        client = await MongoClient.connect(uri, { useNewUrlParser: true });

        mongoLogger.info(`Success connection to MongoDB`);

    } catch (e) {
        mongoLogger.error(`Fail mongodb connection on URI ${mongo.url}`);
        throw e;
    }

}

export async function getCollection(name: string): Promise<Collection> {
    const col: Collection = client.db('back').collection(name);

    if (!col) {
        mongoLogger.error(`Collection ${name} not loaded`);
        throw new MyError('mongo_db_fail', 500);
    }

    return col;
}
