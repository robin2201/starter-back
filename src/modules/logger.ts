import { Logger, format, createLogger, transports } from 'winston';
import { access, mkdir, constants } from "fs";
import { join, basename } from 'path';

const env: string = process.env.NODE_ENV || 'development';
const logDir: string = 'log';

access(logDir, constants.F_OK, (err: NodeJS.ErrnoException) => {
    if (err) mkdir(logDir, () => {})
});

const filename: string = join(logDir, 'results.log');

export function createCustomLogger(service: string): Logger {

    return createLogger({
        level: env === 'production' ? 'info' : 'debug',
        format: format.combine(
            format.label({ label: basename(service) }),
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })
        ),
        transports: [
            new transports.Console({
                format: format.combine(
                    format.colorize(),
                    format.printf((info) => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`)
                )
            }),
            new transports.File({
                filename,
                format: format.combine(
                    format.printf((info) => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`)
                )
            })
        ]
    });
}
