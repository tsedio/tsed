import {
  BeforeRoutesInit,
  Configuration,
  Constant,
  Inject,
  InjectorService,
  Module,
  normalizePath,
  OnReady,
  PlatformApplication,
  PlatformContext,
  PlatformRouter,
  useCtxHandler
} from "@tsed/common";
import Fs from "fs";
import {join} from "path";
import {SwaggerSettings} from "./interfaces";
import {cssMiddleware} from "./middlewares/cssMiddleware";
import {indexMiddleware} from "./middlewares/indexMiddleware";
import {jsMiddleware} from "./middlewares/jsMiddleware";
import {redirectMiddleware} from "./middlewares/redirectMiddleware";
import {SwaggerService} from "./services/SwaggerService";
import {Env} from "@tsed/core";

const swaggerUiPath = require("swagger-ui-dist").absolutePath();

/**
 * @ignore
 */
@Module()
export class SwaggerModule implements BeforeRoutesInit, OnReady {
  @Inject()
  injector: InjectorService;

  @Inject()
  app: PlatformApplication;

  @Configuration()
  configuration: Configuration;

  @Inject()
  swaggerService: SwaggerService;

  @Constant("env")
  env: Env;

  private loaded = false;

  get settings() {
    return ([] as SwaggerSettings[]).concat(this.configuration.get<SwaggerSettings[]>("swagger")).filter((o) => !!o);
  }

  /**
   *
   */
  $beforeRoutesInit() {
    if (this.loaded) {
      return;
    }

    const urls: any[] = this.getUrls();

    this.settings.forEach((conf: SwaggerSettings) => {
      const {path = "/"} = conf;

      this.app.get(path, useCtxHandler(redirectMiddleware(path)));
      this.app.use(path, this.createRouter(conf, urls));
    });

    this.loaded = true;
  }

  $onReady() {
    // istanbul ignore next
    if (this.configuration.getBestHost) {
      const host = this.configuration.getBestHost();

      if (!host) {
        return;
      }

      const displayLog = (conf: SwaggerSettings) => {
        const {path = "/", fileName = "swagger.json", doc} = conf;

        let url = "/";

        if (host) {
          url = typeof host.port === "number" ? `${host.protocol}://${host.address}:${host.port}` : "";
        }

        this.injector.logger.info(`[${doc || "default"}] Swagger JSON is available on ${url}${normalizePath(path, fileName)}`);
        this.injector.logger.info(`[${doc || "default"}] Swagger UI is available on ${url}${path}/`);
      };

      this.settings.forEach((conf) => {
        displayLog(conf);
      });
    }

    this.generateSpecFiles();
  }

  generateSpecFiles() {
    return Promise.all(
      this.settings.map((conf) => {
        const {outFile} = conf;

        if (this.env === Env.PROD || outFile) {
          const spec = this.swaggerService.getOpenAPISpec(conf);

          if (outFile) {
            return Fs.writeFile(outFile, JSON.stringify(spec, null, 2), {encoding: "utf8"}, () => {});
          }
        }
      })
    );
  }

  private getUrls() {
    return this.settings.reduce((acc: any[], conf) => {
      const {path = "/", fileName = "swagger.json", doc, hidden} = conf;

      if (!hidden) {
        acc.push({url: normalizePath(path, fileName), name: doc || path});
      }

      return acc;
    }, []);
  }

  /**
   *
   * @param conf
   * @param urls
   */
  private createRouter(conf: SwaggerSettings, urls: string[]) {
    const {disableSpec = false, fileName = "swagger.json", cssPath, jsPath, viewPath = join(__dirname, "../views/index.ejs")} = conf;
    const router = PlatformRouter.create(this.injector);

    if (!disableSpec) {
      router.get(normalizePath("/", fileName), useCtxHandler(this.middlewareSwaggerJson(conf)));
    }

    if (viewPath) {
      if (cssPath) {
        router.get("/main.css", useCtxHandler(cssMiddleware(cssPath)));
      }

      if (jsPath) {
        router.get("/main.js", useCtxHandler(jsMiddleware(jsPath)));
      }

      router.get("/", useCtxHandler(indexMiddleware(viewPath, {urls, ...conf})));
      router.statics("/", {root: swaggerUiPath});
    }

    return router;
  }

  private middlewareSwaggerJson(conf: SwaggerSettings) {
    return (ctx: PlatformContext) => {
      ctx.response.status(200).body(this.swaggerService.getOpenAPISpec(conf));
    };
  }
}
