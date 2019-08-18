import { Response, NextFunction } from "express";
import { ISession } from "../../interfaces/session.interface";
import { IRequest } from "../../interfaces/request.interface";
import { MyError } from "../../utils/errors/errors.utils";
import { getSession } from "../../modules/session/session.service";

export const sessionMiddleware = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const cookies = req.cookies;

        if (!cookies || !cookies['token']) {
            const noCookiesExistError: MyError = new MyError('access_denied', 403);

            next(noCookiesExistError);

            return;
        }

        req.session = await getSession(cookies['token']) as ISession;
        next();
    } catch (e) {
        next(e);
    }
};
