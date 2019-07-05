// CORE
import { Router } from "express";

// ROUTER
import addRoutes from "../../utils/router/router.utils";

// CONTROLLERS
import { postSessionController, deleteSessionController } from "./session.controller";

// VALIDATORS
import { PostSessionSchemaValidator } from "./session.validation";

// INTERFACES
import { IRoutes } from "../../interfaces/routes.interface";

// TODO remove GET session only used for tests
const routes: IRoutes[] = [
    {
        method: 'post',
        path: '/session',
        session: false,
        validate: PostSessionSchemaValidator,
        handler: [
            postSessionController
        ]
    }, {
        method: 'delete',
        path: '/session',
        session: false,
        handler: [
            deleteSessionController
        ]
    }
];

export default async (): Promise<Router> => {
    return addRoutes(routes, 'session');
}
