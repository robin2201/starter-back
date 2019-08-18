import {IPostBodySession, ISession} from "../../interfaces/session.interface";
import { IUser } from "../../interfaces/users.interface";
import {IMyError, MyError} from "../../utils/errors/errors.utils";
import { verifyPassword } from "../../utils/hash/hash.utils";
import { getRsaPrivateKey, getRsaPublicKey } from "../../utils/rsa/rsa.utils";
import { sign, verify } from 'jsonwebtoken';
import { findUserByUsername } from "../users/users.query";
import moment, { Moment } from "moment";


export interface CreateSessionResponse {
    token: string;
    expireIn: string;
    diff: number;
}

export async function createSession(payload: IPostBodySession): Promise<CreateSessionResponse> {
    const user : Partial<IUser> = await findUserByUsername(payload.username);

    if (!user) { throw new MyError('bad_request', 400); }

    if (!await verifyPassword(payload.password, user.password)) {
        throw new MyError('bad_request', 401);
    }

    const privateKey: Buffer = await getRsaPrivateKey();

    const session = { username: payload.username, _id: user._id };

    const expireIn: Moment = moment().add(1, 'days');
    const diff: number = expireIn.diff(moment());

    return new Promise( (resolve, reject) => {
        sign(session, privateKey, { algorithm: 'RS256', expiresIn: diff },(err, encoded) => {

            if (err) {
                reject(err);
                return;
            }

            resolve({
                token: encoded,
                expireIn: expireIn.format(),
                diff,
            });
        });
    })
}

// Get key from .jwt/rsa/public.pem
export async function getSession(token: string): Promise<ISession> {
    const publicKey: Buffer = await getRsaPublicKey();

    return new Promise((resolve, reject) => {

        verify(token, publicKey, (err, res) => {

            if (err) {
                const myError: IMyError = new MyError('invalid_session', 401);
                reject(myError);
                return;
            }

            const session: ISession = res as ISession;
            resolve(session);
        });
    })
}
