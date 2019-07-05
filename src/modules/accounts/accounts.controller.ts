import { NextFunction, Response } from "express";
import { getProfileById, updateHealthFieldsAccountById, updateProfileById } from "./accounts.service";
import { IRequest } from "../../interfaces/request.interface";

export async function getAccountController(req: IRequest, res: Response, next: NextFunction): Promise<void> {

    try {
        const query: string = req.session.id;

        const profile = await getProfileById(query);

        res.json({ profile });
    } catch (e) {
        next(e);
    }
}

export async function patchAccountController(req: IRequest, res: Response, next: NextFunction): Promise<void> {

    try {
        const id: string = req.session.id;
        const query: any = req.body.query;

        const update = await updateProfileById(id, query);

        res.json({ profile: update });
    } catch (e) {
        next(e);
    }
}

export async function patchHealthFieldsAccountController(req: IRequest, res: Response, next: NextFunction): Promise<void> {

    try {
        const id: string = req.session.id;
        const query: any = req.body;

        const update = await updateHealthFieldsAccountById(id, query);

        res.json({ profile: update });
    } catch (e) {
        next(e);
    }
}

export async function deleteAccountPictureController(req: IRequest, res: Response, next: NextFunction): Promise<void> {

}
