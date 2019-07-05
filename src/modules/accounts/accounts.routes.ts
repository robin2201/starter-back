import { Router } from "express";

import addRoutes from '../../utils/router/router.utils';

import { IRoutes } from "../../interfaces/routes.interface";
import { patchAccountController, patchHealthFieldsAccountController, getAccountController } from "./accounts.controller";
import { PatchHealthValidator } from "./accounts.validation";

const routes: IRoutes[] = [
    {
        method: 'get',
        path: '/accounts',
        session: true,
        handler: [
            getAccountController
        ]
    },
    {
        method: 'patch',
        path: '/accounts',
        session: true,
        handler: [
            patchAccountController
        ]
    },
    {
        method: 'patch',
        path: '/accounts/health',
        session: true,
        validate: PatchHealthValidator,
        handler: [
            patchHealthFieldsAccountController
        ]
    }
];

export default async (): Promise<Router> => {
    // Load users routes
    return addRoutes(routes, 'users');
}
