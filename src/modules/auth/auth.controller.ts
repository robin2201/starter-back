import { Request, Response, NextFunction } from "express";

export async function googleOAuthController(req: Request, res: Response, next: NextFunction): Promise<void> {

    try {

    } catch (e) {
        next(e);
    }
}
