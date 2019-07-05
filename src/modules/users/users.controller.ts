import { NextFunction, Request, Response } from "express";
import {
    createUser,
    checkNameOrEmailService,
    searchUsersByUserName,
    findUserById,
} from "./users.service";
import {IUser, IUsersPost} from "../../interfaces/users.interface";

// Create a new User.
export async function postUsersController(req: Request, res: Response, next: NextFunction): Promise<void> {

    try {
        const query: IUsersPost = { ...req.body };
        const account: { created: boolean } = await createUser(query);

        res.json(account);
    } catch (e) {
        next(e);
    }
}

export async function postCheckNameOrEmailController(req: Request, res: Response, next: NextFunction): Promise<void> {

    try {
        const query: IUsersPost = { ...req.body };
        const exist: boolean = await checkNameOrEmailService(query);

        res.json({ exist });
    } catch (e) {
        next(e);
    }
}

export async function searchUsersByUserNameController(req: Request, res: Response, next: NextFunction): Promise<void> {

    try {
        const { username, skip } = req.query;

        const users: any[] = await searchUsersByUserName(username, +skip);

        res.json(users);
    } catch (e) {
        next(e);
    }
}

export async function getUserByIdController(req: Request, res: Response, next: NextFunction): Promise<void> {

    try {
        const { id } = req.params;
        const user: IUser = await findUserById(id);

        res.json(user);
    } catch (e) {
        next(e);
    }
}
