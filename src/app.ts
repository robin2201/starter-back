// CORE
import express, { Express, NextFunction, Request, Response, Router } from 'express';
import morgan from 'morgan';
import compression from 'compression';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
require('dotenv').config();

// TOOLS
import { createCustomLogger } from "./modules/logger";

// ROUTES
import addProductsRoutes from "./modules/products/products.routes";
import addSessionRoutes from "./modules/session/session.routes";

// INTERFACES
import { errorsHandlerMiddleware, IMyError, MyError } from "./utils/errors/errors.utils";
import { Logger } from "winston";
import { mongoInit } from "./modules/mongo";

const loadAllRoutes = async (app: Express): Promise<void> => {
    const routers: Router[] = await Promise.all([
        addSessionRoutes(),
        addProductsRoutes(),
    ]);

    if (!routers) {
        return;
    }

    for (const r of routers) {
        app.use(r);
    }

    return;
};

export default async (): Promise<Express> => {
    const app: Express = express();

    const logger: Logger = createCustomLogger('app-module');

    logger.info(`Init Server on env ${process.env.NODE_ENV}`);

    if (process.env.NODE_ENV !== 'production') {
        const cors = require('cors');
        app.use(cors({ credentials: true }));
    }
    app.use(cookieParser())
        .use(helmet())
        .use(morgan('short'))
        .use(compression())
        .use(express.json())
        .use(express.urlencoded( { extended: true }));

    app.get('/ping', async (req: Request, res: Response): Promise<Response> => res.status(200).send('pong'));

    await mongoInit();
    await loadAllRoutes(app);

    app.get('*', notFoundRouteMiddleware);

    app.use(errorsHandlerMiddleware);

    return app;
}

async function notFoundRouteMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
    const err: IMyError = new MyError('not_found', 404);

    next(err);
}
