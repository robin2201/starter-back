import { IUser } from "../../interfaces/users.interface";
import { getCollection } from "../../init/mongo";

export const findUserByUsername = async (username: string): Promise<IUser> => {
    const col = await getCollection('users');

    return col.findOne({ username });
};
