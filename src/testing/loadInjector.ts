import {ExpressApplication, globalServerSettings, HttpServer, HttpsServer, InjectorService} from "@tsed/common";
import {Env} from "@tsed/core";

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