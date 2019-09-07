import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator/check";
import { IMyError, MyError } from "../../utils/errors/errors.utils";

export async function validateRequest(req: Request, res: Response, next: NextFunction): Promise<void> {

    try {

        validationResult(req).throw();

        next();
    } catch (e) {
        e.array().forEach((i: any) => console.log(i));

        const err: IMyError = new MyError('bad_request', 400);

        next(err);
    }
}
