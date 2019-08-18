import { IUser } from "../../interfaces/users.interface";
import { getCollection } from "../mongo";

export const findUserByUsername = async (username: string): Promise<IUser> => {
    const col = await getCollection('users');

    return col.findOne({ username });
};
