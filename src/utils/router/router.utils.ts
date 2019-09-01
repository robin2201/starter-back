import { Router } from "express";
import { createCustomLogger } from "../../modules/logger";
import { checkSchema } from "express-validator/check";
import { validateRequest } from "../../middlewares/validators/express-validate.middleware";
import { sessionMiddleware } from "../../middlewares/session/session.middleware";
import { IRoutes } from "../../interfaces/routes.interface";
import { notStrictEqual } from "assert";

const iRoutesRequiredFields: string[] = [
    "method",
    "path",
    "handler",
    "session",
];

const validateRouteObject = (route: IRoutes, moduleName: string): void => {
    for (const requiredFied of iRoutesRequiredFields) {
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

const loadRoute = async (route: IRoutes, moduleName: string, router: Router): Promise<void> => {
    validateRouteObject(route, moduleName);

    const method: string = route.method.toLowerCase();
    const middlewaresHandlers = [];

    if (route.validate) {
        middlewaresHandlers.push(
            checkSchema(route.validate),
            validateRequest
        );
    }

    if (route.session) {
        middlewaresHandlers.push(sessionMiddleware);
    }

    // @ts-ignore
    router[method](route.path, [
        ...middlewaresHandlers,
        ...route.handler
    ]);
};

export default async (routes: IRoutes[], moduleName: string): Promise<Router> => {
    const loggerRoutes = createCustomLogger(`module-${moduleName}-routes`);

    loggerRoutes.info(`Start routes import for module ${moduleName}`);

    const router: Router = Router();

    await Promise.all(
        routes.map(async route => loadRoute(route, moduleName, router))
    );

    return router;
}
