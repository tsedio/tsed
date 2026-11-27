import Http from "node:http";
import Https from "node:https";

import {getHostInfoFromPort, isFunction, Type} from "@tsed/core";
import {configuration, constant, injector, logger, ProviderScope} from "@tsed/di";
import {PlatformExpress, PlatformExpressHandler, PlatformExpressResponse} from "@tsed/platform-express";
import {adapter, application, PlatformBuilder, PlatformHandler, PlatformResponse, PlatformStaticsOptions} from "@tsed/platform-http";
import fulmine from "fulmine.js";

/**
 * Ts.ED on [fulmine.js](https://github.com/nigrosimone/fulmine.js), an Express 5 compatible framework on
 * uWebSockets.js. The Express adapter does the routing; this platform changes what owns the socket: the app
 * listens on uWebSockets.js itself instead of being passed to `http.createServer()`.
 *
 * @platform
 */
export class PlatformFulmine extends PlatformExpress {
  // @ts-ignore PlatformExpress types NAME as the literal "express"
  readonly NAME = "fulmine";

  static create(module: Type<any>, settings: Partial<TsED.Configuration> = {}) {
    return new PlatformBuilder<any>({
      httpsPort: false,
      httpPort: false,
      ...PlatformBuilder.options(PlatformFulmine, module, settings)
    });
  }

  static bootstrap(module: Type<any>, settings: Partial<TsED.Configuration> = {}) {
    return new PlatformBuilder<any>(PlatformBuilder.options(PlatformFulmine, module, settings)).bootstrap();
  }

  createApp() {
    const app = constant<any>("fulmine.app") || fulmine();

    return {app, callback: () => app};
  }

  /**
   * The app is the server: it binds on uWebSockets.js and answers as an `http.Server`. TLS belongs to
   * uWebSockets.js too, see `fulmine({uwsOptions})`.
   */
  getServers(): any[] {
    // as createServer() decides it in platform-http: every value but false enables it, 0 included
    if (constant("httpsPort") !== false) {
      throw new Error("PlatformFulmine: set TLS on the fulmine app with fulmine({uwsOptions}) and the fulmine.app setting");
    }

    const app = application<any>().getApp();
    const port = constant<string | number | false>("httpPort");

    // useValue as a function: DI calls a function given as useValue, and the fulmine app is one
    injector().add(Http.Server, {scope: ProviderScope.SINGLETON, useValue: () => (port !== false ? app : null)});
    injector().invoke(Http.Server);
    // null as platform-http sets it with no httpsPort: unregistered, DI would build an empty Https.Server for it
    injector().add(Https.Server, {scope: ProviderScope.SINGLETON, useValue: null});
    injector().invoke(Https.Server);

    if (port === false) {
      return [];
    }

    return [
      async () => {
        const hostInfo = getHostInfoFromPort("http", port as any);

        await new Promise<void>((resolve, reject) => {
          app.listen(Number(hostInfo.port), hostInfo.address, (err?: Error) => (err ? reject(err) : resolve()));
        });

        hostInfo.port = app.address().port;
        logger().info(`Listen server on ${hostInfo.toString()}`);
        configuration().set("httpPort", `${hostInfo.address}:${hostInfo.port}`);

        return app;
      }
    ];
  }

  statics(_endpoint: string, options: PlatformStaticsOptions) {
    const {root, ...props} = options;
    const middleware = fulmine.static(root, props as any);

    return (req: any, res: any, next: any) => (res.headersSent ? next() : middleware(req, res, next));
  }

  bodyParser(type: "json" | "text" | "urlencoded", additionalOptions: any = {}): any {
    // fulmine.bodyParser.<type> is a parser that replaces the fulmine one, or the options of the fulmine one
    const configured = constant<any>(`fulmine.bodyParser.${type}`);
    const parser = isFunction(configured) ? configured : (fulmine as any)[type];
    const {verify, ...configuredOptions} = isFunction(configured) ? ({} as any) : configured || {};
    const options: any = type === "urlencoded" ? {extended: true, ...configuredOptions} : configuredOptions;

    if (type === "urlencoded") {
      this.app.getApp().set("query parser", "extended");
    }

    // rawBody is only known once the routes are mapped, so it is read per request, as in PlatformExpress
    options.verify = (req: any, res: any, buffer: Buffer, encoding: string) => {
      if (constant("rawBody")) {
        req.rawBody = buffer;
      }

      verify?.(req, res, buffer, encoding);

      return true;
    };

    return parser({...options, ...additionalOptions});
  }
}

adapter(PlatformFulmine as any, [
  {token: PlatformHandler, useClass: PlatformExpressHandler},
  {token: PlatformResponse, useClass: PlatformExpressResponse}
]);
