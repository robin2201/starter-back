import { Router, Express } from "express";
import addRoutes from "../../utils/router/router.utils";
import { IRoutes } from "../../interfaces/routes.interface";
import { googleOAuthController } from "./auth.controller";

const routes: IRoutes[] = [
    {
        method: 'post',
        path: '/auth/google/cb',
        session: false,
        handler: [ googleOAuthController ]
    }
];

export default async (app: Express): Promise<void> => {
    const authRouter: Router = await addRoutes(routes, 'auth');

    app.use(authRouter);
}
