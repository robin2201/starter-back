import { Collection, InsertOneWriteOpResult, ObjectID } from "mongodb";
import { hashPassword } from "../../utils/hash/hash.utils";
import { getNewRandomToken } from "../../utils/token/token-generator.utils";
import { IUser, IUsersPost, IUserAccountValidation } from "../../interfaces/users.interface";
import { MyError } from "../../utils/errors/errors.utils";
import { getCollection } from "../mongo";

const getUserByIdProjection = {
    password: 0,
    validation: 0,
    createdAt: 0
};

export async function createUser(query: IUsersPost): Promise<{ created: boolean }> {
    const hasUserWithSameCredentials: boolean = await checkNameOrEmailService({
        email: query.email, username: query.username
    });

    if (hasUserWithSameCredentials) {
        throw new MyError('users_already_exist', 400);
    }

    const password: string = await hashPassword(query.password);

    const start: Date = new Date();
    const end: Date = new Date();

    end.setDate(start.getDate() + 7);

    query.pictures[0]['created'] = start;

    const validation: IUserAccountValidation = {
        ok: false,
        start,
        end,
        firstLogin: true,
        token: await getNewRandomToken(20)
    };

    const user: IUser = {
        ...query,
        createdAt: new Date(),
        password,
        validation
    };

    await insertOneUser(user);

    return { created: true };
}

export const checkNameOrEmailService = async (query: { username: string; email: string }): Promise<boolean> => {
    const $or = [
        { username: query.username },
        { email: query.email }
    ];

    const user: IUser = await findOneUserByQuery({ $or });

    return !!user;
};

export const searchUsersByUserName = async (name: string, skip: number): Promise<IUser[]> => {

     const col: Collection<IUser> = await getCollection('users');

    return col.find({
        username: { $regex: new RegExp(name) }
    }).limit(10).skip(skip).toArray();

};

export const findOneUserByQuery = async (query: any): Promise<IUser> => {
    const col: Collection<IUser> = await getCollection('users');

    return col.findOne(query, { projection: getUserByIdProjection });
};

export async function findUserByUserName(username: string): Promise<IUser> {
    const col: Collection<IUser> = await getCollection('users');

    return col.findOne({ username });
}

export async function findUserById(id: string): Promise<IUser> {
    const _id: ObjectID = new ObjectID(id);

    const col: Collection<IUser> = await getCollection('users');

    return col.findOne({ _id }, { projection: getUserByIdProjection });
}

const insertOneUser = async (user: IUser): Promise<void> => {

    const col: Collection<IUser> = await getCollection('users');

    const inserted: InsertOneWriteOpResult = await col.insertOne(user);

    if (!inserted.result.ok) {
        throw new MyError('account_not_created', 400);
    }

    return;
};
