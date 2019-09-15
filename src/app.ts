// CORE
import express, { Express, NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import compression from 'compression';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
const rateLimit = require("express-rate-limit");

require('dotenv').config();


import { importModules } from "./utils/imports/modules/module_import.utils";
import { importInitFiles } from "./utils/imports/inits/init_import.utils";

// TOOLS
import { createCustomLogger } from "./modules/logger";

// INTERFACES
import { errorsHandlerMiddleware, IMyError, MyError } from "./utils/errors/errors.utils";
import { Logger } from "winston";

export default async (): Promise<Express> => {
    const app: Express = express();

    const logger: Logger = createCustomLogger('app-module');

    logger.info(`Init Server on env ${process.env.NODE_ENV}`);

    if (process.env.NODE_ENV !== 'production') {
        const cors = require('cors');
        app.use(cors({ credentials: true }));
    }

    const apiLimiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100
    });

    app.use(cookieParser())
        .use(helmet())
        .use(morgan('short'))
        .use(compression())
        .use(express.json())
        .use(express.urlencoded( { extended: true }))
        .use(apiLimiter);

    app.get('/ping', async (req: Request, res: Response): Promise<Response> => res.status(200).send('pong'));

    await importInitFiles();

    await importModules(app);

    app.get('*', notFoundRouteMiddleware);

    app.use(errorsHandlerMiddleware);

    return app;
}

async function notFoundRouteMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
    const err: IMyError = new MyError('not_found', 404);

    next(err);
}
