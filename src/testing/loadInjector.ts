import {Env} from "@tsed/core";
import {globalServerSettings} from "../common/config";
import {InjectorService} from "../common/di/services/InjectorService";
import {ExpressApplication} from "../common/mvc/decorators";
import {HttpServer} from "../common/server/decorators/httpServer";
import {HttpsServer} from "../common/server/decorators/httpsServer";

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