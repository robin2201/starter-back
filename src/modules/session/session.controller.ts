import { Request, Response, NextFunction } from "express";
import { createSession, getSessionService } from "./session.service";

import { IPostBodySession } from "../../interfaces/session.interface";
import { MyError } from "../../utils/errors/errors.utils";
import {IRequest} from "../../interfaces/request.interface";

// Create a new cookies with a jwt;
// Return { expiredIn: expiration date of token }
export async function postSessionController(req: Request, res: Response, next: NextFunction): Promise<void> {

    try {
        const query: IPostBodySession = req.body;

        const token: string = await createSession(query);

        // TODO add real expiresIn time
        res.cookie('token', token, {  maxAge: 100000000, httpOnly: true });

        // FIXME calc expireIn using maxAge
        const expireIn = new Date();
        expireIn.setDate(expireIn.getDate() + 1);

        res.json({ expireIn })
    } catch (e) {
        next(e);
    }
}


// Check if request contains cookies with token fields;
// If exist set req.session with token payload.
export async function getSessionMiddleware(req: IRequest, res: Response, next: NextFunction): Promise<void> {

    try {
        const cookies = req.cookies;

        if (!cookies || !cookies['token']) {
            const noCookiesExistError: MyError = new MyError('access_denied', 403);

            next(noCookiesExistError);

            return;
        }

        req.session = await getSessionService(cookies['token']);
        next();
    } catch (e) {
        next(e);
    }
}

export const deleteSessionController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {
        res.clearCookie('token');
        res.sendStatus(204);
    } catch (e) {
        next(e);
    }
};
