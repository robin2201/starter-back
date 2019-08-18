// CORE
import { Router } from "express";

// ROUTER
import addRoutes from "../../utils/router/router.utils";

// INTERFACES
import { IRoutes } from "../../interfaces/routes.interface";

// CONTROLLERS
import {
    getProductsController,
    postProductsController,
} from "./products.controller";

// VALIDATORS
import {
    getProductsValidation,
    postProductsValidation,
} from "./products.validator";

const routes: IRoutes[] = [
    {
        path: '/products',
        method: 'get',
        session: true,
        validate: getProductsValidation,
        handler: [
            getProductsController
        ]
    },
    {
        path: '/products',
        method: 'post',
        session: true,
        validate: postProductsValidation,
        handler: [
            postProductsController
        ]
    }
];

export default async (): Promise<Router> => {
    return addRoutes(routes, 'products');
}
