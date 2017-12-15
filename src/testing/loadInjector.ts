/**
 * @module testing
 */
/** */

import {globalServerSettings} from "../config";
import {Env} from "../core/interfaces";
import {InjectorService} from "../di/services/InjectorService";
import {ExpressApplication} from "../mvc/decorators";
import {HttpServer} from "../server/decorators/httpServer";
import {HttpsServer} from "../server/decorators/httpsServer";

export function loadInjector() {
    if (!InjectorService.has(ExpressApplication)) {
        /* istanbul ignore next */
        const app = {
            use: () => (app),
            get: () => (app)
        };
        InjectorService.set(ExpressApplication, app);
        InjectorService.set(HttpsServer, {});
        InjectorService.set(HttpServer, {});
        globalServerSettings.env = Env.TEST;
    }

    InjectorService.load();
}