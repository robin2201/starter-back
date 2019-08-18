import { MongoClient, Collection } from "mongodb";
import { createCustomLogger } from "./logger";
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

// TODO replace with mongodb path in .env

export async function mongoInit(): Promise<void> {
    mongoLogger.info(`Start connection to MongoDB: ${mongo.dbName}`);

    try {
        client = await MongoClient.connect(mongo.uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        mongoLogger.info(`Success connection to MongoDB`);

    } catch (e) {
        mongoLogger.error(`Fail mongodb connection on URI ${mongo.uri}`);
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
