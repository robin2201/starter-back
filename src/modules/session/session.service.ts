import { getRsaPrivateKey, getRsaPublicKey } from "../../utils/rsa/rsa.utils";
import { sign, verify } from 'jsonwebtoken';
import { IMyError, MyError } from "../../utils/errors/errors.utils";

import { IPostBodySession, ISession } from "../../interfaces/session.interface";
import { IUser } from "../../interfaces/users.interface";
import { findUserByUserName } from "../users/users.service";
import { verifyPassword } from "../../utils/hash/hash.utils";

export async function createSession(payload: IPostBodySession): Promise<string> {
    const user: IUser = await findUserByUserName(payload.username);

    if (!user) { throw new MyError('user_not_found', 401); }

    if (!user.validation.ok) { throw new MyError('account_not_validated', 401); }

    if (!await verifyPassword(payload.password, user.password)) {
        throw new MyError('bad_request', 401);
    }

    const privateKey: Buffer = await getRsaPrivateKey();

    const session = { username: payload.username, email: user.email, id: user._id };

    return new Promise( (resolve, reject) => {
        sign(session, privateKey, { algorithm: 'RS256', expiresIn: 100000000 },(err, encoded) => {

            if (err) {
                reject(err);
                return;
            }

            resolve(encoded);
        });
    })
}

// Get key from .jwt/rsa/public.pem
export async function getSessionService(token: string): Promise<ISession> {
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
