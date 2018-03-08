import {
    ExpressApplication,
    globalServerSettings,
    HttpServer,
    HttpsServer,
    InjectorService,
    registerFactory
} from "@tsed/common";
import {Env} from "@tsed/core";

export function loadInjector() {
    if (!InjectorService.has(ExpressApplication)) {
        /* istanbul ignore next */
        const app = {
            use: () => (app),
            get: () => (app)
        };

        registerFactory(ExpressApplication, app);
        registerFactory(HttpsServer, {});
        registerFactory(HttpServer, {});
        globalServerSettings.env = Env.TEST;
    }

    InjectorService.load();
}