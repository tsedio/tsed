import {
  ExpressApplication,
  HttpsServer,
  ServerSettingsService,
  HttpServer,
  createInjector,
  createHttpServer,
  createHttpsServer,
  createExpressApplication
} from "@tsed/common";
import {Env} from "@tsed/core";

export function loadInjector() {
  const injector = createInjector({});
  const hasExpress = injector.has(ExpressApplication);

  if (!hasExpress) {
    createExpressApplication(injector);
  }

  if (!injector.has(HttpServer)) {
    createHttpServer(injector);
  }

  if (!injector.has(HttpsServer)) {
    createHttpsServer(injector, {port: 8081});
  }

  if (!hasExpress) {
    injector.get<ServerSettingsService>(ServerSettingsService)!.env = Env.TEST;

    /* istanbul ignore next */
    injector.load().catch(err => {
      console.error(err);
      process.exit(-1);
    });
  }

  return injector;
}
