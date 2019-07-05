import { Request } from "express";
import { ISession } from "./session.interface";

export interface IRequest extends Request {
    session: ISession
}
