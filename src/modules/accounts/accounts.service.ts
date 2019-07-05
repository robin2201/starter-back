import { Collection, MongoClient, ObjectID } from "mongodb";
import { MyError } from "../../utils/errors/errors.utils";
import { getCollection } from "../mongo";
import { IProfilePicture, IUser } from "../../interfaces/users.interface";
import { IMedias } from "../../utils/s3/s3.utils";
import { BMICalculator } from "../../utils/body/bmi-calculator.utils";

const profileProjection = {
    password: 0,
    validation: 0,
    createdAt: 0
};
//
// const getMongoClient = async (): Promise<MongoClient> => {
//     return mongoConnect();
// };

export const getProfileById = async (id: string): Promise<any> => {
    const profile = await findAccountById(id);

    if (!profile) {
        throw new MyError('not_found', 404);
    }

    return profile;
};

export const updateProfileById = async (id: string, update: any): Promise<IUser> => {
    const mongoQuery: any = {};
    mongoQuery['$set'] = { ...update };

    return findOneAndUpdateProfile(id, mongoQuery);

};

export const updateHealthFieldsAccountById = async (id: string, health: any): Promise<IUser> => {
    const { weight, height } = health.health;
    const at: Date = new Date();
    const bmi: number = await BMICalculator(height / 100, weight);

    const query: { [key: string]: any } = {};
    const value = {
        at,
        weight,
        height,
        bmi
    };

    query['$push'] = {
        health: {
            $each: [ { ...value } ],
            $sort: { at: -1 }
        }
    };

    return findOneAndUpdateProfile(id, query);
};

// Add new picture to user profile
export const addPictureToProfileById = async (picture: IMedias, userId: string): Promise<IUser> => {
    const query: any = {};

    const pic: IProfilePicture = {
        createdAt: new Date(),
        default: false,
        ...picture
    };

    query['$addToSet'] = { pictures: { ...pic } };

    return findOneAndUpdateProfile(userId, query);
};

const findAccountById = async (id: string): Promise<any> => {
    const _id: ObjectID = new ObjectID(id);

    if (!_id) {
        throw new MyError('invalid_request', 400);
    }

    const col: Collection<IUser> = await getCollection('users');

    return  col.findOne({ _id }, { projection: profileProjection });
};

const findOneAndUpdateProfile = async (id: string, query: any): Promise<IUser> => {
    const _id: ObjectID = new ObjectID(id);

    if (!_id) {
        throw new MyError('invalid_request', 400);
    }

    const col: Collection<IUser> = await getCollection('users');

    const updatedProfile = await col.findOneAndUpdate({ _id }, query, {
        projection: profileProjection,
        returnOriginal: false
    });

    if (!updatedProfile || !updatedProfile.ok) {
        throw new MyError('bad_request', 400);
    }

    return updatedProfile.value;
};
