import { Router } from "express";
import { createCustomLogger } from "../../modules/logger";
import { checkSchema } from "express-validator/check";
import { validateRequest } from "../../middlewares/validators/express-validate.middleware";
import { getSessionMiddleware } from "../../modules/session/session.controller";
import { IRoutes } from "../../interfaces/routes.interface";

export default async (routes: IRoutes[], moduleName: string): Promise<Router> => {
    const loggerRoutes = createCustomLogger(`module-${moduleName}-routes`);

    loggerRoutes.info('Start routes import');

    const router: Router = Router();

    for (const r of routes) {

        const middleWaresHandler = [];

        if (r.validate) {
            middleWaresHandler.push(checkSchema(r.validate));
            middleWaresHandler.push(validateRequest)
        }

        if (r.session) middleWaresHandler.push(getSessionMiddleware);

        // @ts-ignore
        router[r.method](r.path, [ ...middleWaresHandler, ...r.handler ]);
    }

    return router;
}
