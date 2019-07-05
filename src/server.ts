import app from './app';
import { Logger } from "winston";
import { createCustomLogger } from "./modules/logger";

const port: number = 8000;
const serverLogger: Logger = createCustomLogger('app-server');

(async () => {

    app().then(server => {
        server.listen(port, () => serverLogger.info(`success server connection on port ${port}`));

    }).catch((e) => {



        console.log(e);
    })

        // .finally( () => {
        // Exec first load of app
        // console.info(`Execution time: ${process.hrtime(execStart)[1] / 1000000} ms`);
        //
        // const used = process.memoryUsage();
        // for (let key in used) {
        //     @ts-ignore
            // console.log(`${key} ${ Math.round(used[key] / 1024 / 1024 * 100) / 100 } MB`);
        // }
    // });


})();
