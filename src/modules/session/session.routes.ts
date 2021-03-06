// INTERFACES
import { IRoutes } from "../../interfaces/routes.interface";

// VALIDATORS
import { PostSessionSchemaValidator } from "./session.validator";

// CONTROLLERS
import {
    postSessionController,
    deleteSessionController,
} from "./session.controller";
const routes: IRoutes[] =  [
    {
        path: "/session",
        method: "POST",
        session: false,
        validate: PostSessionSchemaValidator,
        handler: [
            postSessionController
        ]
    },
    {
        method: 'delete',
        path: '/session',
        session: false,
        handler: [
            deleteSessionController
        ]
    }
];

export default routes;
