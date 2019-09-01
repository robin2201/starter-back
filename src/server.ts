import app from './app';
import { Logger } from "winston";
import { createCustomLogger } from "./modules/logger";
import MemoryUsage = NodeJS.MemoryUsage;

const port: number = parseInt(process.env.PORT) || 8000;
const serverLogger: Logger = createCustomLogger('app-server');
const execStart: [number, number] = process.hrtime();

(async () => {

    app()
        .then(server => {
            server.listen(port, () => serverLogger.info(`success server connection on port ${port}`));
    })
        .catch((e) => {
            console.log(e);
            process.exit(1);
    })
        .finally( () => {
            // Check used memory and app loading init time
            const {
                rss,
                heapTotal,
                heapUsed,
                external,
            }: MemoryUsage = process.memoryUsage();

            console.log(
                "\x1b[34mProcess Execution Review\x1b[0m", {
                execTime: `${process.hrtime(execStart)[1] / 1000000} ms`,
                rss: `${Math.round(rss / 1024 / 1024 * 100) / 100} MB`,
                heapTotal: `${Math.round(heapTotal / 1024 / 1024 * 100) / 100} MB`,
                heapUsed: `${Math.round(heapUsed / 1024 / 1024 * 100) / 100} MB`,
                external: `${Math.round(external / 1024 / 1024 * 100) / 100} MB`,
            });
        });
})();
