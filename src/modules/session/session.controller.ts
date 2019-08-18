import { Request, Response, NextFunction } from "express";

import { IPostBodySession } from "../../interfaces/session.interface";
import { createSession } from "./session.service";

// Create a new cookies with a jwt;
// Return { expiredIn: expiration date of token }
export async function postSessionController(req: Request, res: Response, next: NextFunction): Promise<void> {

    try {
        const query: IPostBodySession = req.body;

        const { token, expireIn, diff } = await createSession(query);

        // TODO add real expiresIn time
        res.cookie('token', token, {  maxAge: diff, httpOnly: true });

        res.json({ expireIn })
    } catch (e) {
        next(e);
    }
}

// Remove token from cookies
export const deleteSessionController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        res.clearCookie('token');
        res.sendStatus(204);
    } catch (e) {
        next(e);
    }
};
