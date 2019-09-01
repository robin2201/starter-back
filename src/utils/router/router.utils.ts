import { Router } from "express";
import { createCustomLogger } from "../../modules/logger";
import { checkSchema } from "express-validator/check";
import { validateRequest } from "../../middlewares/validators/express-validate.middleware";
import { sessionMiddleware } from "../../middlewares/session/session.middleware";
import { IRoutes } from "../../interfaces/routes.interface";
import { notStrictEqual } from "assert";

const validateRouteObject = (route: IRoutes, moduleName: string): any => {
    for (const requiredFied of ["method", "path", "handler", "session"]) {
        for (const expected of ["undefined", ""]) {
            notStrictEqual(
                // @ts-ignore
                route[requiredFied],
                expected,
                `router_path_${requiredFied}_is_${expected ? expected : "empty"}_module:${moduleName}`);
        }

        if (requiredFied === 'handler') {
            notStrictEqual(
                route[requiredFied].length,
                0,
                `router_path_${requiredFied}_is_empty_module:${moduleName}`);
        }
    }
};

export default async (routes: IRoutes[], moduleName: string): Promise<Router> => {
    const loggerRoutes = createCustomLogger(`module-${moduleName}-routes`);

    loggerRoutes.info('Start routes import');

    const router: Router = Router();

    for (const r of routes) {


        validateRouteObject(r, moduleName);
        const method: string = r.method.toLowerCase();
        const middleWaresHandler = [];

        if (r.validate) {
            middleWaresHandler.push(checkSchema(r.validate));
            middleWaresHandler.push(validateRequest)
        }

        if (r.session) middleWaresHandler.push(sessionMiddleware);

        // @ts-ignore
        router[method](r.path, [ ...middleWaresHandler, ...r.handler ]);
    }

    return router;
}
