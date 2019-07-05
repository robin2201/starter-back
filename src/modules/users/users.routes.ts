import { Router } from "express";

import addRoutes from '../../utils/router/router.utils';

import {
    postUsersController,
    postCheckNameOrEmailController,
    searchUsersByUserNameController,
    getUserByIdController,
} from "./users.controller";
import { IRoutes } from "../../interfaces/routes.interface";
import { PostCheckNameOrEmailValidator, PostUsersSchemaValidator } from "./users.validation";

const routes: IRoutes[] = [
    {
        method: 'post',
        path: '/users',
        session: false,
        validate: PostUsersSchemaValidator,
        handler: [
            postUsersController
        ]
    },{
        method: 'post',
        path: '/users/credentials',
        session: false,
        validate: PostCheckNameOrEmailValidator,
        handler: [
            postCheckNameOrEmailController
        ]
    }, {
        method: 'get',
        path: '/users',
        session: true,
        handler: [
            searchUsersByUserNameController
        ]
    }, {
        method: 'get',
        path: '/users/:id',
        session: true,
        handler: [
            getUserByIdController
        ]
    }
];

export default async (): Promise<Router> => {
    // Load users routes
    return addRoutes(routes, 'users');
}
