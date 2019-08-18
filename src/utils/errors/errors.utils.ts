import { NextFunction, Request, Response } from "express";

export interface IMyError extends Error {
    status: number;
}

export class MyError extends Error {
    public status: number;

    constructor(message: string, status?: number) {
        super(message);

        this.status = status;
    }
}

export async function errorsHandlerMiddleware(err: IMyError, req: Request, res: Response, next: NextFunction): Promise<void> {
    if (err.message === 'invalid_session') {
        res.clearCookie('token');
    }

    const status: number = err.status || 500;

    res.status(status).send(err.message);
}
